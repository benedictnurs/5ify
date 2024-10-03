"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavBar from "@/components/ui/navbar";
import { AuroraBackground } from "@/components/ui/aurora-background";
import AddTask from "@/components/task/AddTask";
import TaskList from "@/components/task/TaskList";
import BreakdownDialog from "@/components/task/BreakdownDialog";
import JsonViewer from "@/components/task/JsonViewer";
import { Task, generateSubtasks } from "@/app/types";

const TaskManager: React.FC = () => {
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
            return null;
          }
          return task;
        })
        .filter((task) => task !== null) as Task[]
    );
  };

  const openBreakdownModal = (task: Task) => {
    setBreakdownTask(task);
    setSubtaskCount(Math.min(5 - task.subtasks.length, 3));
  };

  const addGeneratedSubtasks = async () => {
    if (breakdownTask) {
      try {
        const newSubtasks = await generateSubtasks(
          breakdownTask.text,
          subtaskCount
        );

        const formattedSubtasks = newSubtasks.map((subtask) => ({
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
                  subtasks: [...task.subtasks, ...formattedSubtasks].slice(
                    0,
                    5
                  ),
                }
              : task
          )
        );
        setBreakdownTask(null);
      } catch (error) {
        console.error("Error adding generated subtasks:", error);
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
          className="relative"
        >
          <div className="max-w-4xl sm:mx-5 md:mx-5 mx-5 lg:mx-auto rounded-lg shadow-md p-6 mt-10 backdrop-blur-xl dark:bg-zinc-900/40">
            <AddTask
              newTask={newTask}
              setNewTask={setNewTask}
              addTask={addTask}
            />

            <ScrollArea className="sm:h-[400px] h-[300px] pr-4">
              <TaskList
                tasks={tasks}
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
            </ScrollArea>

            <BreakdownDialog
              open={breakdownTask !== null}
              onClose={() => setBreakdownTask(null)}
              task={breakdownTask}
              subtaskCount={subtaskCount}
              setSubtaskCount={setSubtaskCount}
              addGeneratedSubtasks={addGeneratedSubtasks}
            />

            <JsonViewer
              isOpen={isJsonOpen}
              toggleOpen={setIsJsonOpen}
              jsonData={getFormattedData()}
              copyToClipboard={copyToClipboard}
              isCopied={isCopied}
            />
          </div>
        </motion.div>
      </AuroraBackground>
    </div>
  );
};

export default TaskManager;
