
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types"; // Use type import
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation'; // Import useRouter

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }), // Allow any password for mock
});

const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
  role: z.enum(["Заказчик", "Исполнитель"], {
    required_error: "You need to select a role.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

// Hardcoded test users
const testUsers = {
  "client@taskverse.test": { password: "password", role: "Заказчик" as UserRole },
  "freelancer@taskverse.test": { password: "password", role: "Исполнитель" as UserRole },
  "admin@taskverse.test": { password: "password", role: "Администратор" as UserRole },
};

export function AuthForm() {
  const [isLogin, setIsLogin] = React.useState(true);
  const { toast } = useToast();
  const router = useRouter(); // Initialize router

  const formSchema = isLogin ? loginSchema : registerSchema;
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isLogin
      ? { email: "", password: "" }
      : { email: "", password: "", confirmPassword: "", role: undefined },
    mode: "onChange", // Validate on change for better UX
  });

   const onSubmit = async (data: FormValues) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (isLogin) {
      // Simulate login
      const loginData = data as LoginFormValues;
      const user = testUsers[loginData.email.toLowerCase() as keyof typeof testUsers];

      if (user && user.password === loginData.password) {
        // Store user info (e.g., in localStorage for mock)
        localStorage.setItem('authUser', JSON.stringify({ email: loginData.email.toLowerCase(), role: user.role }));

        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.role}!`,
        });
        // Redirect to dashboard on successful login
        router.push('/dashboard'); // Use router.push
        router.refresh(); // Force refresh layout to update role
      } else {
         toast({
           title: "Login Failed",
           description: "Invalid email or password.",
           variant: "destructive",
         });
      }
    } else {
       // Simulate registration - For now, just show a message
       // In a real app, this would create a user and then log them in/redirect
      const registerData = data as RegisterFormValues;
      toast({
        title: "Registration Submitted (Mock)",
        description: `Registered ${registerData.email} as a ${registerData.role}. Please log in.`,
      });
       // Reset to login form after mock registration
       setIsLogin(true);
       form.reset({ email: registerData.email, password: "" });
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    form.reset(isLogin
        ? { email: "", password: "", confirmPassword: "", role: undefined }
        : { email: "", password: "" }
    ); // Reset form when switching modes
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">{isLogin ? "Login" : "Sign Up"}</h1>
          <p className="text-muted-foreground">
            {isLogin ? "Use test credentials (e.g., admin@taskverse.test / password)" : "Create an account to get started"}
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="client@taskverse.test" {...field} />
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
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isLogin && (
              <>
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Register as:</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Заказчик" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Заказчик (Client)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Исполнитель" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Исполнитель (Freelancer)
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
             <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
               {form.formState.isSubmitting ? "Processing..." : (isLogin ? "Login" : "Create Account")}
             </Button>
          </form>
        </Form>
         <div className="mt-4 text-center text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Button variant="link" onClick={toggleAuthMode} className="p-0 h-auto">
              {isLogin ? "Sign up" : "Login"}
            </Button>
         </div>
    </div>
  );
}

