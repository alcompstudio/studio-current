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
import { useRouter } from "next/navigation"; // Import useRouter

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }), // Allow any password for mock
});

const registerSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string(),
    role: z.enum(["Заказчик", "Исполнитель"], {
      required_error: "You need to select a role.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
  });

// Базовая схема регистрации (без refine)
const baseRegisterSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
  role: z.enum(["Заказчик", "Исполнитель"], {
    required_error: "You need to select a role.",
  }),
  name: z.string().min(1, { message: "Name is required." }), // Добавляем name сюда
});

// Финальная схема регистрации с проверкой паролей
const finalRegisterSchema = baseRegisterSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
  },
);

type LoginFormValues = z.infer<typeof loginSchema>;
// Используем финальную схему для типа
type RegisterFormValues = z.infer<typeof finalRegisterSchema>;

// REMOVE Hardcoded test users
// const testUsers = { ... };

export function AuthForm() {
  const [isLogin, setIsLogin] = React.useState(true);
  const { toast } = useToast();
  const router = useRouter(); // Initialize router

  // Используем финальную схему регистрации
  const formSchema = isLogin ? loginSchema : finalRegisterSchema;
  type FormValues = LoginFormValues | RegisterFormValues;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    // Устанавливаем defaultValues динамически в зависимости от isLogin
    // Устанавливаем defaultValues динамически в зависимости от isLogin
    // Гарантируем, что все строковые поля имеют начальное значение ""
    defaultValues: isLogin
      ? { email: "", password: "" }
      : {
          email: "",
          password: "",
          confirmPassword: "",
          role: undefined,
          name: "",
        },
    mode: "onChange",
  });

  // Обновляем onSubmit для вызова API
  const onSubmit = async (data: FormValues) => {
    const apiEndpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const requestBody = isLogin
      ? { email: data.email, password: data.password }
      : {
          email: data.email,
          password: data.password,
          role: (data as RegisterFormValues).role,
          name: (data as RegisterFormValues).name,
        }; // Добавляем name для регистрации

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      // Обрабатываем ответ
      if (!response.ok) {
        const status = response.status;
        const errorResult = await response.json().catch(() => ({
          error: `API Error: ${response.statusText} (${status})`,
        }));
        // Используем сообщение из errorResult.message, если оно есть (стандарт для API ошибок), иначе errorResult.error или дефолтное
        const serverMessage =
          errorResult.message ||
          errorResult.error ||
          `API Error: ${response.statusText} (${status})`;

        if (!isLogin && status === 409) {
          // Ошибка "Email уже занят" при регистрации
          console.log(
            "Handling 409 error locally in onSubmit for registration",
          );
          form.setError("email", {
            type: "server",
            message:
              "Этот email уже зарегистрирован. Пожалуйста, попробуйте войти.", // Можно локализовать
          });
          return;
        } else if (isLogin && (status === 401 || status === 400)) {
          // Ошибка "Неверный email или пароль" при логине
          console.log("Handling 401/400 error locally in onSubmit for login");
          form.setError("email", {
            // Устанавливаем на поле email
            type: "server",
            message: serverMessage, // Сообщение от сервера "Invalid email or password."
          });
          // Можно также установить ошибку для поля password, если хотите
          // form.setError("password", { type: "server", message: " " }); // Пустое сообщение, чтобы только подсветить
          return; // Завершаем, чтобы не попасть в общий catch и не показать toast
        } else {
          // Для всех ДРУГИХ непредвиденных ошибок от API (например, 500) - бросаем их
          const error = new Error(serverMessage);
          (error as any).status = status; // Сохраняем статус для возможной отладки
          throw error; // Эта ошибка будет поймана в catch и показана через toast
        }
      }

      // Если response.ok, читаем успешный результат
      const result = await response.json();

      // Успешный логин или регистрация
      const { userId, email, role } = result; // API должен вернуть эти поля

      if (!userId || !email || !role) {
        throw new Error("Invalid response from server: missing user data.");
      }

      // Формируем объект для сохранения
      const authDataToStore: any = { userId, email, role };
      // Добавляем customerId, если он пришел от API
      if (result.customerId) {
        authDataToStore.customerId = result.customerId;
      }
      // TODO: Добавить freelancerId, если API будет его возвращать

      // Сохраняем данные пользователя в localStorage
      localStorage.setItem("authUser", JSON.stringify(authDataToStore));
      console.log("Saved to localStorage:", authDataToStore); // Лог для отладки

      toast({
        title: isLogin ? "Login Successful" : "Registration Successful",
        description: isLogin
          ? `Welcome back!`
          : `Account created for ${email}. Welcome!`,
      });

      // Перенаправляем на дашборд
      router.push("/dashboard");
      router.refresh(); // Обновляем layout для актуализации роли
    } catch (error) {
      console.error(`Auth failed: ${apiEndpoint}`, error);
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      // const message = error instanceof Error ? error.message : 'An unknown error occurred'; // <<< Удаляем дубликат
      // const status = (error as any).status; // Статус теперь не нужен здесь

      // Catch теперь обрабатывает только НЕОЖИДАННЫЕ ошибки (не 409)
      // Проверка на 409 больше не нужна здесь
      // if (!isLogin && status === 409) { ... }

      // Показываем общую ошибку через toast для всех ошибок, попавших в catch
      toast({
        title: isLogin ? "Login Failed" : "Registration Failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  const toggleAuthMode = () => {
    const nextIsLogin = !isLogin;
    setIsLogin(nextIsLogin);
    // При переключении на РЕГИСТРАЦИЮ (nextIsLogin === false), сбрасываем ВСЕ поля регистрации
    // При переключении на ЛОГИН (nextIsLogin === true), сбрасываем поля логина
    form.reset(
      nextIsLogin
        ? { email: "", password: "" }
        : {
            email: "",
            password: "",
            confirmPassword: "",
            role: undefined,
            name: "",
          }, // Добавили name: "" сюда
    );
  };

  return (
    <div className="mx-auto max-w-md space-y-6" data-oid="d855pgu">
      <div className="space-y-2 text-center" data-oid="g1y5aj2">
        <h1 className="text-3xl font-bold" data-oid="2to4b_n">
          {isLogin ? "Login" : "Sign Up"}
        </h1>
        <p className="text-muted-foreground" data-oid="wk0tixj">
          {isLogin
            ? "Use test credentials (e.g., admin@taskverse.test / password)"
            : "Create an account to get started"}
        </p>
      </div>
      <Form {...form} data-oid="7.obs56">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          data-oid="y.z.rv1"
        >
          {!isLogin && (
            <FormField
              control={form.control}
              name="name" // Добавляем поле Name для регистрации
              render={({ field }) => (
                <FormItem data-oid="y_6u.e_">
                  <FormLabel data-oid="gw-e2s5">Name</FormLabel>
                  <FormControl data-oid="erx..rp">
                    <Input
                      placeholder="Your Name"
                      {...field}
                      data-oid="y7u_jh-"
                    />
                  </FormControl>
                  <FormMessage data-oid="8mj9uy0" />
                </FormItem>
              )}
              data-oid="dnsn3mr"
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem data-oid="f15manb">
                <FormLabel data-oid="gukizlz">Email</FormLabel>
                <FormControl data-oid="ke-g6xb">
                  <Input
                    placeholder="client@taskverse.test"
                    {...field}
                    data-oid="-ts2-8k"
                  />
                </FormControl>
                <FormMessage data-oid="2o-_b5e" />
              </FormItem>
            )}
            data-oid="a:.n-uj"
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem data-oid="kp23.cl">
                <FormLabel data-oid="-8jyn57">Password</FormLabel>
                <FormControl data-oid="r1z1nzb">
                  <Input
                    type="password"
                    placeholder="password"
                    {...field}
                    data-oid=".5uiyju"
                  />
                </FormControl>
                <FormMessage data-oid="0gplgnj" />
              </FormItem>
            )}
            data-oid="p_trdam"
          />

          {!isLogin && (
            <>
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem data-oid="_0dwwwx">
                    <FormLabel data-oid=".9s2go-">Confirm Password</FormLabel>
                    <FormControl data-oid="fe.-_j9">
                      <Input type="password" {...field} data-oid="yi7:vk2" />
                    </FormControl>
                    <FormMessage data-oid="krznilt" />
                  </FormItem>
                )}
                data-oid="31hfxr9"
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3" data-oid="b:k18da">
                    <FormLabel data-oid=".-r0r0m">Register as:</FormLabel>
                    <FormControl data-oid="fj-kzkr">
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                        data-oid=".-b34dw"
                      >
                        <FormItem
                          className="flex items-center space-x-3 space-y-0"
                          data-oid="9f3wvfj"
                        >
                          <FormControl data-oid="sua.bwn">
                            <RadioGroupItem
                              value="Заказчик"
                              data-oid="7yotkpo"
                            />
                          </FormControl>
                          <FormLabel className="font-normal" data-oid="pp4ehoy">
                            Заказчик (Client)
                          </FormLabel>
                        </FormItem>
                        <FormItem
                          className="flex items-center space-x-3 space-y-0"
                          data-oid="ftrbqvb"
                        >
                          <FormControl data-oid="5a4u7wu">
                            <RadioGroupItem
                              value="Исполнитель"
                              data-oid="9517pe0"
                            />
                          </FormControl>
                          <FormLabel className="font-normal" data-oid="c-nqjc2">
                            Исполнитель (Freelancer)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage data-oid="tsv1ah2" />
                  </FormItem>
                )}
                data-oid="tuarhjc"
              />
            </>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
            data-oid="u27x-pj"
          >
            {form.formState.isSubmitting
              ? "Processing..."
              : isLogin
                ? "Login"
                : "Create Account"}
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-center text-sm" data-oid="k8i51ki">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <Button
          variant="link"
          onClick={toggleAuthMode}
          className="p-0 h-auto"
          data-oid="w78iy.7"
        >
          {isLogin ? "Sign up" : "Login"}
        </Button>
      </div>
    </div>
  );
}
