import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { FaPlus } from 'react-icons/fa';
import KanbanTask from './KanbanTask';

const KanbanColumn = ({ column, tasks, onAddTask }) => {
  return (
    <div className="flex flex-col bg-gray-50/50 dark:bg-gray-800/30 rounded-xl p-4 w-80 min-w-[320px] max-h-full border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center">
          {column.title}
          <span className="ml-2 bg-gray-200 dark:bg-gray-700 text-xs py-1 px-2 rounded-full text-gray-600 dark:text-gray-300">
            {tasks.length}
          </span>
        </h2>
        <button 
          onClick={onAddTask}
          className="text-gray-400 hover:text-green-500 transition-colors p-1"
        >
          <FaPlus />
        </button>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto min-h-[150px] p-2 -mx-2 rounded-lg transition-colors ${
              snapshot.isDraggingOver ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <KanbanTask key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
