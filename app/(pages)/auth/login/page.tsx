import LoginForm from "@/components/auth/LoginForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

interface Props {
  searchParams: {
    callbackUrl?: string;
  };
}

const LoginPage = async ({ searchParams }: Props) => {
  const session = await auth();
  const user = session?.user;

  if (user) redirect("/");

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <LoginForm callbackUrl={searchParams.callbackUrl} />
    </div>
  );
};
export default LoginPage;
