import React from "react";
import { Link } from "react-router";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaGithub, FaGlobe } from "react-icons/fa";
import Logo from "../Logo/Logo";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 text-gray-600 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <Logo />
          <div className="space-y-2">
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Empowering citizens to report infrastructure issues and helping authorities build smarter, safer cities together.
            </p>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <a href="https://web.facebook.com/nishak69?_rdc=1&_rdr#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors hover:scale-110 transform duration-200">
              <FaFacebook size={20} />
            </a>
            <a href="https://fantastic-kataifi-48b24f.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors hover:scale-110 transform duration-200" title="Portfolio">
              <FaGlobe size={20} />
            </a>
            <a href="https://www.linkedin.com/in/md-jihanur-rahman/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors hover:scale-110 transform duration-200">
              <FaLinkedin size={20} />
            </a>
             <a href="https://github.com/jihanurrahman33" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors hover:scale-110 transform duration-200">
              <FaGithub size={20} />
            </a>
            <a href="https://www.instagram.com/nishak_69/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors hover:scale-110 transform duration-200">
              <FaInstagram size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h6 className="font-semibold text-gray-900 mb-4 uppercase tracking-wider text-xs">Platform</h6>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/report-issue" className="hover:text-primary transition-colors">
                Report an Issue
              </Link>
            </li>
            <li>
              <Link to="/all-issues" className="hover:text-primary transition-colors">
                Browse Issues
              </Link>
            </li>
            <li>
              <a href="/#how-it-works" className="hover:text-primary transition-colors">
                How It Works
              </a>
            </li>
            <li>
              <a href="/#features" className="hover:text-primary transition-colors">
                Features
              </a>
            </li>
          </ul>
        </div>

        {/* Organization */}
        <div>
          <h6 className="font-semibold text-gray-900 mb-4 uppercase tracking-wider text-xs">Organization</h6>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/about" className="hover:text-primary transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/team" className="hover:text-primary transition-colors">
                Our Team
              </Link>
            </li>
            <li>
              <Link to="/careers" className="hover:text-primary transition-colors">
                Careers
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h6 className="font-semibold text-gray-900 mb-4 uppercase tracking-wider text-xs">Socials</h6>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="https://github.com/jihanurrahman33" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                GitHub
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/md-jihanur-rahman/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                LinkedIn
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/nishak_69/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://web.facebook.com/nishak69?_rdc=1&_rdr#" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                Facebook
              </a>
            </li>
            <li>
              <a href="https://fantastic-kataifi-48b24f.netlify.app/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                Portfolio
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} PIIRS. All rights reserved. Built for better cities.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="/privacy-policy" className="hover:text-gray-900 transition-colors">Privacy</Link>
            <Link to="/terms-of-service" className="hover:text-gray-900 transition-colors">Terms</Link>
            <Link to="/sitemap" className="hover:text-gray-900 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
