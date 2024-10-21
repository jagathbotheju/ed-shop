import ProductDetails from "@/components/products/ProductDetails";

interface Props {
  params: {
    id: string;
  };
}

const ProductsDetailsPage = ({ params }: Props) => {
  return (
    <div className="flex w-full">
      <ProductDetails productId={params.id} />
    </div>
  );
};
export default ProductsDetailsPage;
