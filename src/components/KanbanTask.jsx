import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { FaGripLines, FaTrash, FaCheck } from 'react-icons/fa';
import { useTodos } from '../hooks/useFirestore';

const KanbanTask = ({ task, index }) => {
  const { deleteTodo, updateTodo } = useTodos();

  const getPriorityColor = () => {
    // Basic heuristics based on text content (the AI organization handles status, but this adds visual flair)
    const lowerText = task.text.toLowerCase();
    if (lowerText.includes('urgent') || lowerText.includes('asap') || lowerText.includes('bug')) {
      return 'border-l-4 border-red-500';
    }
    if (lowerText.includes('soon') || lowerText.includes('important')) {
      return 'border-l-4 border-yellow-500';
    }
    return 'border-l-4 border-blue-500';
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`group bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-3 ${getPriorityColor()} ${
            snapshot.isDragging ? 'shadow-xl ring-2 ring-indigo-500 rotate-2 scale-105' : 'hover:shadow-md'
          } transition-all duration-200`}
        >
          <div className="flex items-start">
            <div 
              {...provided.dragHandleProps}
              className="mt-1 mr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing"
            >
              <FaGripLines />
            </div>
            <div className="flex-1">
              <p className={`text-sm text-gray-800 dark:text-gray-200 ${task.status === 'done' ? 'line-through text-gray-500 dark:text-gray-500' : ''}`}>
                {task.text}
              </p>
            </div>
            <div className="flex space-x-2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
               {task.status !== 'done' && (
                  <button 
                    onClick={() => updateTodo(task.id, { status: 'done' })}
                    className="text-green-500 hover:text-green-600 transition-colors p-1"
                    title="Mark Done"
                  >
                    <FaCheck size={12} />
                  </button>
               )}
              <button 
                onClick={() => deleteTodo(task.id)}
                className="text-red-400 hover:text-red-500 transition-colors p-1"
                title="Delete"
              >
                <FaTrash size={12} />
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanTask;
