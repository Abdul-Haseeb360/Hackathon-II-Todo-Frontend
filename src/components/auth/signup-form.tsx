'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import useAuth from '@/hooks/use-auth';

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface SignupFormProps {
  onSignupSuccess?: () => void;
}

export default function SignupForm({ onSignupSuccess }: SignupFormProps) {
  const router = useRouter();
  const { register, loading, refreshAuth } = useAuth();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
        name: values.name,
      }),
    });

    if (response.status === 200) {
      const data = await response.json();

      // Debug logging
      console.log("API response status:", response.status);
      console.log("API response data:", data);
      console.log("Token from response:", data.token);

      // Save token to localStorage
      if (data && data.token) {
        localStorage.setItem('auth_token', data.token);
        console.log("Saving token to localStorage:", localStorage.getItem("auth_token"));

        // Store session data
        const sessionData = {
          user: data.user,
          token: data.token,
          timestamp: Date.now(),
        };
        localStorage.setItem('auth_session', JSON.stringify(sessionData));
      } else {
        console.error("No token in response");
      }

      // Update auth state by calling refreshAuth from the useAuth hook
      if (refreshAuth) refreshAuth();

      console.log("Redirecting to dashboard");

      if (onSignupSuccess) {
        onSignupSuccess();
      } else {
        // Add slight delay to ensure state updates before redirect
        setTimeout(() => router.push('/dashboard'), 500);
      }
    } else {
      const errorData = await response.json();
      form.setError('root', {
        type: 'manual',
        message: errorData.error || 'Registration failed',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="name@example.com"
                  type="email"
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{form.formState.errors.root.message}</span>
          </div>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>
    </Form>
  );
}