'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { apiClient } from '@/lib/api';
import { TodoTask } from '@/types';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

interface TaskFormProps {
  task?: TodoTask;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TaskForm({ task, onClose, onSuccess }: TaskFormProps) {
  const isEditing = !!task;

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      completed: task?.completed || false,
    },
  });

  const onSubmit = async (values: z.infer<typeof taskSchema>) => {
    try {
      let response;

      if (isEditing && task) {
        // Update existing task
        response = await apiClient.updateTask(task.id, {
          title: values.title,
          description: values.description,
          completed: values.completed,
        });
      } else {
        // Create new task
        response = await apiClient.createTask({
          title: values.title,
          description: values.description,
          completed: values.completed || false,
        });
      }

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        form.setError('root', {
          type: 'manual',
          message: response.error || (isEditing ? 'Failed to update task' : 'Failed to create task'),
        });
      }
    } catch (error) {
      form.setError('root', {
        type: 'manual',
        message: 'An error occurred while saving the task',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Task description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex space-x-4">
          <Button type="submit" disabled={form.formState.isSubmitting} className="cursor-pointer">
            {form.formState.isSubmitting
              ? (isEditing ? 'Updating...' : 'Creating...')
              : (isEditing ? 'Update Task' : 'Create Task')}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
        {form.formState.errors.root && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{form.formState.errors.root.message}</span>
          </div>
        )}
      </form>
    </Form>
  );
}