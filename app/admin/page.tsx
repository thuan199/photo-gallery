import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ThemeToggle from "@/app/components/ThemeToggle";

export default async function AdminPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-pink-50 text-neutral-900 transition-colors dark:from-neutral-950 dark:via-black dark:to-neutral-950 dark:text-white">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/75 backdrop-blur-xl dark:border-white/10 dark:bg-black/50">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600 dark:text-sky-300">
              Moments Admin
            </p>

            <h1 className="mt-1 text-xl font-bold">
              Trang quản trị
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              <span aria-hidden="true">←</span>
              <span className="hidden sm:inline">Về trang chính</span>
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
        <section className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-white/80 p-8 shadow-[0_30px_80px_rgba(14,165,233,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none lg:p-12">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sky-200/60 blur-3xl dark:bg-sky-500/10" />

          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-pink-200/60 blur-3xl dark:bg-pink-500/10" />

          <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600 dark:text-sky-300">
                Xin chào
              </p>

              <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
                Quản lý album và hình ảnh
                <span className="block bg-gradient-to-r from-sky-500 to-pink-500 bg-clip-text text-transparent">
                  nhanh chóng và trực quan
                </span>
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600 dark:text-white/60">
                Bạn đã đăng nhập thành công. Chọn một khu vực bên dưới
                để bắt đầu quản lý nội dung website.
              </p>
            </div>

            <Link
              href="/admin/albums/new"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-neutral-700 dark:bg-white dark:text-black dark:hover:bg-white/85"
            >
              <span className="text-lg">＋</span>
              Tạo album mới
            </Link>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-white/40">
                Quản lý nội dung
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Chọn chức năng
              </h2>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <Link
              href="/admin/albums"
              className="group relative overflow-hidden rounded-[1.75rem] border border-sky-100 bg-white p-7 shadow-[0_20px_50px_rgba(14,165,233,0.10)] transition duration-300 hover:-translate-y-2 hover:border-sky-300 hover:shadow-[0_30px_70px_rgba(14,165,233,0.18)] dark:border-white/10 dark:bg-neutral-900 dark:shadow-none dark:hover:border-sky-400/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-2xl dark:bg-sky-500/15">
                  🗂️
                </div>

                <span className="text-2xl text-neutral-400 transition group-hover:translate-x-1 group-hover:-translate-y-1 dark:text-white/40">
                  ↗
                </span>
              </div>

              <p className="mt-7 text-sm font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">
                Album
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                Quản lý album
              </h3>

              <p className="mt-3 leading-6 text-neutral-600 dark:text-white/55">
                Tạo mới, chỉnh sửa, sắp xếp và xóa các album ảnh.
              </p>
            </Link>

            <Link
              href="/admin/photos"
              className="group relative overflow-hidden rounded-[1.75rem] border border-pink-100 bg-white p-7 shadow-[0_20px_50px_rgba(236,72,153,0.10)] transition duration-300 hover:-translate-y-2 hover:border-pink-300 hover:shadow-[0_30px_70px_rgba(236,72,153,0.18)] dark:border-white/10 dark:bg-neutral-900 dark:shadow-none dark:hover:border-pink-400/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-2xl dark:bg-pink-500/15">
                  🖼️
                </div>

                <span className="text-2xl text-neutral-400 transition group-hover:translate-x-1 group-hover:-translate-y-1 dark:text-white/40">
                  ↗
                </span>
              </div>

              <p className="mt-7 text-sm font-semibold uppercase tracking-[0.2em] text-pink-600 dark:text-pink-300">
                Hình ảnh
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                Quản lý hình ảnh
              </h3>

              <p className="mt-3 leading-6 text-neutral-600 dark:text-white/55">
                Chọn album để thêm, chỉnh sửa hoặc xóa hình ảnh.
              </p>
            </Link>

            <article className="relative overflow-hidden rounded-[1.75rem] border border-violet-100 bg-white p-7 opacity-80 shadow-[0_20px_50px_rgba(139,92,246,0.08)] dark:border-white/10 dark:bg-neutral-900 dark:shadow-none">
              <div className="flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-2xl dark:bg-violet-500/15">
                  💬
                </div>

                <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                  Sắp có
                </span>
              </div>

              <p className="mt-7 text-sm font-semibold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-300">
                Bình luận
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                Chờ duyệt
              </h3>

              <p className="mt-3 leading-6 text-neutral-600 dark:text-white/55">
                Quản lý và phê duyệt bình luận của khách truy cập.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[1.5rem] border border-black/5 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <p className="text-sm text-neutral-500 dark:text-white/40">
              Gợi ý
            </p>

            <p className="mt-2 text-lg font-semibold">
              Dùng ảnh bìa rõ nét
            </p>

            <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-white/50">
              Ảnh ngang tỷ lệ khoảng 16:9 sẽ hiển thị đẹp hơn trên trang chủ.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-black/5 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <p className="text-sm text-neutral-500 dark:text-white/40">
              Trình chiếu
            </p>

            <p className="mt-2 text-lg font-semibold">
              Sắp xếp ảnh theo thứ tự
            </p>

            <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-white/50">
              Điều chỉnh trường thứ tự để hình ảnh xuất hiện đúng mong muốn.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-black/5 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <p className="text-sm text-neutral-500 dark:text-white/40">
              Xuất bản
            </p>

            <p className="mt-2 text-lg font-semibold">
              Kiểm tra trước khi công khai
            </p>

            <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-white/50">
              Chỉ những album và ảnh đã bật xuất bản mới xuất hiện ngoài website.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}