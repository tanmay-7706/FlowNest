import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { useAuth } from "../context/AuthContext";

const TodoWidget = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("medium");

  useEffect(() => {
    if (!currentUser) return;

    const todosRef = collection(db, "users", currentUser.uid, "todos");

    const q = query(todosRef, orderBy("order"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData = [];
      querySnapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() });
      });
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const todosRef = collection(db, "users", currentUser.uid, "todos");
      await addDoc(todosRef, {
        text: newTask,
        completed: false,
        priority,
        order: priority === "high" ? 1 : priority === "medium" ? 2 : 3,
        createdAt: new Date(),
      });
      setNewTask("");
      setPriority("medium");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const taskRef = doc(db, "users", currentUser.uid, "todos", id);
      const task = tasks.find((task) => task.id === id);
      if (task) {
        await updateDoc(taskRef, { completed: !task.completed });
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const taskRef = doc(db, "users", currentUser.uid, "todos", id);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h2 className="text-xl font-semibold mb-4">To-Do</h2>

      <form onSubmit={addTask} className="mb-4 flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="input-field flex-grow"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="input-field w-24"
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <button type="submit" className="btn-primary !py-2 !px-3">
          <Plus size={20} />
        </button>
      </form>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <motion.li
            key={task.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id)}
                className="h-5 w-5 rounded border-gray-300 text-green-500 focus:ring-green-500"
              />
              <span className={`${task.completed ? "line-through text-gray-400" : ""}`}>
                {task.text}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-gray-400 hover:text-red-500"
            >
              <Trash2 size={16} />
            </button>
          </motion.li>
        ))}
        {tasks.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No tasks yet. Add one above!
          </p>
        )}
      </ul>
    </motion.div>
  );
};

export default TodoWidget;