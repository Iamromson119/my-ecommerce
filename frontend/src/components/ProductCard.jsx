import { Link } from "react-router-dom";

const ProductCard = ({ product }) => (
  <Link
    to={`/products/${product._id}`}
    className="group block rounded-lg overflow-hidden border border-sand hover:border-moss transition-colors bg-white"
  >
    <div className="aspect-square overflow-hidden bg-sand">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div className="p-4">
      <p className="text-xs uppercase tracking-wide text-ink/50">{product.category}</p>
      <h3 className="font-display text-lg mt-1">{product.name}</h3>
      <p className="mt-2 font-medium text-clay">${product.price.toFixed(2)}</p>
    </div>
  </Link>
);

export default ProductCard;
