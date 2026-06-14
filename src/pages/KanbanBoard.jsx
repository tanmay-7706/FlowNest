import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMagic, FaPlus } from 'react-icons/fa';
import { useTodos } from '../hooks/useFirestore';
import KanbanColumn from '../components/KanbanColumn';
import OpenRouterService from '../services/OpenRouterService';
import { LoadingSpinner } from '../components/Loading';

const INITIAL_COLUMNS = {
  'todo': { id: 'todo', title: 'To Do' },
  'in-progress': { id: 'in-progress', title: 'In Progress' },
  'done': { id: 'done', title: 'Done' }
};

const KanbanBoard = () => {
  const { todos, updateTodo, addTodo, loading } = useTodos();
  const [columns, setColumns] = useState(INITIAL_COLUMNS);
  const [tasks, setTasks] = useState({});
  const [isOrganizing, setIsOrganizing] = useState(false);

  // Sync Firebase todos to local state for fast UI rendering
  useEffect(() => {
    const newTasks = {};
    const sortedTodos = [...todos].sort((a, b) => (a.order || 0) - (b.order || 0));
    
    sortedTodos.forEach(todo => {
      newTasks[todo.id] = {
        ...todo,
        status: todo.status || 'todo'
      };
    });
    
    setTasks(newTasks);
  }, [todos]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const draggedTask = tasks[draggableId];
    const newStatus = destination.droppableId;
    
    // Optimistic UI update
    const newTasks = { ...tasks };
    newTasks[draggableId] = { ...draggedTask, status: newStatus };
    
    // Reorder logic (we need to assign new order values)
    const columnTasks = Object.values(newTasks)
      .filter(t => t.status === newStatus)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
      
    // Remove the task from its old position if moving within same column
    if (source.droppableId === destination.droppableId) {
       columnTasks.splice(source.index, 1);
       columnTasks.splice(destination.index, 0, newTasks[draggableId]);
    } else {
       // It's moving to a new column, it's already filtered into columnTasks correctly 
       // but we need to sort it into the right index
       const filtered = columnTasks.filter(t => t.id !== draggableId);
       filtered.splice(destination.index, 0, newTasks[draggableId]);
       
       // Re-assign array
       filtered.forEach((t, index) => {
         newTasks[t.id].order = index;
       });
    }

    setTasks(newTasks);

    // Persist to Firebase
    try {
      await updateTodo(draggableId, { 
        status: newStatus,
        order: destination.index // simplified order syncing
      });
    } catch (err) {
      console.error("Failed to update task status", err);
    }
  };

  const handleAIOrganize = async () => {
    setIsOrganizing(true);
    try {
      const taskList = todos.map(t => ({ id: t.id, text: t.text, status: t.status }));
      
      const prompt = `
        You are an AI Productivity Assistant. 
        Analyze the following list of tasks and organize them.
        Move tasks that seem quick, urgent, or high-priority to 'in-progress'.
        Leave backlog tasks in 'todo'.
        Leave completed tasks in 'done'.
        Return ONLY a raw JSON array of objects with { "id": "task_id", "status": "todo" | "in-progress" | "done" }.
        Tasks: ${JSON.stringify(taskList)}
      `;

      const response = await OpenRouterService.sendMessage([{ role: 'user', content: prompt }]);
      
      // Extract JSON from response
      const jsonMatch = response.match(/\[.*\]/s);
      if (jsonMatch) {
        const organizedTasks = JSON.parse(jsonMatch[0]);
        
        // Update all tasks in Firebase
        for (const update of organizedTasks) {
          if (tasks[update.id] && tasks[update.id].status !== update.status) {
            await updateTodo(update.id, { status: update.status });
          }
        }
      }
    } catch (error) {
      console.error("Failed to organize tasks", error);
    } finally {
      setIsOrganizing(false);
    }
  };

  const handleAddTask = async (status) => {
    const text = window.prompt("Enter task description:");
    if (text?.trim()) {
      await addTodo({ text, status, order: 0, completed: false });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)] flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Task Board</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your workflow efficiently</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAIOrganize}
          disabled={isOrganizing}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-lg font-medium transition-colors disabled:opacity-50"
        >
          {isOrganizing ? (
            <LoadingSpinner size="sm" className="border-t-white" />
          ) : (
            <FaMagic />
          )}
          <span>{isOrganizing ? 'Organizing...' : 'AI Organize'}</span>
        </motion.button>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full min-w-max items-start">
            {Object.values(columns).map(column => {
              const columnTasks = Object.values(tasks)
                .filter(task => task.status === column.id)
                .sort((a, b) => (a.order || 0) - (b.order || 0));

              return (
                <KanbanColumn 
                  key={column.id}
                  column={column}
                  tasks={columnTasks}
                  onAddTask={() => handleAddTask(column.id)}
                />
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default KanbanBoard;
