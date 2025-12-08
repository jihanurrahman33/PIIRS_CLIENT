import React from "react";

import Logo from "../Logo/Logo";

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content mt-10">
      <div className="container px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Logo + Intro */}
        <div>
          <Logo />
          <p className="font-semibold text-lg">
            Public Infrastructure Issue Reporting System
          </p>
          <p className="mt-2 text-sm">
            Empowering citizens to report issues and helping authorities respond
            faster. Built for transparency and smarter cities.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col">
          <h6 className="footer-title">Quick Links</h6>
          <a className="link link-hover" href="/report">
            Report an Issue
          </a>
          <a className="link link-hover" href="/issues">
            View Reported Issues
          </a>
          <a className="link link-hover" href="/how-it-works">
            How It Works
          </a>
          <a className="link link-hover" href="/faq">
            FAQs
          </a>
        </div>

        {/* Company */}
        <div className="flex flex-col">
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover" href="/about">
            About Us
          </a>
          <a className="link link-hover" href="/contact">
            Contact
          </a>
          <a className="link link-hover" href="/team">
            Our Team
          </a>
          <a className="link link-hover" href="/careers">
            Careers
          </a>
        </div>

        {/* Legal + Support */}
        <div className="flex flex-col">
          <h6 className="footer-title">Legal & Support</h6>
          <a className="link link-hover" href="/terms">
            Terms of Use
          </a>
          <a className="link link-hover" href="/privacy">
            Privacy Policy
          </a>
          <a className="link link-hover" href="/support">
            Support Center
          </a>
          <a className="link link-hover" href="/contact">
            Help Desk
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className=" py-4 text-center text-sm">
        © {new Date().getFullYear()} Public Infrastructure Reporting System —
        All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
