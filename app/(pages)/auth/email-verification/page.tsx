import EmailVerificationForm from "@/components/auth/email-verification-form";

interface Props {
  searchParams: {
    token: string;
  };
}

const EmailVerificationPage = ({ searchParams }: Props) => {
  return (
    <div className="flex items-center justify-center mx-auto w-full">
      <EmailVerificationForm token={searchParams.token} />
    </div>
  );
};
export default EmailVerificationPage;