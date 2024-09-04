import CreateProduct from "@/components/products/CreateProduct";
import { auth } from "@/lib/auth";
import { useProductById } from "@/server/backend/queries/productQueries";
import { redirect } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

const EditProductPage = async ({ params }: Props) => {
  console.log("EditProductPage*****", params);
  const session = await auth();
  const user = session?.user;
  if (!user) redirect("/auth/login");
  if (user.role !== "admin") {
    return (
      <div className="w-full flex mx-auto justify-center">
        <div className="bg-red-500/20 rounded-md p-10 mt-10">
          <h1 className="text-3xl font-semibold">
            Admin Area, Not Authorized...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full">
      <CreateProduct productId={params.id} />
    </div>
  );
};
export default EditProductPage;
