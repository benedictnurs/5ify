"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Plus,
  Trash2,
  SplitSquareVertical,
  Edit2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import NavBar from "@/components/ui/NavBar";

interface Task {
  _id: string;
  text: string;
  completed: boolean;
  subtasks: Task[];
  collapsed: boolean;
}

const generateSubtasks = (task: string, count: number): string[] => {
  const subtasks = [
    `Research best practices for ${task}`,
    `Create a detailed plan for ${task}`,
    `Gather necessary resources for ${task}`,
    `Execute the first phase of ${task}`,
    `Review and adjust approach to ${task}`,
    `Collaborate with team members on ${task}`,
    `Implement core functionality of ${task}`,
    `Test and debug ${task}`,
    `Document progress and learnings from ${task}`,
    `Finalize and polish ${task}`,
  ];
  return subtasks.sort(() => 0.5 - Math.random()).slice(0, count);
};

export default function Component() {
  const [newTask, setNewTask] = useState("");
  const [breakdownTask, setBreakdownTask] = useState<Task | null>(null);
  const [subtaskCount, setSubtaskCount] = useState(3);
  const [editingTask, setEditingTask] = useState<{
    _id: string;
    parentId?: string;
  } | null>(null);
  const [editText, setEditText] = useState("");
  const [isJsonOpen, setIsJsonOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([
    {
      _id: "1",
      text: "Design new website layout",
      completed: false,
      subtasks: [],
      collapsed: false,
    },
    {
      _id: "2",
      text: "Implement user authentication",
      completed: false,
      subtasks: [],
      collapsed: false,
    },
    {
      _id: "3",
      text: "Create content management system",
      completed: false,
      subtasks: [],
      collapsed: false,
    },
  ]);

  const addTask = () => {
    if (newTask.trim() !== "") {
      const newTaskObj: Task = {
        _id: Date.now().toString(),
        text: newTask,
        completed: false,
        subtasks: [],
        collapsed: false,
      };
      setTasks([...tasks, newTaskObj]);
      setNewTask("");
    }
  };

  const toggleTask = (taskId: string, subtaskId?: string) => {
    setTasks(
      tasks.map((task) => {
        if (task._id === taskId) {
          if (subtaskId !== undefined) {
            return {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask._id === subtaskId
                  ? { ...subtask, completed: !subtask.completed }
                  : subtask
              ),
            };
          }
          return { ...task, completed: !task.completed };
        }
        return task;
      })
    );
  };

  const removeTask = (taskId: string, subtaskId?: string) => {
    setTasks(
      tasks
        .map((task) => {
          if (task._id === taskId) {
            if (subtaskId !== undefined) {
              return {
                ...task,
                subtasks: task.subtasks.filter(
                  (subtask) => subtask._id !== subtaskId
                ),
              };
            }
            return task;
          }
          return task;
        })
        .filter((task) => task._id !== taskId || subtaskId !== undefined)
    );
  };

  const openBreakdownModal = (task: Task) => {
    setBreakdownTask(task);
    setSubtaskCount(Math.min(5 - task.subtasks.length, 3));
  };

  const addGeneratedSubtasks = () => {
    if (breakdownTask) {
      const newSubtasks = generateSubtasks(
        breakdownTask.text,
        subtaskCount
      ).map((subtask) => ({
        _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        text: subtask,
        completed: false,
        subtasks: [],
        collapsed: false,
      }));
      setTasks(
        tasks.map((task) =>
          task._id === breakdownTask._id
            ? {
                ...task,
                subtasks: [...task.subtasks, ...newSubtasks].slice(0, 5),
              }
            : task
        )
      );
      setBreakdownTask(null);
    }
  };

  const startEditing = (taskId: string, parentId?: string) => {
    setEditingTask({ _id: taskId, parentId });
    const taskToEdit = parentId
      ? tasks
          .find((t) => t._id === parentId)
          ?.subtasks.find((s) => s._id === taskId)
      : tasks.find((t) => t._id === taskId);
    setEditText(taskToEdit?.text || "");
  };

  const saveEdit = () => {
    if (editingTask) {
      setTasks(
        tasks.map((task) => {
          if (task._id === (editingTask.parentId || editingTask._id)) {
            if (editingTask.parentId) {
              return {
                ...task,
                subtasks: task.subtasks.map((subtask) =>
                  subtask._id === editingTask._id
                    ? { ...subtask, text: editText }
                    : subtask
                ),
              };
            }
            return { ...task, text: editText };
          }
          return task;
        })
      );
      setEditingTask(null);
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditText("");
  };

  const toggleCollapse = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task._id === taskId ? { ...task, collapsed: !task.collapsed } : task
      )
    );
  };

  const renderTask = (task: Task, parentId?: string) => (
    <li
      key={task._id}
      className={`mb-2 ${
        parentId !== undefined ? "ml-6 border-l-2 border-gray-300 pl-4" : ""
      }`}
    >
      <div className="flex items-center justify-between p-2 rounded border">
        <div className="flex items-center flex-grow">
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
          <Checkbox
            checked={task.completed}
            onCheckedChange={() =>
              toggleTask(parentId || task._id, parentId ? task._id : undefined)
            }
            id={`task-${task._id}`}
          />
          {editingTask?._id === task._id ? (
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="ml-2 flex-grow"
              autoFocus
            />
          ) : (
            <Label
              htmlFor={`task-${task._id}`}
              className={`ml-2 flex-grow ${
                task.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {task.text}
            </Label>
          )}
        </div>
        <div className="flex items-center">
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
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => startEditing(task._id, parentId)}
                title="Edit task"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              {!parentId && task.subtasks.length < 5 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openBreakdownModal(task)}
                  title="Break down task"
                >
                  <SplitSquareVertical className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  removeTask(
                    parentId || task._id,
                    parentId ? task._id : undefined
                  )
                }
                title="Remove task"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      {!task.collapsed && task.subtasks.length > 0 && (
        <ul className="mt-2">
          {task.subtasks.map((subtask) => renderTask(subtask, task._id))}
        </ul>
      )}
    </li>
  );

  const getFormattedData = () => {
    return JSON.stringify(tasks, null, 2);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getFormattedData()).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen px-6">
      <NavBar/>
      <div className="max-w-4xl mx-auto  rounded-lg shadow-md p-6 mt-10 border">
        <h1 className="text-2xl font-medium mb-6">
          Any task in less than 5 steps...
        </h1>
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
        <ul className="space-y-4">{tasks.map((task) => renderTask(task))}</ul>

        <Dialog
          open={breakdownTask !== null}
          onOpenChange={() => setBreakdownTask(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Break down: {breakdownTask?.text}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Label>Number of subtasks:</Label>
              <Slider
                min={1}
                max={5 - (breakdownTask?.subtasks.length || 0)}
                step={1}
                value={[subtaskCount]}
                onValueChange={(value) => setSubtaskCount(value[0])}
              />
              <div className="text-center">{subtaskCount}</div>
            </div>
            <DialogFooter>
              <Button onClick={addGeneratedSubtasks}>Generate</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Collapsible
          open={isJsonOpen}
          onOpenChange={setIsJsonOpen}
          className="mt-8 border rounded-md"
        >
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="flex justify-between w-full">
              <span>View JSON Data</span>
              {isJsonOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4">
            <div className="flex justify-end mb-2">
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                {isCopied ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {isCopied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <pre className="p-4 rounded-md overflow-x-auto">
              {getFormattedData()}
            </pre>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
