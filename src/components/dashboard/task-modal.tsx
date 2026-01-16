'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TaskForm from './task-form';
import { TodoTask } from '@/types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: TodoTask;
  onSuccess: () => void;
}

export default function TaskModal({ isOpen, onClose, task, onSuccess }: TaskModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          <DialogDescription>
            {task
              ? 'Update the details of your task.'
              : 'Fill in the details to create a new task.'
            }
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          task={task}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}