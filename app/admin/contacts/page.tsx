import Link from "next/link";
import ThemeToggle from "@/app/components/ThemeToggle";
import { requireAdmin } from "@/lib/auth/admin";
import {
  deleteContact,
  markContactAsRead,
  markContactAsUnread,
} from "./actions";

type Contact = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(value));
}

export default async function AdminContactsPage() {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("contacts")
    .select(`
      id,
      name,
      email,
      subject,
      message,
      is_read,
      created_at
    `)
    .order("created_at", {
      ascending: false,
    });

  const contacts = (data ?? []) as Contact[];

  const unreadCount = contacts.filter(
    (contact) => !contact.is_read
  ).length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-pink-50 text-neutral-900 dark:from-neutral-950 dark:via-black dark:to-neutral-950 dark:text-white">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600 dark:text-sky-300">
              Admin
            </p>

            <p className="mt-1 font-semibold">
              Quản lý liên hệ
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium dark:border-white/10 dark:bg-white/5"
            >
              ← Bảng điều khiển
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <section className="rounded-[2rem] border border-black/5 bg-white/75 p-8 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-600 dark:text-pink-300">
                Hộp thư
              </p>

              <h1 className="mt-3 text-4xl font-bold">
                Tin nhắn liên hệ
              </h1>

              <p className="mt-3 text-neutral-500 dark:text-white/40">
                Có {contacts.length} tin nhắn, trong đó {unreadCount} tin chưa đọc.
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              {error.message}
            </div>
          )}

          {contacts.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-black/10 py-20 text-center text-neutral-400 dark:border-white/10 dark:text-white/30">
              Chưa có liên hệ nào.
            </div>
          ) : (
            <div className="mt-8 space-y-5">
              {contacts.map((contact) => (
                <article
                  key={contact.id}
                  className={`rounded-3xl border p-6 transition ${
                    contact.is_read
                      ? "border-black/5 bg-white/60 dark:border-white/10 dark:bg-white/[0.03]"
                      : "border-sky-200 bg-sky-50/80 shadow-sm dark:border-sky-500/20 dark:bg-sky-500/10"
                  }`}
                >
                  <div className="flex flex-col justify-between gap-5 md:flex-row">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-bold">
                          {contact.subject || "Không có tiêu đề"}
                        </h2>

                        {!contact.is_read && (
                          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-500/20 dark:text-sky-300">
                            Chưa đọc
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm text-neutral-500 dark:text-white/40">
                        Từ: {contact.name} · {contact.email}
                      </p>

                      <p className="mt-1 text-xs text-neutral-400 dark:text-white/25">
                        {formatDate(contact.created_at)}
                      </p>

                      <p className="mt-5 whitespace-pre-wrap leading-7 text-neutral-700 dark:text-white/70">
                        {contact.message}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2 md:flex-col">
                      {contact.is_read ? (
                        <form action={markContactAsUnread}>
                          <input
                            type="hidden"
                            name="id"
                            value={contact.id}
                          />

                          <button
                            type="submit"
                            className="w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold transition hover:bg-neutral-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                          >
                            Đánh dấu chưa đọc
                          </button>
                        </form>
                      ) : (
                        <form action={markContactAsRead}>
                          <input
                            type="hidden"
                            name="id"
                            value={contact.id}
                          />

                          <button
                            type="submit"
                            className="w-full rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-700 dark:bg-white dark:text-black"
                          >
                            Đã đọc
                          </button>
                        </form>
                      )}

                      <a
                        href={`mailto:${contact.email}`}
                        className="rounded-xl border border-black/10 bg-white px-4 py-2 text-center text-sm font-semibold transition hover:bg-sky-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                      >
                        Trả lời email
                      </a>

                      <form action={deleteContact}>
                        <input
                          type="hidden"
                          name="id"
                          value={contact.id}
                        />

                        <button
                          type="submit"
                          className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
                        >
                          Xóa
                        </button>
                      </form>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}