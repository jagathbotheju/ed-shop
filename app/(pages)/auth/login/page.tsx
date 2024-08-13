import LoginForm from "@/components/auth/LoginForm";

interface Props {
  searchParams: {
    callbackUrl?: string;
  };
}

const LoginPage = ({ searchParams }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <LoginForm callbackUrl={searchParams.callbackUrl} />
    </div>
  );
};
export default LoginPage;
