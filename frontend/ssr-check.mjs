import { createServer } from "vite";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";

globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };

const vite = await createServer({ root: process.cwd(), server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
const load = async (p) => (await vite.ssrLoadModule(p)).default;
const { MemoryRouter } = await vite.ssrLoadModule("react-router-dom");
const { AuthProvider } = await vite.ssrLoadModule("/src/context/AuthContext.jsx");
const { CartProvider } = await vite.ssrLoadModule("/src/context/CartContext.jsx");

const wrap = (el, path = "/") =>
  h(MemoryRouter, { initialEntries: [path] }, h(AuthProvider, null, h(CartProvider, null, el)));

const product = { _id: "1", name: "Test Mug", category: "Home", price: 12.5, stock: 3, image: "x.jpg", description: "d" };
const checks = {
  Navbar: wrap(h(await load("/src/components/Navbar.jsx"))),
  Footer: wrap(h(await load("/src/components/Footer.jsx"))),
  ProductSkeleton: h(await load("/src/components/ProductSkeleton.jsx")),
  "ProductCard (low stock)": wrap(h(await load("/src/components/ProductCard.jsx"), { product })),
  "ProductCard (sold out)": wrap(h(await load("/src/components/ProductCard.jsx"), { product: { ...product, stock: 0 } })),
  "Home (loading state)": wrap(h(await load("/src/pages/Home.jsx"))),
  "Cart (empty)": wrap(h(await load("/src/pages/Cart.jsx"))),
};

let failed = 0;
for (const [name, el] of Object.entries(checks)) {
  try {
    const html = renderToString(el);
    console.log("ok  ", name.padEnd(26), html.length, "chars");
    if (name.startsWith("ProductCard (low")) console.log("      badge:", /Only 3 left/.test(html), "| quick-add button:", /Add Test Mug to cart/.test(html));
    if (name.startsWith("ProductCard (sold")) console.log("      badge:", /Sold out/.test(html), "| quick-add hidden:", !/Add Test Mug to cart/.test(html));
    if (name.startsWith("Home")) console.log("      skeletons:", (html.match(/animate-pulse/g) || []).length, "| hero:", /Considered goods/.test(html), "| search:", /Search products/.test(html));
  } catch (e) {
    failed++;
    console.log("FAIL", name, "->", e.message.split("\n")[0]);
  }
}
await vite.close();
process.exit(failed ? 1 : 0);
