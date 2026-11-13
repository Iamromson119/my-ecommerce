// grey placeholder shown while products are loading
const ProductSkeleton = () => (
  <div className="rounded-xl overflow-hidden border border-sand bg-white animate-pulse">
    <div className="aspect-square bg-sand" />
    <div className="p-4 space-y-3">
      <div className="h-3 w-16 bg-sand rounded" />
      <div className="h-5 w-3/4 bg-sand rounded" />
      <div className="h-4 w-12 bg-sand rounded" />
    </div>
  </div>
);

export default ProductSkeleton;
