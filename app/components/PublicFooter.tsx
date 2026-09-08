import Link from "next/link";

type PublicFooterProps = {
  variant?: "light" | "dark";
};

export default function PublicFooter({
  variant = "light",
}: PublicFooterProps) {
  const isDark = variant === "dark";

  return (
    <footer
      className={
        isDark
          ? "bg-[#292722] text-[#f7f5f0]"
          : "bg-[#f7f5f0] text-[#292722]"
      }
    >
      <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-10 lg:py-14">

        <div
          className={`flex flex-col justify-between gap-10 border-t pt-8 sm:flex-row sm:items-end ${
            isDark
              ? "border-white/15"
              : "border-black/10"
          }`}
        >
          {/* BRAND */}
          <div>
            <Link
              href="/"
              className="font-serif text-2xl tracking-[0.02em]"
            >
              Nhìn lại mình đi
            </Link>

            <p
              className={`mt-3 text-[10px] uppercase tracking-[0.3em] ${
                isDark
                  ? "text-white/45"
                  : "text-[#9a8f7d]"
              }`}
            >
              Places, People & Moments
            </p>
          </div>

          {/* MENU */}
          <nav
            className={`flex flex-wrap gap-x-7 gap-y-3 text-[10px] uppercase tracking-[0.22em] ${
              isDark
                ? "text-white/55"
                : "text-[#716b61]"
            }`}
          >
            <Link
              href="/"
              className={
                isDark
                  ? "transition hover:text-white"
                  : "transition hover:text-[#292722]"
              }
            >
              Trang chủ
            </Link>

            <Link
              href="/#albums"
              className={
                isDark
                  ? "transition hover:text-white"
                  : "transition hover:text-[#292722]"
              }
            >
              Album
            </Link>

            <Link
              href="/contact"
              className={
                isDark
                  ? "transition hover:text-white"
                  : "transition hover:text-[#292722]"
              }
            >
              Liên hệ
            </Link>
          </nav>
        </div>

        {/* BOTTOM */}
        <div
          className={`mt-14 flex flex-col justify-between gap-3 text-xs sm:flex-row ${
            isDark
              ? "text-white/35"
              : "text-[#9a8f7d]"
          }`}
        >
          <p>
            © 2026 Phạm Ngọc Thuần · Trần Thị Huỳnh Mai
          </p>
         
          <p>
            Moments worth remembering.
          </p>
        </div>
      </div>
    </footer>
  );
}