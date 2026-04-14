/**
 * НАЗНАЧЕНИЕ: Компонент для аутентификации пользователя (вход по паролю)
 * ЗАВИСИМОСТИ: @heroui/react, lucide-react, next-intl, @/trpc/react
 * ОСОБЕННОСТИ: Client Component, i18n support, защищенный ввод пароля, рефреш роутера при успехе
 */

"use client";

import React, { useState } from "react";
import { Card, CardBody, CardHeader, Input, Button } from "@heroui/react";
import { Lock, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { useTranslations } from "next-intl";

export function LoginView() {
  const t = useTranslations("LoginView");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const utils = api.useUtils();

  const loginMutation = api.auth.login.useMutation({
    onSuccess: () => {
      // Обновляем состояние авторизации и роутинг
      utils.auth.check.invalidate();
      router.refresh();
    },
    onError: (error) => {
      console.error(error.message || "Ошибка входа");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    loginMutation.mutate({ password });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      {/* Карточка входа со стилизацией под брендбук и эффектом стекла */}
      <Card className="w-full max-w-sm border border-brand-500/20 bg-default-50/50 backdrop-blur-md shadow-xl">
        <CardHeader className="flex flex-col items-center gap-2 pt-8">
          <div className="p-3 bg-brand-500/10 rounded-full">
            <Lock className="w-8 h-8 text-brand-600" />
          </div>
          {/* Использование основного градиента tech-gradient из стандартов */}
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-brand-600">
            {t("title")}
          </h1>
          <p className="text-sm text-default-500 text-center px-4">
            {t("description")}
          </p>
        </CardHeader>
        <CardBody className="pb-8 px-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="password"
              label={t("password_label")}
              variant="bordered"
              color="primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isDisabled={loginMutation.isPending}
              startContent={<Lock className="w-4 h-4 text-default-400" />}
            />
            {/* Кнопка с градиентом tech-gradient */}
            <Button
              type="submit"
              color="primary"
              variant="shadow"
              isLoading={loginMutation.isPending}
              className="w-full bg-tech-gradient font-medium tracking-wide text-white"
              endContent={!loginMutation.isPending && <LogIn className="w-4 h-4" />}
            >
              {t("submit_button")}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
