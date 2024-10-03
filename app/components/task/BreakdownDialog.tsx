'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Task } from '@/app/types';
import { Loader2 } from 'lucide-react';

interface BreakdownDialogProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  subtaskCount: number;
  setSubtaskCount: (value: number) => void;
  addGeneratedSubtasks: () => Promise<void>;
}

const BreakdownDialog: React.FC<BreakdownDialogProps> = ({
  open,
  onClose,
  task,
  subtaskCount,
  setSubtaskCount,
  addGeneratedSubtasks,
}) => {
  const [loading, setLoading] = useState(false); //For loading state

  if (!task) return null;

  const handleGenerate = async () => {
    setLoading(true); // Set loading to true before starting the async function
    try {
      await addGeneratedSubtasks(); // Call the addGeneratedSubtasks function
    } catch (error) {
      console.error('Error generating subtasks:', error);
      // Handle error
    } finally {
      setLoading(false); // Set loading to false after the async function is done
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent aria-describedby="breakdown-dialog-description">
        <DialogHeader>
          <DialogTitle>Break down: {task.text}</DialogTitle>
        </DialogHeader>
        <DialogDescription id="breakdown-dialog-description">
          Adjust the number of subtasks you want to generate for the selected task.
        </DialogDescription>
        <div className="space-y-4">
          <Label>Number of subtasks:</Label>
          <Slider
            min={1}
            max={5 - task.subtasks.length}
            step={1}
            value={[subtaskCount]}
            onValueChange={(value) => setSubtaskCount(value[0])}
            disabled={loading}
          />
          <div className="text-center">{subtaskCount}</div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </div>
            ) : (
              'Generate'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BreakdownDialog;
