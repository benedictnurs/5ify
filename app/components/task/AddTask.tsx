'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface AddTaskProps {
  newTask: string;
  setNewTask: (value: string) => void;
  addTask: () => void;
}

const AddTask: React.FC<AddTaskProps> = ({ newTask, setNewTask, addTask }) => (
  <div className="flex mb-6">
    <Input
      type="text"
      value={newTask}
      onChange={(e) => setNewTask(e.target.value)}
      placeholder="Add a new task"
      className="flex-grow mr-2"
    />
    <Button onClick={addTask} size="icon" title="Add task">
      <Plus className="h-4 w-4" />
    </Button>
  </div>
);

export default AddTask;
