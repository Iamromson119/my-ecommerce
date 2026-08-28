const Footer = () => (
  <footer className="border-t border-sand mt-16">
    <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-ink/60 flex justify-between">
      <span>&copy; {new Date().getFullYear()} Meridian. Considered goods, sensibly made.</span>
      <span>Built with React &amp; Express</span>
    </div>
  </footer>
);

export default Footer;
