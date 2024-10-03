// /components/task/TaskItem.tsx

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Trash2,
  Edit2,
  SplitSquareVertical,
  ChevronRight,
  ChevronDown,
  Check,
  MoreVertical,
  X, // Import MoreVertical icon for the Action button
} from "lucide-react";
import { Task } from "@/app/types";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"; // Ensure Popover components are correctly imported

interface TaskItemProps {
  task: Task;
  parentId?: string;
  toggleTask: (taskId: string, subtaskId?: string) => void;
  removeTask: (taskId: string, subtaskId?: string) => void;
  startEditing: (taskId: string, parentId?: string) => void;
  editingTask: { _id: string; parentId?: string } | null;
  editText: string;
  setEditText: (value: string) => void;
  saveEdit: () => void;
  cancelEdit: () => void;
  toggleCollapse: (taskId: string) => void;
  openBreakdownModal: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  parentId,
  toggleTask,
  removeTask,
  startEditing,
  editingTask,
  editText,
  setEditText,
  saveEdit,
  cancelEdit,
  toggleCollapse,
  openBreakdownModal,
}) => {
  return (
    <li
      key={task._id}
      className={`mb-2 ${
        parentId !== undefined ? "ml-6 border-l-2 border-gray-300 pl-4" : ""
      }`}
    >
      <div className="flex items-center justify-between p-2 rounded border">
        <div className="flex items-center flex-grow">
          {/* Collapse/Expand Button */}
          {!parentId && task.subtasks.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleCollapse(task._id)}
              className="mr-2"
              title={task.collapsed ? "Expand" : "Collapse"}
            >
              {task.collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
          {/* Checkbox */}
          <Checkbox
            checked={task.completed}
            onCheckedChange={() =>
              toggleTask(parentId || task._id, parentId ? task._id : undefined)
            }
            id={`task-${task._id}`}
          />
          {/* Task Label or Edit Input */}
          {editingTask?._id === task._id ? (
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="mx-2 flex-grow"
              autoFocus
            />
          ) : (
            <Label
              htmlFor={`task-${task._id}`}
              className={`mx-2 flex-grow ${
                task.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {task.text}
            </Label>
          )}
        </div>
        <div className="flex items-center">
          {/* Edit Mode Buttons */}
          {editingTask?._id === task._id ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={saveEdit}
                title="Save"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={cancelEdit}
                title="Cancel"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              {/* Action Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover-none"
                    title="Actions"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  sideOffset={5}
                  className="w-40 p-2 border rounded shadow-lg bg-transparent backdrop-blur-xl"
                >
                  {/* Edit Action */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEditing(task._id, parentId)}
                    className="flex items-center w-full px-2 py-1 text-left rounded"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    <span>Edit</span>
                  </Button>

                  {/* Break Down Action */}
                  {!parentId && task.subtasks.length < 5 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openBreakdownModal(task)}
                      className="flex items-center w-full px-2 py-1 text-left rounded mt-1"
                    >
                      <SplitSquareVertical className="h-4 w-4 mr-2" />
                      <span>Break Down</span>
                    </Button>
                  )}

                  {/* Remove Action */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      removeTask(parentId || task._id, parentId ? task._id : undefined)
                    }
                    className="flex items-center w-full px-2 py-1 text-left rounded mt-1 text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    <span>Remove</span>
                  </Button>
                </PopoverContent>
              </Popover>
            </>
          )}
        </div>
      </div>

      {/* Subtasks List */}
      {!task.collapsed && task.subtasks.length > 0 && (
        <ul className="mt-2">
          {task.subtasks.map((subtask) => (
            <TaskItem
              key={subtask._id}
              task={subtask}
              parentId={task._id}
              toggleTask={toggleTask}
              removeTask={removeTask}
              startEditing={startEditing}
              editingTask={editingTask}
              editText={editText}
              setEditText={setEditText}
              saveEdit={saveEdit}
              cancelEdit={cancelEdit}
              toggleCollapse={toggleCollapse}
              openBreakdownModal={openBreakdownModal}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default TaskItem;
