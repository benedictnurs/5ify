'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavBar from "@/components/ui/navbar";
import { AuroraBackground } from "@/components/ui/aurora-background";
import AddTask from "@/components/task/AddTask";
import TaskList from "@/components/task/TaskList";
import BreakdownDialog from "@/components/task/BreakdownDialog";
import JsonViewer from "@/components/task/JsonViewer";
import { Task, generateSubtasks } from "@/app/types";
import { useUser} from "@clerk/nextjs";

const TaskManager: React.FC = () => {
  const { isSignedIn, user } = useUser();
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

  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  const authorId = user?.id || ""; // Get user ID from Clerk

  // Fetch tasks from the API when user is signed in
  useEffect(() => {
    if (isSignedIn && authorId) {
      fetchTasks();
    } else {
      setTasks([]); // Clear tasks if not signed in
    }
  }, [isSignedIn, authorId]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/tasks?authorId=${authorId}`);
      const data = await response.json();
      if (data.success) {
        setTasks(data.tasks);
      } else {
        setError(data.message || "Failed to fetch tasks");
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("An unexpected error occurred");
    }
  };

  // Function to update tasks in the backend
  const updateTasks = async (updatedTasks: Task[]) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ authorId, tasks: updatedTasks }),
      });
      const data = await response.json();
      if (data.success) {
        console.log("Tasks updated successfully");
      } else {
        console.error("Failed to update tasks:", data.message);
      }
    } catch (err) {
      console.error("Error updating tasks:", err);
    }
  };

  const addTask = () => {
    if (newTask.trim() !== "") {
      const newTaskObj: Task = {
        _id: Date.now().toString(),
        text: newTask,
        completed: false,
        subtasks: [],
        collapsed: false,
      };
      const updatedTasks = [...tasks, newTaskObj];
      setTasks(updatedTasks);
      updateTasks(updatedTasks); // Save to backend
      setNewTask("");
    }
  };

  const toggleTask = (taskId: string, subtaskId?: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task._id === taskId) {
        if (subtaskId) {
          const updatedSubtasks = task.subtasks.map((subtask) =>
            subtask._id === subtaskId
              ? { ...subtask, completed: !subtask.completed }
              : subtask
          );
          return { ...task, subtasks: updatedSubtasks };
        }
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
    updateTasks(updatedTasks); // Save to backend
  };

  const removeTask = (taskId: string, subtaskId?: string) => {
    let updatedTasks = tasks;
    if (subtaskId) {
      updatedTasks = tasks.map((task) => {
        if (task._id === taskId) {
          const filteredSubtasks = task.subtasks.filter(
            (subtask) => subtask._id !== subtaskId
          );
          return { ...task, subtasks: filteredSubtasks };
        }
        return task;
      });
    } else {
      updatedTasks = tasks.filter((task) => task._id !== taskId);
    }
    setTasks(updatedTasks);
    updateTasks(updatedTasks); // Save to backend
  };

  const openBreakdownModal = (task: Task) => {
    setBreakdownTask(task);
    setSubtaskCount(Math.min(5 - task.subtasks.length, 3));
  };

  const addGeneratedSubtasks = async () => {
    if (breakdownTask) {
      try {
        // Concatenate existing subtasks' texts into the subtaskFlatten string
        const existingSubtaskTexts = breakdownTask.subtasks
          .map((subtask) => subtask.text)
          .join(" ");

        // Combine existing subtasks with the new subtaskFlatten string
        const combinedSubtaskFlatten = `${existingSubtaskTexts}`;

        // Pass the combined subtasks to the generateSubtasks function
        const newSubtasks = await generateSubtasks(
          combinedSubtaskFlatten,
          breakdownTask.text,
          subtaskCount
        );

        // Format the newly generated subtasks
        const formattedSubtasks = newSubtasks.map((subtask) => ({
          _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          text: subtask,
          completed: false,
          subtasks: [],
          collapsed: false,
        }));

        const updatedTasks = tasks.map((task) =>
          task._id === breakdownTask._id
            ? {
                ...task,
                subtasks: [...task.subtasks, ...formattedSubtasks].slice(0, 5),
              }
            : task
        );

        setTasks(updatedTasks);
        updateTasks(updatedTasks);
        setBreakdownTask(null);
      } catch (error) {
        console.error("Error adding generated subtasks:", error);
      }
    }
  };

  const startEditing = (taskId: string, parentId?: string) => {
    setEditingTask({ _id: taskId, parentId });
    const taskToEdit = parentId
      ? tasks.find((t) => t._id === parentId)?.subtasks.find((s) => s._id === taskId)
      : tasks.find((t) => t._id === taskId);
    setEditText(taskToEdit?.text || "");
  };

  const saveEdit = () => {
    if (editingTask) {
      const updatedTasks = tasks.map((task) => {
        if (task._id === (editingTask.parentId || editingTask._id)) {
          if (editingTask.parentId) {
            const updatedSubtasks = task.subtasks.map((subtask) =>
              subtask._id === editingTask._id
                ? { ...subtask, text: editText }
                : subtask
            );
            return { ...task, subtasks: updatedSubtasks };
          }
          return { ...task, text: editText };
        }
        return task;
      });
      setTasks(updatedTasks);
      updateTasks(updatedTasks); // Save to backend
      setEditingTask(null);
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditText("");
  };

  const toggleCollapse = (taskId: string) => {
    const updatedTasks = tasks.map((task) =>
      task._id === taskId ? { ...task, collapsed: !task.collapsed } : task
    );
    setTasks(updatedTasks);
    updateTasks(updatedTasks); // Save to backend
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

            {error ? (
              <div className="flex items-center justify-center text-red-500 mb-4">
                Error: {error}
              </div>
            ) : null}

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
