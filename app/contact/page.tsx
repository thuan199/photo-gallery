import Link from "next/link";
import ThemeToggle from "@/app/components/ThemeToggle";
import { submitContact } from "./actions";

type ContactPageProps = {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
};

function getErrorMessage(error?: string) {
  switch (error) {
    case "ten-khong-hop-le":
      return "Vui lòng nhập họ tên có ít nhất 2 ký tự.";

    case "email-khong-hop-le":
      return "Địa chỉ email không hợp lệ.";

    case "noi-dung-qua-ngan":
      return "Nội dung liên hệ phải có ít nhất 10 ký tự.";

    default:
      return error ? decodeURIComponent(error) : null;
  }
}

export default async function ContactPage({
  searchParams,
}: ContactPageProps) {
  const params = await searchParams;

  const isSuccess = params.success === "1";
  const errorMessage = getErrorMessage(params.error);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-white to-pink-50 text-neutral-900 dark:from-neutral-950 dark:via-black dark:to-neutral-950 dark:text-white">
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-sky-200/60 blur-3xl dark:bg-sky-500/10" />

      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-pink-200/60 blur-3xl dark:bg-pink-500/10" />

      <header className="relative z-20 border-b border-black/5 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="bg-gradient-to-r from-sky-500 to-pink-500 bg-clip-text text-xl font-bold tracking-[0.2em] text-transparent"
          >
            Nhìn lại mình đi
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-sky-50 sm:inline-flex dark:border-white/10 dark:bg-white/5 dark:text-white"
            >
              ← Trang chủ
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_520px] lg:items-center lg:py-20">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600 dark:text-sky-300">
            Liên hệ
          </p>

          <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-tight sm:text-6xl">
            Hãy gửi một lời nhắn
            <span className="block bg-gradient-to-r from-sky-500 to-pink-500 bg-clip-text text-transparent">
              cho mình nhé.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-600 dark:text-white/50">
            Bạn có thể gửi góp ý, câu hỏi hoặc lời nhắn liên quan đến
            các album và hình ảnh trên website.
          </p>

          <div className="mt-10 grid max-w-xl gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-2xl dark:bg-sky-500/15">
                ✉️
              </div>

              <h2 className="mt-4 font-semibold">
                Gửi lời nhắn
              </h2>

              <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-white/40">
                Nội dung của bạn sẽ được lưu riêng trong khu vực quản trị.
              </p>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white/70 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-2xl dark:bg-pink-500/15">
                🔒
              </div>

              <h2 className="mt-4 font-semibold">
                Thông tin riêng tư
              </h2>

              <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-white/40">
                Email của bạn không được hiển thị công khai trên website.
              </p>
            </div>
          </div>
        </section>

        <section>
          <form
            action={submitContact}
            className="rounded-[2rem] border border-black/5 bg-white/85 p-7 shadow-[0_30px_100px_rgba(14,165,233,0.13)] backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-900/85 dark:shadow-none sm:p-8"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-600 dark:text-pink-300">
                Biểu mẫu liên hệ
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Gửi thông tin
              </h2>

              <p className="mt-3 text-sm leading-6 text-neutral-500 dark:text-white/40">
                Các trường có dấu * là bắt buộc.
              </p>
            </div>

            {isSuccess && (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                <p className="font-semibold">
                  Đã gửi liên hệ thành công
                </p>

                <p className="mt-1 text-sm opacity-80">
                  Cảm ơn bạn. Mình sẽ xem nội dung trong thời gian sớm nhất.
                </p>
              </div>
            )}

            {errorMessage && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                <p className="font-semibold">
                  Không thể gửi liên hệ
                </p>

                <p className="mt-1 text-sm opacity-80">
                  {errorMessage}
                </p>
              </div>
            )}

            <div className="mt-7">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-neutral-700 dark:text-white/75"
              >
                Họ tên <span className="text-red-500">*</span>
              </label>

              <input
                id="name"
                name="name"
                type="text"
                required
                minLength={2}
                maxLength={100}
                placeholder="Nhập họ tên"
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-sky-500/10"
              />
            </div>

            <div className="mt-5">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-neutral-700 dark:text-white/75"
              >
                Email <span className="text-red-500">*</span>
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={200}
                placeholder="name@example.com"
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-sky-500/10"
              />
            </div>

            <div className="mt-5">
              <label
                htmlFor="subject"
                className="block text-sm font-semibold text-neutral-700 dark:text-white/75"
              >
                Tiêu đề
              </label>

              <input
                id="subject"
                name="subject"
                type="text"
                maxLength={200}
                placeholder="Chủ đề liên hệ"
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-pink-500/10"
              />
            </div>

            <div className="mt-5">
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-neutral-700 dark:text-white/75"
              >
                Nội dung <span className="text-red-500">*</span>
              </label>

              <textarea
                id="message"
                name="message"
                required
                minLength={10}
                maxLength={3000}
                rows={6}
                placeholder="Nhập nội dung bạn muốn gửi..."
                className="mt-2 w-full resize-y rounded-xl border border-black/10 bg-white px-4 py-3.5 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-pink-500/10"
              />
            </div>

            <button
              type="submit"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3.5 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-neutral-700 dark:bg-white dark:text-black dark:hover:bg-white/85"
            >
              <span aria-hidden="true">✉</span>
              Gửi liên hệ
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}