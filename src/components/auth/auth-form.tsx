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
    <div className="mx-auto max-w-md space-y-6" data-oid="hbp-p.2">
      <div className="space-y-2 text-center" data-oid="m856dl.">
        <h1 className="text-3xl font-bold" data-oid="d8g0kd1">
          {isLogin ? "Login" : "Sign Up"}
        </h1>
        <p className="text-muted-foreground" data-oid="q-a31-c">
          {isLogin
            ? "Use test credentials (e.g., admin@taskverse.test / password)"
            : "Create an account to get started"}
        </p>
      </div>
      <Form {...form} data-oid="vc3z18i">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          data-oid="uw7x-9f"
        >
          {!isLogin && (
            <FormField
              control={form.control}
              name="name" // Добавляем поле Name для регистрации
              render={({ field }) => (
                <FormItem data-oid="_lk1d9r">
                  <FormLabel data-oid="m6fjrle">Name</FormLabel>
                  <FormControl data-oid="8wvpphh">
                    <Input
                      placeholder="Your Name"
                      {...field}
                      data-oid="gd_ptbu"
                    />
                  </FormControl>
                  <FormMessage data-oid="sh81my4" />
                </FormItem>
              )}
              data-oid="k4h7iun"
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem data-oid="neglut-">
                <FormLabel data-oid="1lli6:g">Email</FormLabel>
                <FormControl data-oid="ohph1ps">
                  <Input
                    placeholder="client@taskverse.test"
                    {...field}
                    data-oid="41:2m9j"
                  />
                </FormControl>
                <FormMessage data-oid="rh7e0u6" />
              </FormItem>
            )}
            data-oid="fpcbi2r"
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem data-oid="uf6jaif">
                <FormLabel data-oid="zqqjib7">Password</FormLabel>
                <FormControl data-oid="xr7oboz">
                  <Input
                    type="password"
                    placeholder="password"
                    {...field}
                    data-oid="i2p_qq4"
                  />
                </FormControl>
                <FormMessage data-oid="3h:-b1v" />
              </FormItem>
            )}
            data-oid="7c8z_9m"
          />

          {!isLogin && (
            <>
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem data-oid="dxy:j8z">
                    <FormLabel data-oid="rj:1fjr">Confirm Password</FormLabel>
                    <FormControl data-oid="r:fott7">
                      <Input type="password" {...field} data-oid="py391s2" />
                    </FormControl>
                    <FormMessage data-oid="y.bijhv" />
                  </FormItem>
                )}
                data-oid="uolcxgk"
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3" data-oid="6ud..kf">
                    <FormLabel data-oid="qkq15:w">Register as:</FormLabel>
                    <FormControl data-oid="oqymu03">
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                        data-oid="ttclg41"
                      >
                        <FormItem
                          className="flex items-center space-x-3 space-y-0"
                          data-oid="bk9118b"
                        >
                          <FormControl data-oid="o1n85pu">
                            <RadioGroupItem
                              value="Заказчик"
                              data-oid="4n71_ey"
                            />
                          </FormControl>
                          <FormLabel className="font-normal" data-oid="xwfh:w_">
                            Заказчик (Client)
                          </FormLabel>
                        </FormItem>
                        <FormItem
                          className="flex items-center space-x-3 space-y-0"
                          data-oid="ib_3xa5"
                        >
                          <FormControl data-oid=":o_6krz">
                            <RadioGroupItem
                              value="Исполнитель"
                              data-oid="7rqm76s"
                            />
                          </FormControl>
                          <FormLabel className="font-normal" data-oid="w-sfru6">
                            Исполнитель (Freelancer)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage data-oid="wi8rs4:" />
                  </FormItem>
                )}
                data-oid="e.hz2i_"
              />
            </>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
            data-oid="jv59zof"
          >
            {form.formState.isSubmitting
              ? "Processing..."
              : isLogin
                ? "Login"
                : "Create Account"}
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-center text-sm" data-oid="rwt7f5j">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <Button
          variant="link"
          onClick={toggleAuthMode}
          className="p-0 h-auto"
          data-oid="1dt68jw"
        >
          {isLogin ? "Sign up" : "Login"}
        </Button>
      </div>
    </div>
  );
}
