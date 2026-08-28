import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const emptyForm = { name: "", description: "", price: "", image: "", category: "", stock: "" };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    const { data } = await api.get("/products", { params: { limit: 100 } });
    setProducts(data.products);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save product.");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Manage products</h1>
        <Link to="/admin" className="text-moss underline text-sm">
          Back to dashboard
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <form onSubmit={handleSubmit} className="space-y-3 border border-sand rounded-lg p-6 bg-white h-fit">
          <h2 className="font-display text-xl mb-2">{editingId ? "Edit product" : "Add product"}</h2>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-sand rounded-md px-3 py-2"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full border border-sand rounded-md px-3 py-2"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              name="price"
              type="number"
              step="0.01"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              required
              className="border border-sand rounded-md px-3 py-2"
            />
            <input
              name="stock"
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
              required
              className="border border-sand rounded-md px-3 py-2"
            />
          </div>
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full border border-sand rounded-md px-3 py-2"
          />
          <input
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            required
            className="w-full border border-sand rounded-md px-3 py-2"
          />
          {error && <p className="text-clay text-sm">{error}</p>}
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-moss text-paper px-5 py-2 rounded-md font-medium hover:bg-moss/90 transition-colors"
            >
              {editingId ? "Update product" : "Add product"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2 rounded-md border border-sand hover:bg-sand transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="space-y-3">
          {products.map((p) => (
            <div key={p._id} className="flex items-center gap-3 border border-sand rounded-lg p-3 bg-white">
              <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-md bg-sand" />
              <div className="flex-1">
                <p className="font-medium text-sm">{p.name}</p>
                <p className="text-xs text-ink/50">
                  ${p.price.toFixed(2)} &middot; {p.stock} in stock
                </p>
              </div>
              <button onClick={() => handleEdit(p)} className="text-moss text-sm hover:underline">
                Edit
              </button>
              <button onClick={() => handleDelete(p._id)} className="text-clay text-sm hover:underline">
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
