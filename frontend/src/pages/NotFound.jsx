import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="max-w-4xl mx-auto px-6 py-24 text-center">
    <h1 className="font-display text-5xl mb-4">404</h1>
    <p className="text-ink/60 mb-6">This page doesn&rsquo;t exist.</p>
    <Link to="/" className="text-moss underline">
      Back to shop
    </Link>
  </div>
);

export default NotFound;
