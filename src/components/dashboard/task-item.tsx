import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { apiClient } from '@/lib/api';
import { TodoTask } from '@/types';
import { useState } from 'react';

interface TaskItemProps {
  task: TodoTask;
  onEdit: (task: TodoTask) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export default function TaskItem({ task, onEdit, onDelete, onToggle }: TaskItemProps) {
  const [deleting, setDeleting] = useState(false);

  const handleToggle = async () => {
    try {
      const response = await apiClient.toggleTaskCompletion(task.id);
      if (response.success) {
        onToggle(task.id);
      }
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await apiClient.deleteTask(task.id);
      if (response.success) {
        onDelete(task.id);
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={`border rounded-lg p-4 flex items-start space-x-4 ${task.completed ? 'bg-green-50' : 'bg-white'}`}>
      <div className="pt-1">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={handleToggle}
          aria-label={`Toggle task completion for ${task.title}`}
          className='cursor-pointer'
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className={`font-medium truncate ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {task.title}
          </h3>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(task)}
              className='cursor-pointer'
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className='cursor-pointer'
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
        {task.description && (
          <p className="text-sm text-gray-600 mt-1 truncate">{task.description}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Created: {new Date(task.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}