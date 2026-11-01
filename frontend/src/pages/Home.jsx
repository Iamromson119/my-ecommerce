import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard.jsx";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState("");

  // load the category list once, so the dropdown keeps all options while filtering
  useEffect(() => {
    api
      .get("/products/categories")
      .then(({ data }) => setCategories(data))
      .catch(() => {});
  }, []);

  // the free hosting plan puts the server to sleep when nobody's using it,
  // so the first request can take a while. Tell people instead of leaving a blank page
  useEffect(() => {
    if (!loading) {
      setSlow(false);
      return;
    }
    const timer = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(timer);
  }, [loading]);

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
        setError("Could not load products. Please try again in a moment.");
      } finally {
        setLoading(false);
      }
    };
    const timeout = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeout);
  }, [keyword, category]);

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
        <div className="text-ink/50">
          <p>Loading products&hellip;</p>
          {slow && (
            <p className="mt-2 text-sm">
              The server is waking up (it sleeps when idle on the free plan). This can take up
              to a minute the first time.
            </p>
          )}
        </div>
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
