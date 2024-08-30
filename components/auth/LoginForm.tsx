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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginSchema } from "@/lib/schema";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import Image from "next/image";
import {
  emailSignIn,
  socialSignIn,
} from "@/server/backend/actions/auth-actions";
import { useAction } from "next-safe-action/hooks";
import FormSuccess from "./form-success";
import FormError from "./form-error";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

interface Props {
  callbackUrl?: string;
}

const LoginForm = ({ callbackUrl }: Props) => {
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { isExecuting, execute } = useAction(emailSignIn, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success(data.success);
        router.push("/");
      }
      if (data?.error) {
        setError(data.error);
      }
      if (data?.twoFactor) {
        setShowTwoFactor(true);
        setSuccess(data.twoFactor);
      }
    },
  });

  const onSubmit = (formData: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      execute(formData);
    });
  };

  return (
    <div className="flex items-center justify-center flex-col w-[50%]">
      <Card className="w-full md:w-[400px]">
        <CardHeader>
          <h1 className="mb-10 text-center bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-3xl font-bold text-transparent">
            Log In
          </h1>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 flex flex-col"
              noValidate
            >
              {showTwoFactor ? (
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        We&apos;ve sent you a two factor code to your email.
                      </FormLabel>
                      <FormControl>
                        <InputOTP disabled={isPending} {...field} maxLength={6}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <>
                  {/* email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
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
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="flex relative">
                            <Input
                              {...field}
                              disabled={isPending}
                              type={showPass ? "text" : "password"}
                              className="dark:bg-slate-600"
                              onChange={(value) => {
                                setError("");
                                field.onChange(value);
                              }}
                            />
                            <span
                              className="absolute top-3 right-2 cursor-pointer"
                              onClick={() => setShowPass(!showPass)}
                            >
                              {showPass ? (
                                <Eye size={16} />
                              ) : (
                                <EyeOff size={16} />
                              )}
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* submit button */}
              <Button
                type="submit"
                className="w-full"
                disabled={!form.formState.isValid || isExecuting}
              >
                {isPending && <Loader2 className="mr-2" />}
                {showTwoFactor ? "Verify" : "Log In"}
              </Button>
            </form>

            {/* reset password */}
            <div className="flex flex-col items-center">
              <Link
                href="/auth/reset-password"
                className="text-xs self-end cursor-pointer hover:text-primary mt-2"
              >
                forgot password?
              </Link>
            </div>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col">
          <div className="flex items-center gap-x-5 mb-4">
            <div className="flex bg-slate-200 w-20 h-[0.5px]" />
            <span className="text-center text-xs">or sign in with</span>
            <div className="flex bg-slate-200 w-20 h-[0.5px]" />
          </div>
          {/* google login */}
          <Button
            type="button"
            className="w-full mb-3"
            variant="secondary"
            onClick={() =>
              socialSignIn({ social: "google", callback: callbackUrl ?? "/" })
            }
          >
            <div className="relative mr-2">
              <Image
                alt="logo"
                src="/images/google-icon.svg"
                className="top-0 left-0 relative"
                width={20}
                height={20}
              />
            </div>
            Google
          </Button>

          {/* github login */}
          <Button
            type="button"
            className="w-full mb-3"
            variant="secondary"
            onClick={() =>
              socialSignIn({ social: "github", callback: callbackUrl ?? "/" })
            }
          >
            <div className="relative mr-2">
              <Image
                alt="logo"
                src="/images/github-icon.svg"
                className="top-0 left-0 relative"
                width={24}
                height={24}
              />
            </div>
            Github
          </Button>

          <Link
            href="/auth/register"
            className="text-xs hover:text-primary mt-5"
          >
            {"Don't have an Account? Create New"}
          </Link>
        </CardFooter>
      </Card>

      <div className="flex w-full mt-5">
        {error && <FormError message={error} />}
        {success && <FormSuccess message={success} />}
      </div>
    </div>
  );
};

export default LoginForm;
