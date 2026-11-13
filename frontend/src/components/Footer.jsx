import { ShoppingBag, ArrowUpRight } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-sand mt-16">
    <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-ink/70 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
      <div className="flex items-center gap-2">
        <ShoppingBag size={16} className="text-moss" />
        <span>&copy; {new Date().getFullYear()} Meridian. Considered goods, sensibly made.</span>
      </div>
      <div className="flex items-center gap-5">
        <span>Built with React &amp; Express</span>
        <a
          href="https://github.com/Iamromson119/my-ecommerce"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 hover:text-moss transition-colors"
        >
          Source code <ArrowUpRight size={14} />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
