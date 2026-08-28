import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard.jsx";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const params = {};
        if (keyword) params.keyword = keyword;
        if (category) params.category = category;
        const { data } = await api.get("/products", { params });
        setProducts(data.products);
      } catch (err) {
        setError("Could not load products. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };
    const timeout = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeout);
  }, [keyword, category]);

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl">Considered goods,<br />sensibly made.</h1>
        <p className="mt-3 text-ink/60 max-w-md">
          A small, curated selection &mdash; built to last, priced fairly.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1 border border-sand rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-moss"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-sand rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-moss"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-clay">{error}</p>}
      {loading ? (
        <p className="text-ink/50">Loading products&hellip;</p>
      ) : products.length === 0 ? (
        <p className="text-ink/50">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
