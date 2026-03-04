"use client";
import React from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";
import Image from "next/image";

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Documentation", href: "#docs" },
      { label: "API", href: "#api" },
    ],
    Company: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
    Resources: [
      { label: "Help Center", href: "#help" },
      { label: "Community", href: "#community" },
      { label: "Roadmap", href: "#roadmap" },
      { label: "Status", href: "#status" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Security", href: "/security" },
    ],
  };

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="Astra AI"
                  width={32}
                  height={32}
                  className="rounded"
                />
                <div>
                  <h3 className="font-bold text-white text-lg">Astra AI</h3>
                  <p className="text-xs text-slate-400">
                    AI-Powered App Generator
                  </p>
                </div>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Turn your ideas into fully functional web applications instantly
              with AI-powered code generation and deployment.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-400 transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:contact@astra-ai.com"
                className="text-slate-400 hover:text-blue-400 transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white text-sm mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-slate-400 text-sm hover:text-blue-400 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <div className="text-slate-400 text-sm">
            <p>
              © {currentYear} Astra AI. Built with{" "}
              <Heart size={14} className="inline text-red-500 mx-1" />
              by the Astra team.
            </p>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm">
              Ready to build something amazing?
            </span>
            <Link
              href="/"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-8 border-t border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-500">
            <div>
              <p className="font-semibold text-slate-400 mb-1">Status</p>
              <p>All systems operational</p>
            </div>
            <div>
              <p className="font-semibold text-slate-400 mb-1">API Version</p>
              <p>v1.0.0 • Updated weekly</p>
            </div>
            <div>
              <p className="font-semibold text-slate-400 mb-1">Support</p>
              <p>support@astra-ai.com • Available 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
