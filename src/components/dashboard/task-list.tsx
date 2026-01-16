'use client';

import { useState } from 'react';
import { TodoTask } from '@/types';
import TaskItem from '@/components/dashboard/task-item';
import TaskModal from '@/components/dashboard/task-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';

interface TaskListProps {
  tasks: TodoTask[];
  onTaskUpdate: () => void;
  onTaskDelete: () => void;
}

export default function TaskList({ tasks, onTaskUpdate, onTaskDelete }: TaskListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TodoTask | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (task: TodoTask) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Filter tasks based on search term
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const completedTasks = filteredTasks.filter(task => task.completed);
  const pendingTasks = filteredTasks.filter(task => !task.completed);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Tasks</h3>
          <p className="text-muted-foreground">
            {tasks.length} total, {pendingTasks.length} pending, {completedTasks.length} completed
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full sm:w-64"
            />
          </div>

          <Button onClick={handleCreateNew} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        task={editingTask || undefined}
        onSuccess={onTaskUpdate}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-100">
                {pendingTasks.length}
              </span>
              Pending Tasks
            </h4>
          </div>

          <div className="space-y-3">
            {pendingTasks.length === 0 ? (
              <div className="text-center py-8 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-muted-foreground">No pending tasks</p>
                <p className="text-sm text-muted-foreground mt-1">Add a new task to get started</p>
              </div>
            ) : (
              pendingTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={onTaskDelete}
                  onToggle={onTaskUpdate}
                />
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-100">
                {completedTasks.length}
              </span>
              Completed Tasks
            </h4>
          </div>

          <div className="space-y-3">
            {completedTasks.length === 0 ? (
              <div className="text-center py-8 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-muted-foreground">No completed tasks</p>
                <p className="text-sm text-muted-foreground mt-1">Complete some tasks to see them here</p>
              </div>
            ) : (
              completedTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={onTaskDelete}
                  onToggle={onTaskUpdate}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}