import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { apiClient } from '@/lib/api';
import { TodoTask } from '@/types';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit3, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
    <div
      className={`rounded-xl border bg-card text-card-foreground shadow-sm p-5 transition-all hover:shadow-md ${
        task.completed
          ? 'bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50'
          : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="flex items-start gap-4">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={handleToggle}
          aria-label={`Toggle task completion for ${task.title}`}
          className="mt-1 cursor-pointer"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-base truncate ${
                task.completed
                  ? 'line-through text-muted-foreground'
                  : 'text-foreground'
              }`}>
                {task.title}
              </h3>

              {task.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="flex items-center gap-2 mt-3">
                <Badge variant={task.completed ? "secondary" : "outline"} className="text-xs">
                  {task.completed ? 'Completed' : 'Pending'}
                </Badge>

                {task.createdAt && (
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(task.createdAt), 'MMM d, yyyy')}
                  </span>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  disabled={deleting}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {deleting ? 'Deleting...' : 'Delete'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}