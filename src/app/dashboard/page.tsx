'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/use-auth';
import TaskList from '@/components/dashboard/task-list';
import { apiClient } from '@/lib/api';
import { TodoTask } from '@/types';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<TodoTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { loading: authLoading, isAuthenticated } = useAuth();

  const fetchTasks = async () => {
    // Double-check authentication before fetching tasks
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.getTasks();
      if (response.status === 403) {
        // If we get a 403, redirect to login
        router.push('/auth/login');
        return;
      }
      if (response.success && response.data) {
        setTasks(response.data);
      } else {
        setError(response.error || 'Failed to fetch tasks');
      }
    } catch (err) {
      setError('An error occurred while fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (isAuthenticated) {
      fetchTasks();
    }
  }, [authLoading, isAuthenticated, router]);

  // Listen for real-time task updates from the chatbot
  useEffect(() => {
    const handleTasksUpdated = () => {
      console.log('Received tasks-updated event, refetching tasks');
      fetchTasks();
    };

    window.addEventListener('tasks-updated', handleTasksUpdated);
    return () => {
      window.removeEventListener('tasks-updated', handleTasksUpdated);
    };
  }, [isAuthenticated, fetchTasks]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div>
      <TaskList tasks={tasks} onTaskUpdate={fetchTasks} onTaskDelete={fetchTasks} />
    </div>
  );
}