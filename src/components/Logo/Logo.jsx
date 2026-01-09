import React from "react";
import { Link } from "react-router";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center text-2xl group transition-transform hover:scale-[1.02]">
      <span className="font-black text-brand-emerald text-3xl">P</span>
      <span className="font-medium text-brand-slate logo-tracking ml-0.5">IIRS</span>
    </Link>
  );
};

export default Logo;
