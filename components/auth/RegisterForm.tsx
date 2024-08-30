"use client";
import { RegisterSchema } from "@/lib/schema";
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
import { FaGoogle } from "react-icons/fa";

import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useAction } from "next-safe-action/hooks";
import { registerUser } from "@/server/backend/actions/auth-actions";
import FormSuccess from "./form-success";
import FormError from "./form-error";

const RegisterForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPass, setShowPass] = useState(false);
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
    mode: "all",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { isExecuting, execute } = useAction(registerUser, {
    onSuccess: ({ data }) => {
      if (data?.error) setError(data.error);
      if (data?.success) setSuccess(data.success);
    },
  });

  const onSubmit = (formData: z.infer<typeof RegisterSchema>) => {
    execute(formData);
  };

  return (
    <Card className="w-full md:w-[400px]">
      <CardHeader>
        <h1 className="mb-10 text-center bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-3xl font-bold text-transparent">
          Register
        </h1>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            {/* name */}
            <FormField
              disabled={isPending}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="dark:bg-slate-600" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* email */}
            <FormField
              disabled={isPending}
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

            {/* password */}
            <FormField
              disabled={isPending}
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
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
              disabled={isPending}
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

            {success && <FormSuccess message={success} />}
            {error && <FormError message={error} />}

            <div className="flex flex-col gap-3 items-center py-5">
              <Button
                type="submit"
                disabled={!form.formState.isValid || isExecuting}
                className="w-full"
              >
                Register
              </Button>

              <Link
                href="/auth/login"
                className="text-xs hover:text-orange-300 mt-2"
              >
                {"Already have an Account? Log In"}
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
