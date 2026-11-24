import { Helmet } from "react-helmet-async";
import { SITE_URL } from "../config";

// Sets the title, description, canonical link and social tags for one page.
// Pages that shouldn't appear in search (cart, login, admin...) pass noindex.
const Seo = ({ title, description, path, image, type = "website", noindex = false, jsonLd }) => {
  if (noindex) {
    return (
      <Helmet>
        <title>{title}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
    );
  }

  const url = `${SITE_URL}${path}`;
  const picture = image || `${SITE_URL}/og-image.png`;

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />

      <meta property="og:site_name" content="Meridian" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={picture} />
      <meta name="twitter:card" content="summary_large_image" />

      {jsonLd && (
        // "<" is escaped so product text can never close the script tag early
        <script type="application/ld+json">{JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>
      )}
    </Helmet>
  );
};

export default Seo;
