import ReviewForm from "./ReviewForm";

interface Props {
  productId: string;
}

const Reviews = ({ productId }: Props) => {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-4">Product Reviews</h2>
      <div>
        <ReviewForm productId={productId} />
      </div>
    </section>
  );
};
export default Reviews;
