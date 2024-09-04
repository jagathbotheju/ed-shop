"use client";
import { useDeleteProduct } from "@/server/backend/mutations/productMutations";
import { FilePenLine, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  productId: string;
}

const ProductTableActions = ({ productId }: Props) => {
  const router = useRouter();
  const { mutate } = useDeleteProduct();

  return (
    <div className="flex gap-4 items-center">
      <FilePenLine
        className="cursor-pointer"
        onClick={() => router.push(`/dashboard/edit-product/${productId}`)}
      />
      <Trash2
        className="cursor-pointer w-5 h-5 text-red-500/80"
        onClick={() => mutate(productId)}
      />
    </div>
  );
};
export default ProductTableActions;
