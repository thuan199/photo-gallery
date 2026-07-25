"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ThemeToggle from "@/app/components/ThemeToggle";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage("Email hoặc mật khẩu không chính xác.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-white to-pink-50 text-neutral-900 transition-colors dark:from-neutral-950 dark:via-black dark:to-neutral-950 dark:text-white">
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-sky-200/60 blur-3xl dark:bg-sky-500/10" />

      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-pink-200/60 blur-3xl dark:bg-pink-500/10" />

      <header className="relative z-20 border-b border-black/5 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-black/30">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-900 text-lg text-white shadow-lg transition group-hover:-translate-y-0.5 dark:bg-white dark:text-black">
              📷
            </span>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600 dark:text-sky-300">
                Nhìn lại mình đi
              </p>

              <p className="mt-1 text-sm font-semibold text-neutral-700 dark:text-white/70">
                Khu vực riêng
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 sm:inline-flex dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              ← Về trang chủ
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_460px] lg:py-16">
        <section className="hidden lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-pink-600 dark:text-pink-300">
            Moments Admin
          </p>

          <h1 className="mt-5 max-w-3xl text-5xl font-bold leading-tight xl:text-6xl">
            Lưu giữ và quản lý
            <span className="block bg-gradient-to-r from-sky-500 to-pink-500 bg-clip-text text-transparent">
              những khoảnh khắc đáng nhớ.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-600 dark:text-white/55">
            Khu vực dành riêng cho chủ sở hữu website để quản lý album,
            hình ảnh và nội dung hiển thị.
          </p>

          <div className="mt-10 grid max-w-xl gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-black/5 bg-white/65 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-xl dark:bg-sky-500/15">
                🗂️
              </div>

              <p className="mt-4 font-semibold">
                Quản lý album
              </p>

              <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-white/40">
                Tạo mới, chỉnh sửa và sắp xếp nội dung nhanh chóng.
              </p>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white/65 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-100 text-xl dark:bg-pink-500/15">
                🖼️
              </div>

              <p className="mt-4 font-semibold">
                Quản lý hình ảnh
              </p>

              <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-white/40">
                Cập nhật ảnh, tiêu đề và trạng thái hiển thị.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full">
          <form
            onSubmit={handleLogin}
            className="overflow-hidden rounded-[2rem] border border-black/5 bg-white/85 shadow-[0_30px_100px_rgba(14,165,233,0.13)] backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-900/85 dark:shadow-none"
          >
            <div className="border-b border-black/5 bg-gradient-to-r from-sky-50 to-pink-50 px-7 py-7 dark:border-white/10 dark:from-sky-500/10 dark:to-pink-500/10 sm:px-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-900 text-2xl text-white shadow-lg dark:bg-white dark:text-black">
                🔐
              </div>

              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-sky-600 dark:text-sky-300">
                Đăng nhập
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Chào mừng trở lại
              </h2>

              <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-white/50">
                Nhập thông tin tài khoản để tiếp tục vào khu vực quản trị.
              </p>
            </div>

            <div className="p-7 sm:p-8">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-neutral-700 dark:text-white/75"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/25 dark:focus:border-sky-400 dark:focus:ring-sky-500/10"
                />
              </div>

              <div className="mt-5">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-neutral-700 dark:text-white/75"
                >
                  Mật khẩu
                </label>

                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/25 dark:focus:border-pink-400 dark:focus:ring-pink-500/10"
                />
              </div>

              {errorMessage && (
                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold dark:bg-red-500/20">
                    !
                  </span>

                  <div>
                    <p className="font-semibold">
                      Đăng nhập không thành công
                    </p>

                    <p className="mt-1 text-sm opacity-80">
                      {errorMessage}
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3.5 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-neutral-700 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-white/85"
              >
                {isLoading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-black/20 dark:border-t-black" />
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">→</span>
                    Đăng nhập
                  </>
                )}
              </button>

              <div className="mt-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-black/5 dark:bg-white/10" />

                <span className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400 dark:text-white/30">
                  Khu vực riêng tư
                </span>

                <div className="h-px flex-1 bg-black/5 dark:bg-white/10" />
              </div>

              <p className="mt-5 text-center text-xs leading-5 text-neutral-500 dark:text-white/35">
                Chỉ tài khoản được cấp quyền mới có thể truy cập khu vực này.
              </p>

              <Link
                href="/"
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-black/10 bg-white px-5 py-3 font-semibold text-neutral-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 sm:hidden dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
              >
                ← Quay về trang chủ
              </Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}