"use client";

import { verifyEmailToken } from "@/server/actions/token-actions";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import FormSuccess from "./form-success";
import FormError from "./form-error";
import { Button } from "../ui/button";

interface Props {
  token: string;
}

const EmailVerificationForm = ({ token }: Props) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerification = useCallback(() => {
    if (success || error) return;
    if (!token) {
      setError("No Token Found");
    }

    verifyEmailToken(token).then((data) => {
      if (data.error) {
        setError(data.error);
      }
      if (data.success) {
        setSuccess(data.success);
        // router.push("/auth/login");
      }
    });
  }, [error, token, success]);

  useEffect(() => {
    handleVerification();
  }, [handleVerification]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center my-6">Verify your Account</CardTitle>
        <CardContent className="flex items-center flex-co w-full justify-center">
          <p>{!success && !error && "Verifying Email..."}</p>
          {success && (
            <div className="flex flex-col gap-4">
              <FormSuccess message={success} />
              <Button
                color="primary"
                onClick={() => router.push("/auth/login")}
              >
                Login
              </Button>
            </div>
          )}

          {error && <FormError message={error} />}
        </CardContent>
      </CardHeader>
    </Card>
  );
};
export default EmailVerificationForm;
