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
import { NewPasswordSchema } from "@/lib/schema";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { newPassword } from "@/server/actions/auth-actions";
import { useAction } from "next-safe-action/hooks";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { useRouter, useSearchParams } from "next/navigation";

const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPass, setShowPass] = useState(false);
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      token: "",
    },
    mode: "all",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { execute, isExecuting } = useAction(newPassword, {
    onSuccess({ data }) {
      if (data?.error) setError(data.error);
      if (data?.success) setSuccess(data.success);
    },
  });

  const onSubmit = (formData: z.infer<typeof NewPasswordSchema>) => {
    const data = {
      ...formData,
      token,
    };
    execute({ ...data });
  };

  return (
    <div className="flex flex-col gap-4 items-center w-[50%]">
      <Card className="w-full md:w-[400px]">
        <CardHeader>
          <h1 className="mb-10 text-center bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-3xl font-bold text-transparent">
            New Password
          </h1>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              {/* password */}
              <FormField
                disabled={isPending || isExecuting}
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="flex relative">
                        <Input
                          {...field}
                          type={showPass ? "text" : "password"}
                          className="dark:bg-slate-600"
                        />
                        <span
                          className="absolute top-3 right-2 cursor-pointer"
                          onClick={() => setShowPass(!showPass)}
                        >
                          {showPass ? <Eye size={16} /> : <EyeOff size={16} />}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/*confirm password */}
              <FormField
                disabled={isPending || isExecuting}
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="flex relative">
                        <Input
                          {...field}
                          type={showPass ? "text" : "password"}
                          className="dark:bg-slate-600"
                        />
                        <span
                          className="absolute top-3 right-2 cursor-pointer"
                          onClick={() => setShowPass(!showPass)}
                        >
                          {showPass ? <Eye size={16} /> : <EyeOff size={16} />}
                        </span>
                      </div>
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
                  className="w-full gap-2 flex items-center"
                >
                  {isExecuting && <Loader2 className="animate-spin" />}
                  <span>Create New Password</span>
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
export default NewPasswordForm;
