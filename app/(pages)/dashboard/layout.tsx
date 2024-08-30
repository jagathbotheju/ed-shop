import DashboardNav from "@/components/navigation/DashboardNav";
import { auth } from "@/lib/auth";
import { User } from "@/server/db/schema/user";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  const user = session?.user as User;

  return (
    <div className="flex flex-col w-full">
      <DashboardNav user={user} />
      {children}
    </div>
  );
};
export default DashboardLayout;
