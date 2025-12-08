import React from "react";
import logoImg from "../../assets/logo.png";
import { Link } from "react-router";
const Logo = () => {
  return (
    <Link to={"/"}>
      <img className="btn btn-ghost text-xl w-30 h-15" src={logoImg} />
    </Link>
  );
};

export default Logo;
