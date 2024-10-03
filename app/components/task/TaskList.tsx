'use client';

import React from 'react';
import { Task } from '@/app/types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
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

const TaskList: React.FC<TaskListProps> = ({
  tasks,
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
    <ul className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
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
  );
};

export default TaskList;
