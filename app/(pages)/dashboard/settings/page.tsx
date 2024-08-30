import Settings from "@/components/settings/Settings";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const SettingsPage = async () => {
  const session = await auth();
  const user = session?.user;
  if (!user) redirect("/auth/login");

  return (
    <div className="w-full">
      <Settings user={user} isOAuth={session.isOAuth} />
    </div>
  );
};
export default SettingsPage;
