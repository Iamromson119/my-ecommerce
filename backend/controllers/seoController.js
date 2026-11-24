const Product = require("../models/Product");
const slugify = require("../utils/slugify");

const escapeXml = (text) =>
  String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

// the public address of the shop, not of this API. SITE_URL wins, otherwise
// we use the first address in CLIENT_URL
const getSiteUrl = () => {
  const raw = process.env.SITE_URL || (process.env.CLIENT_URL || "").split(",")[0];
  return raw.trim().replace(/\/$/, "");
};

const day = (date) => new Date(date).toISOString().slice(0, 10);

// @desc XML sitemap with the home page, every category and every product
// @route GET /api/sitemap.xml
const getSitemap = async (req, res, next) => {
  try {
    const site = getSiteUrl();
    if (!site) {
      res.status(503);
      throw new Error("Set SITE_URL or CLIENT_URL so the sitemap knows the shop's address");
    }

    const products = await Product.find({}, "category updatedAt").sort({ updatedAt: -1 }).lean();

    // a category page changes whenever one of its products does
    const categoryDates = new Map();
    for (const p of products) {
      const known = categoryDates.get(p.category);
      if (!known || p.updatedAt > known) categoryDates.set(p.category, p.updatedAt);
    }

    const urls = [{ loc: `${site}/`, lastmod: products[0]?.updatedAt }];
    for (const [name, lastmod] of categoryDates) {
      urls.push({ loc: `${site}/category/${slugify(name)}`, lastmod });
    }
    for (const p of products) {
      urls.push({ loc: `${site}/products/${p._id}`, lastmod: p.updatedAt });
    }

    const body = urls
      .map(
        (u) =>
          `  <url>\n    <loc>${escapeXml(u.loc)}</loc>` +
          (u.lastmod ? `\n    <lastmod>${day(u.lastmod)}</lastmod>` : "") +
          `\n  </url>`
      )
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

    res.type("application/xml").set("Cache-Control", "public, max-age=3600").send(xml);
  } catch (error) {
    next(error);
  }
};

module.exports = { getSitemap };
