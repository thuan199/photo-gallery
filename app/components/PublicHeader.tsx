"use client";

import Link from "next/link";
import { useState } from "react";

type PublicHeaderProps = {
  active?: "home" | "contact";
};

export default function PublicHeader({
  active,
}: PublicHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-black/[0.06] bg-[#f7f5f0]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-6 lg:px-10">

        {/* LOGO */}
        <Link
          href="/"
          onClick={closeMenu}
          className="relative z-20 font-serif text-xl tracking-[0.03em] text-[#292722] sm:text-2xl"
        >
          Nhìn lại mình đi
        </Link>


        {/* DESKTOP MENU */}
        <nav className="hidden items-center gap-8 text-[11px] uppercase tracking-[0.22em] text-[#716b61] md:flex">

          <Link
            href="/"
            className={`relative py-2 transition hover:text-[#292722] ${
              active === "home"
                ? "text-[#292722]"
                : ""
            }`}
          >
            Trang chủ

            {active === "home" && (
              <span className="absolute inset-x-0 bottom-0 h-px bg-[#292722]" />
            )}
          </Link>

          <Link
            href="/#albums"
            className="py-2 transition hover:text-[#292722]"
          >
            Album
          </Link>

          <Link
            href="/contact"
            className={`relative py-2 transition hover:text-[#292722] ${
              active === "contact"
                ? "text-[#292722]"
                : ""
            }`}
          >
            Liên hệ

            {active === "contact" && (
              <span className="absolute inset-x-0 bottom-0 h-px bg-[#292722]" />
            )}
          </Link>

        </nav>


        {/* MOBILE BUTTON */}
        <button
          type="button"
          onClick={() =>
            setMenuOpen((current) => !current)
          }
          aria-label={
            menuOpen
              ? "Đóng menu"
              : "Mở menu"
          }
          aria-expanded={menuOpen}
          className="relative z-20 flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
        >
          <span
            className={`block h-px w-6 bg-[#292722] transition duration-300 ${
              menuOpen
                ? "translate-y-[6px] rotate-45"
                : ""
            }`}
          />

          <span
            className={`block h-px w-6 bg-[#292722] transition duration-300 ${
              menuOpen
                ? "opacity-0"
                : ""
            }`}
          />

          <span
            className={`block h-px w-6 bg-[#292722] transition duration-300 ${
              menuOpen
                ? "-translate-y-[6px] -rotate-45"
                : ""
            }`}
          />
        </button>

      </div>


      {/* MOBILE MENU */}
      <div
        className={`absolute left-0 top-[76px] w-full overflow-hidden bg-[#f7f5f0] transition-all duration-500 md:hidden ${
          menuOpen
            ? "max-h-[360px] border-b border-black/10 opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <nav className="px-6 py-8">

          <Link
            href="/"
            onClick={closeMenu}
            className="group flex items-center justify-between border-b border-black/10 py-5"
          >
            <span className="font-serif text-3xl">
              Trang chủ
            </span>

            <span className="text-lg transition group-hover:translate-x-1">
              ↗
            </span>
          </Link>


          <Link
            href="/#albums"
            onClick={closeMenu}
            className="group flex items-center justify-between border-b border-black/10 py-5"
          >
            <span className="font-serif text-3xl">
              Album
            </span>

            <span className="text-lg transition group-hover:translate-x-1">
              ↗
            </span>
          </Link>


          <Link
            href="/contact"
            onClick={closeMenu}
            className="group flex items-center justify-between py-5"
          >
            <span className="font-serif text-3xl">
              Liên hệ
            </span>

            <span className="text-lg transition group-hover:translate-x-1">
              ↗
            </span>
          </Link>

          <p className="mt-7 text-[9px] uppercase tracking-[0.35em] text-[#9a8f7d]">
            Personal Photo Journal
          </p>

        </nav>
      </div>

    </header>
  );
}