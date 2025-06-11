import { redirect } from "next/navigation";

export default function HomePage() {
  // Простое перенаправление без использования cookies на серверной стороне
  // Проверка авторизации будет происходить на клиентской стороне
  redirect("/auth");
}
