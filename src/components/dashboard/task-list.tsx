'use client';

import { useState } from 'react';
import { TodoTask } from '@/types';
import TaskItem from '@/components/dashboard/task-item';
import TaskForm from '@/components/dashboard/task-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TaskListProps {
  tasks: TodoTask[];
  onTaskUpdate: () => void;
  onTaskDelete: () => void;
}

export default function TaskList({ tasks, onTaskUpdate, onTaskDelete }: TaskListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<TodoTask | null>(null);

  const handleEdit = (task: TodoTask) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCreateNew = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Tasks</h3>
        <Button onClick={handleCreateNew} className='cursor-pointer'>Add New Task</Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm
              task={editingTask || undefined}
              onClose={handleFormClose}
              onSuccess={onTaskUpdate}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-2">Pending ({pendingTasks.length})</h4>
          <div className="space-y-2">
            {pendingTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending tasks</p>
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

        <div>
          <h4 className="text-md font-medium text-gray-700 mb-2">Completed ({completedTasks.length})</h4>
          <div className="space-y-2">
            {completedTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No completed tasks</p>
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