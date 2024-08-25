"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState, useTransition } from "react";
import { NewPasswordSchema, ResetPasswordSchema } from "@/lib/schema";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { newPassword, resetPassword } from "@/server/actions/auth-actions";
import { useAction } from "next-safe-action/hooks";
import FormError from "./form-error";
import FormSuccess from "./form-success";

const ResetPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const [showPass, setShowPass] = useState(false);
  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "all",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { execute, isExecuting } = useAction(resetPassword, {
    onSuccess({ data }) {
      if (data?.error) setError(data.error);
      if (data?.success) setSuccess(data.success);
    },
  });

  const onSubmit = (formData: z.infer<typeof ResetPasswordSchema>) => {
    execute(formData);
  };

  return (
    <div className="flex flex-col gap-4 items-center w-[50%]">
      <Card className="w-full md:w-[400px]">
        <CardHeader>
          <h1 className="mb-10 text-center bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-3xl font-bold text-transparent">
            Reset Password
          </h1>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              {/* email */}
              <FormField
                disabled={isPending || isExecuting}
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="your.email@example.com"
                        type="email"
                        className="dark:bg-slate-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-3 items-center py-5">
                {/* submit button */}
                <Button
                  type="submit"
                  disabled={!form.formState.isValid || isExecuting}
                  className="w-full items-center gap-2 flex"
                >
                  {isExecuting && <Loader2 className="animate-spin" />}
                  <span>Reset Password</span>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && <FormError message={error} />}
      {success && <FormSuccess message={success} />}
    </div>
  );
};
export default ResetPasswordForm;