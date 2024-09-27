"use client";
import { motion } from "framer-motion";
import axios from 'axios';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
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
import NavBar from "@/components/ui/navbar";
import { AuroraBackground } from "@/components/ui/aurora-background";

interface Task {
  _id: string;
  text: string;
  completed: boolean;
  subtasks: Task[];
  collapsed: boolean;
}

const generateSubtasks = async (task: string, count: number): Promise<string[]> => {
  try {
    // Send a POST request to the backend API
    const response = await axios.post('/api/generate-subtasks', { task, count });
    
    // Extract subtasks from the response
    return response.data.subtasks;
  } catch (error) {
    console.error('Error generating subtasks:', error);
    return [];
  }
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

  const addGeneratedSubtasks = async () => {
    if (breakdownTask) {
      try {
        // Await the asynchronous generateSubtasks function
        const newSubtasks = await generateSubtasks(breakdownTask.text, subtaskCount);
  
        // Map the received subtasks to your task structure
        const formattedSubtasks = newSubtasks.map((subtask) => ({
          _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          text: subtask,
          completed: false,
          subtasks: [],
          collapsed: false,
        }));
  
        // Update the tasks state with the new subtasks
        setTasks(
          tasks.map((task) =>
            task._id === breakdownTask._id
              ? {
                  ...task,
                  subtasks: [...task.subtasks, ...formattedSubtasks].slice(0, 5),
                }
              : task
          )
        );
        setBreakdownTask(null);
      } catch (error) {
        console.error('Error adding generated subtasks:', error);
      }
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
        parentId !== undefined ? "ml-6 border-l-2 border-gray-300" : ""
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
              className="mx-4 flex-grow"
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
    <div className="min-h-screen">
      <AuroraBackground>
        <NavBar />

        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative "
        >
          {" "}
          <div className="max-w-4xl sm:mx-5  md:mx-5 mx-5 lg:mx-auto rounded-lg shadow-md p-6 mt-10 backdrop-blur-xl dark:bg-zinc-900/40">
           {/* <h1 className="text-2xl font-medium mb-6">
              Any task in less than 5 steps...
            </h1>
           */} <div className="flex mb-6">
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
            <ScrollArea className="sm:h-[400px] h-[300px] pr-4">
              <ul className="space-y-4">
                {tasks.map((task) => renderTask(task))}
              </ul>
            </ScrollArea>
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
                <Button
                  variant="outline"
                  className="flex justify-between w-full"
                >
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
                <ScrollArea className="h-[200px] w-full overflow-auto bg-transparent">
  <p className="p-4 rounded-md w-full overflow-x-auto font-mono whitespace-pre">
    {getFormattedData()}
  </p>
  <ScrollBar orientation="horizontal" />

</ScrollArea>

              </CollapsibleContent>
            </Collapsible>
          </div>
        </motion.div>
      </AuroraBackground>
    </div>
  );
}
