import { useEffect, useRef, useState } from "react";
import {
  Search,
  ArrowRight,
  Truck,
  PackageCheck,
  ShieldCheck,
  SearchX,
  ShoppingBag,
  Headphones,
  House,
  Footprints,
  Tag,
} from "lucide-react";
import { getWithRetry } from "../api/axios";
import ProductCard from "../components/ProductCard.jsx";
import ProductSkeleton from "../components/ProductSkeleton.jsx";

const perks = [
  { icon: Truck, title: "Free shipping", text: "On orders over ₹100" },
  { icon: PackageCheck, title: "Order tracking", text: "See the status of every order" },
  { icon: ShieldCheck, title: "Protected account", text: "Your details stay safe" },
];

const categoryIcons = {
  Bags: ShoppingBag,
  Electronics: Headphones,
  Home: House,
  Footwear: Footprints,
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const shopRef = useRef(null);

  // load the category list once, so the chips keep all options while filtering
  useEffect(() => {
    const controller = new AbortController();
    getWithRetry("/products/categories", { signal: controller.signal })
      .then(({ data }) => setCategories(data))
      .catch(() => {});
    return () => controller.abort();
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
    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const params = {};
        if (keyword) params.keyword = keyword;
        if (category) params.category = category;
        const { data } = await getWithRetry("/products", {
          params,
          signal: controller.signal,
        });
        setProducts(data.products);
      } catch (err) {
        // a newer search replaced this one, nothing to show
        if (err.code === "ERR_CANCELED") return;
        setError("Could not load products. Please try again in a moment.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    const timeout = setTimeout(fetchProducts, 300);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [keyword, category, attempt]);

  const chipClass = (active) =>
    `inline-flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
      active
        ? "bg-ink text-paper border-ink"
        : "bg-white border-sand hover:border-moss hover:text-moss"
    }`;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* hero */}
      <section className="relative overflow-hidden rounded-2xl bg-moss text-paper px-8 py-12 md:px-14 md:py-16">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-paper/10" aria-hidden="true" />
        <div className="absolute right-10 -bottom-20 h-48 w-48 rounded-full bg-clay/40" aria-hidden="true" />
        <div className="relative max-w-xl">
          <p className="text-sm uppercase tracking-widest text-paper/70">A small, curated shop</p>
          <h1 className="font-display text-4xl md:text-5xl mt-3 leading-tight">
            Considered goods, sensibly made.
          </h1>
          <p className="mt-4 text-paper/80">Built to last, priced fairly.</p>
          <button
            onClick={() => shopRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="mt-8 inline-flex items-center gap-2 bg-paper text-moss font-medium px-5 py-3 rounded-md hover:bg-white transition-colors"
          >
            Shop now <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* perks */}
      <section className="grid sm:grid-cols-3 gap-4 mt-6">
        {perks.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3 rounded-xl border border-sand bg-white px-4 py-3">
            <span className="bg-sand/70 text-moss rounded-lg p-2">
              <Icon size={20} />
            </span>
            <div>
              <p className="text-sm font-medium">{title}</p>
              <p className="text-xs text-ink/60">{text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* search and categories */}
      <section ref={shopRef} className="mt-12 scroll-mt-24">
        <h2 className="font-display text-2xl mb-4">Shop</h2>

        <div className="relative mb-4">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            type="text"
            placeholder="Search products..."
            aria-label="Search products"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full border border-sand rounded-lg pl-11 pr-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-moss"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          <button onClick={() => setCategory("")} className={chipClass(category === "")}>
            All
          </button>
          {categories.map((c) => {
            const Icon = categoryIcons[c] || Tag;
            return (
              <button key={c} onClick={() => setCategory(c)} className={chipClass(category === c)}>
                <Icon size={16} /> {c}
              </button>
            );
          })}
        </div>

        {error && (
          <div className="flex items-center gap-4 text-clay mb-6">
            <p>{error}</p>
            <button
              onClick={() => setAttempt((n) => n + 1)}
              className="text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div>
            {slow && (
              <p className="mb-4 text-sm text-ink/70">
                The server is waking up (it sleeps when idle on the free plan). This page keeps
                trying on its own, so it can take up to a minute the first time.
              </p>
            )}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : products.length === 0 && !error ? (
          <div className="text-center py-16 text-ink/60">
            <SearchX size={40} className="mx-auto mb-3" />
            <p>No products found. Try a different search or category.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-ink/60 mb-4">
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
