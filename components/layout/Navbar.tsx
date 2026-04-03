"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/productos", label: "Productos" },
    { href: "/contacto", label: "Contacto" },
  ];

  return (
    <nav className="bg-dark-bg/80 backdrop-blur-md border-b border-dark-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Oro Rojo 29"
                width={40}
                height={40}
                priority
                className="rounded group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl tracking-wide text-white group-hover:text-cobre-light transition-colors duration-300">
                Oro Rojo 29
              </span>
              <span className="text-[10px] text-gray-500 tracking-[0.2em] uppercase">
                Artesanía en Cobre
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300 tracking-wide group py-2"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-cobre-dark to-cobre-light group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-dark-border/50 py-6 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 px-2 text-gray-400 hover:text-white hover:bg-dark-card/50 rounded transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}