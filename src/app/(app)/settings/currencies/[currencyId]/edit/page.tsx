"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Save,
  DollarSign,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { Currency } from "@/types/currency";

const currencyFormSchema = z.object({
  name: z.string().min(1, { message: "Название валюты обязательно" }),
  isoCode: z
    .string()
    .min(3, {
      message:
        "Код валюты должен состоять минимум из 3 символов (например, USD)",
    })
    .max(5, { message: "Код валюты не должен превышать 5 символов" }),
  symbol: z
    .string()
    .min(1, { message: "Символ валюты обязателен (например, $)" })
    .max(5, { message: "Символ валюты не должен превышать 5 символов" }),
  exchangeRate: z.string().min(1, { message: "Курс обмена обязателен" }),
});

type CurrencyFormValues = z.infer<typeof currencyFormSchema>;

export default function EditCurrencyPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const currencyId = params.currencyId as string;

  const form = useForm<CurrencyFormValues>({
    resolver: zodResolver(currencyFormSchema),
    defaultValues: {
      name: "",
      isoCode: "",
      symbol: "",
      exchangeRate: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!currencyId) {
      setError("Currency ID is missing.");
      setIsFetching(false);
      return;
    }

    const fetchCurrencyData = async () => {
      setIsFetching(true);
      setError(null);
      try {
        // Получаем данные о валюте с сервера
        const response = await fetch(
          `/api/settings/currencies/${params.currencyId}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error ||
              `Ошибка получения валюты: ${response.statusText}`,
          );
        }

        // Получаем данные из БД
        const data = await response.json();
        console.log("Получены данные валюты из БД:", data);

        if (data) {
          form.reset({
            name: data.name,
            isoCode: data.isoCode,
            symbol: data.symbol,
            exchangeRate: data.exchangeRate.toString(),
          });
        } else {
          throw new Error("Currency not found.");
        }
      } catch (err) {
        console.error("Failed to fetch currency data:", err);
        const message =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(message);
        toast({
          title: "Error fetching currency data",
          description: message,
          variant: "destructive",
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchCurrencyData();
  }, [currencyId, form, toast]);

  const onSubmit = async (values: CurrencyFormValues) => {
    try {
      setIsSubmitting(true);
      setSubmissionError(null);

      // Отправляем данные в API для сохранения в БД
      const response = await fetch(`/api/settings/currencies/${currencyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          isoCode: values.isoCode,
          symbol: values.symbol,
          exchangeRate: parseFloat(values.exchangeRate),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Ошибка обновления валюты: ${response.statusText}`,
        );
      }

      const updatedCurrency = await response.json();
      console.log("Валюта успешно обновлена:", updatedCurrency);

      // Здесь в реальном приложении будет актуальное сохранение в БД
      // Например: await prisma.currency.update({ where: { id: parseInt(currencyId) }, data })

      toast({
        title: "Валюта обновлена",
        description: `Валюта "${values.name} (${values.isoCode})" успешно обновлена.`,
      });

      router.push("/settings/currencies");
      router.refresh();
    } catch (error) {
      console.error("Не удалось обновить валюту:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Произошла неизвестная ошибка";
      setSubmissionError(errorMessage);
      toast({
        title: "Ошибка обновления валюты",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64" data-oid="f_hbqf:">
        <Loader2
          className="h-8 w-8 animate-spin text-muted-foreground"
          data-oid="xbx8nes"
        />

        <p className="ml-2 text-muted-foreground" data-oid="rqa3gs_">
          Загрузка данных валюты...
        </p>
      </div>
    );
  }

  if (error && !isFetching) {
    return (
      <Card
        className="shadow-sm border-destructive bg-destructive/10"
        data-oid="9-_tgzk"
      >
        <CardHeader data-oid="nuio6lg">
          <CardTitle className="text-destructive" data-oid="nv99pyl">
            Ошибка
          </CardTitle>
        </CardHeader>
        <CardContent
          className="flex items-center gap-2 text-destructive py-4"
          data-oid="ho.nsy7"
        >
          <AlertTriangle className="h-5 w-5" data-oid="_di6e:g" />
          <p data-oid="._m245j">{error}</p>
        </CardContent>
        <CardContent data-oid="mt460-h">
          <Link href="/settings/currencies" data-oid="8qf::_3">
            <Button variant="outline" data-oid="9_5ryqr">
              <ArrowLeft className="mr-2 h-4 w-4" data-oid="b-gn0qe" />{" "}
              Вернуться к списку валют
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6" data-oid="zb6-r1h">
      <div className="flex items-center justify-between" data-oid="1u0cczl">
        <div className="flex items-center gap-4" data-oid="bs1qe:q">
          <Link href="/settings/currencies" data-oid="km-ruxy">
            <Button
              variant="outline"
              className="h-10 w-10 p-0 flex items-center justify-center"
              data-oid="pj5g4ze"
            >
              <ArrowLeft className="h-5 w-5" data-oid="z8wn79h" />
            </Button>
          </Link>
          <div data-oid="79vxcqr">
            <h2
              className="text-2xl font-bold tracking-tight"
              data-oid="n0bhltl"
            >
              Редактирование валюты
            </h2>
            <p className="text-sm text-muted-foreground" data-oid="l2:z6p_">
              Изменение настроек валюты.
            </p>
          </div>
        </div>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={isLoading || !form.formState.isValid || isSubmitting}
          data-oid="0hwatut"
        >
          <Save className="mr-2 h-4 w-4" data-oid="ho3l27r" />{" "}
          {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
        </Button>
      </div>

      <Card data-oid="27f47dq">
        <CardHeader data-oid="z8-g.6w">
          <CardTitle data-oid="5l16cox">Детали валюты</CardTitle>
          <CardDescription data-oid="srvzo:j">
            Обновите данные этой валюты.
          </CardDescription>
        </CardHeader>
        <CardContent data-oid=":o6n3c2">
          <Form {...form} data-oid="ze0csnb">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              data-oid="i5sg:5g"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem data-oid="046fa27">
                    <FormLabel data-oid="3dbb-j1">Название валюты</FormLabel>
                    <FormControl data-oid="kqc8rk:">
                      <Input
                        placeholder="например, Российский рубль, Евро"
                        {...field}
                        data-oid="8tn-w-v"
                      />
                    </FormControl>
                    <FormMessage data-oid="a_fkeg3" />
                  </FormItem>
                )}
                data-oid="per-a08"
              />

              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                data-oid="_4:o-w-"
              >
                <FormField
                  control={form.control}
                  name="isoCode"
                  render={({ field }) => (
                    <FormItem data-oid="t5lp-h7">
                      <FormLabel data-oid="5er:lb7">Код валюты (ISO)</FormLabel>
                      <FormControl data-oid="d8k7xiq">
                        <Input
                          placeholder="USD"
                          {...field}
                          data-oid="qktdr8z"
                        />
                      </FormControl>
                      <FormMessage data-oid="-tszl_7" />
                    </FormItem>
                  )}
                  data-oid="lhbo894"
                />

                <FormField
                  control={form.control}
                  name="symbol"
                  render={({ field }) => (
                    <FormItem data-oid="tgci5ws">
                      <FormLabel data-oid="1vh_ao5">Символ валюты</FormLabel>
                      <FormControl data-oid="qhcep4i">
                        <Input placeholder="$" {...field} data-oid="ofnzrgz" />
                      </FormControl>
                      <FormMessage data-oid="o2iztal" />
                    </FormItem>
                  )}
                  data-oid="0u-ytfu"
                />
              </div>

              <FormField
                control={form.control}
                name="exchangeRate"
                render={({ field }) => (
                  <FormItem data-oid="x8qnhix">
                    <FormLabel data-oid="38:my-m">
                      Курс обмена (относительно базовой валюты учета)
                    </FormLabel>
                    <FormControl data-oid="5:.wjbi">
                      <Input
                        type="number"
                        step="0.0001"
                        placeholder="1.0"
                        {...field}
                        data-oid="m-3j9pq"
                      />
                    </FormControl>
                    <FormMessage data-oid="hlgbfo8" />
                  </FormItem>
                )}
                data-oid=".3kpury"
              />

              {submissionError && (
                <div
                  className="text-sm font-medium text-destructive"
                  data-oid="yd_a-8i"
                >
                  {submissionError}
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
