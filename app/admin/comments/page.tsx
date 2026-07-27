import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import {
  deleteComment,
  updateCommentStatus,
} from "./actions";

type CommentStatus = "pending" | "approved" | "rejected";

type CommentReaction = {
  reaction_type: string;
};

type AlbumInfo = {
  id: string;
  title: string;
  slug: string;
};

type CommentItem = {
  id: string;
  album_id: string;
  name: string;
  email: string;
  content: string;
  status: CommentStatus;
  created_at: string;
  updated_at: string | null;
  albums: AlbumInfo | AlbumInfo[] | null;
  comment_reactions: CommentReaction[] | null;
};

type AdminCommentsPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

const reactionIcons: Record<string, string> = {
  like: "👍",
  love: "❤️",
  laugh: "😂",
  wow: "😮",
  sad: "😢",
};

function getStatusText(status: CommentStatus) {
  switch (status) {
    case "approved":
      return "Đã duyệt";
    case "rejected":
      return "Đã từ chối";
    default:
      return "Chờ duyệt";
  }
}

function getStatusClass(status: CommentStatus) {
  switch (status) {
    case "approved":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
    case "rejected":
      return "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300";
    default:
      return "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300";
  }
}

function getAlbum(comment: CommentItem): AlbumInfo | null {
  if (!comment.albums) {
    return null;
  }

  if (Array.isArray(comment.albums)) {
    return comment.albums[0] ?? null;
  }

  return comment.albums;
}

function getReactionCount(
  reactions: CommentReaction[],
  reactionType: string
) {
  return reactions.filter(
    (reaction) => reaction.reaction_type === reactionType
  ).length;
}

export default async function AdminCommentsPage({
  searchParams,
}: AdminCommentsPageProps) {
  const { supabase } = await requireAdmin();
  const query = await searchParams;

  const selectedStatus =
    query.status === "pending" ||
    query.status === "approved" ||
    query.status === "rejected"
      ? query.status
      : "all";

  let commentsQuery = supabase
    .from("comments")
    .select(`
      id,
      album_id,
      name,
      email,
      content,
      status,
      created_at,
      updated_at,
      albums (
        id,
        title,
        slug
      ),
      comment_reactions (
        reaction_type
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  if (selectedStatus !== "all") {
    commentsQuery = commentsQuery.eq("status", selectedStatus);
  }

  const { data: commentsData, error } = await commentsQuery;

  if (error) {
    console.error("Lỗi tải danh sách bình luận:", error);
  }

  const comments = (commentsData ?? []) as CommentItem[];

  const pendingCount = comments.filter(
    (comment) => comment.status === "pending"
  ).length;

  const approvedCount = comments.filter(
    (comment) => comment.status === "approved"
  ).length;

  const rejectedCount = comments.filter(
    (comment) => comment.status === "rejected"
  ).length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-pink-50 px-4 py-8 text-neutral-900 transition-colors dark:from-neutral-950 dark:via-black dark:to-neutral-950 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-600 dark:text-violet-300">
              Moments Admin
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Quản lý bình luận
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
              Duyệt, từ chối hoặc xóa bình luận của khách truy cập và xem số
              lượt cảm xúc.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              ← Trang quản trị
            </Link>

            <Link
              href="/"
              target="_blank"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
            >
              Xem website
            </Link>
          </div>
        </div>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-black/5 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Tổng hiển thị
            </p>

            <p className="mt-2 text-3xl font-bold">{comments.length}</p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/20 dark:bg-amber-500/5">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Chờ duyệt
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-700 dark:text-amber-200">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/5">
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Đã duyệt
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-700 dark:text-emerald-200">
              {approvedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-500/20 dark:bg-red-500/5">
            <p className="text-sm text-red-700 dark:text-red-300">
              Đã từ chối
            </p>

            <p className="mt-2 text-3xl font-bold text-red-700 dark:text-red-200">
              {rejectedCount}
            </p>
          </div>
        </section>

        <section className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/admin/comments"
            className={[
              "rounded-full border px-4 py-2 text-sm font-medium transition",
              selectedStatus === "all"
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-950"
                : "border-black/10 bg-white text-neutral-600 hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800",
            ].join(" ")}
          >
            Tất cả
          </Link>

          <Link
            href="/admin/comments?status=pending"
            className={[
              "rounded-full border px-4 py-2 text-sm font-medium transition",
              selectedStatus === "pending"
                ? "border-amber-400 bg-amber-400 text-neutral-950"
                : "border-black/10 bg-white text-neutral-600 hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800",
            ].join(" ")}
          >
            Chờ duyệt
          </Link>

          <Link
            href="/admin/comments?status=approved"
            className={[
              "rounded-full border px-4 py-2 text-sm font-medium transition",
              selectedStatus === "approved"
                ? "border-emerald-400 bg-emerald-400 text-neutral-950"
                : "border-black/10 bg-white text-neutral-600 hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800",
            ].join(" ")}
          >
            Đã duyệt
          </Link>

          <Link
            href="/admin/comments?status=rejected"
            className={[
              "rounded-full border px-4 py-2 text-sm font-medium transition",
              selectedStatus === "rejected"
                ? "border-red-400 bg-red-400 text-neutral-950"
                : "border-black/10 bg-white text-neutral-600 hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800",
            ].join(" ")}
          >
            Đã từ chối
          </Link>
        </section>

        {comments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-black/10 bg-white/70 px-6 py-20 text-center dark:border-white/10 dark:bg-neutral-900/50">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-2xl dark:bg-violet-500/15">
              💬
            </div>

            <h2 className="mt-5 text-lg font-semibold">
              Chưa có bình luận
            </h2>

            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Không có bình luận nào phù hợp với bộ lọc hiện tại.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {comments.map((comment) => {
              const album = getAlbum(comment);
              const reactions = comment.comment_reactions ?? [];

              return (
                <article
                  key={comment.id}
                  className="overflow-hidden rounded-3xl border border-black/5 bg-white/85 shadow-[0_20px_50px_rgba(139,92,246,0.08)] backdrop-blur dark:border-white/10 dark:bg-neutral-900 dark:shadow-none"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/5 px-5 py-5 dark:border-white/10 sm:px-6">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-bold uppercase text-white dark:bg-white dark:text-neutral-950">
                        {comment.name.trim().charAt(0) || "?"}
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate font-semibold">
                          {comment.name}
                        </h2>

                        <p className="mt-1 break-all text-sm text-neutral-500 dark:text-neutral-400">
                          {comment.email}
                        </p>
                      </div>
                    </div>

                    <span
                      className={[
                        "rounded-full border px-3 py-1.5 text-xs font-semibold",
                        getStatusClass(comment.status),
                      ].join(" ")}
                    >
                      {getStatusText(comment.status)}
                    </span>
                  </div>

                  <div className="px-5 py-5 sm:px-6">
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-500 dark:text-neutral-400">
                      <div>
                        <span>Album: </span>

                        {album ? (
                          <Link
                            href={`/albums/${album.slug}`}
                            target="_blank"
                            className="font-medium text-neutral-800 underline underline-offset-4 hover:text-neutral-950 dark:text-neutral-200 dark:hover:text-white"
                          >
                            {album.title}
                          </Link>
                        ) : (
                          <span>Không xác định</span>
                        )}
                      </div>

                      <div>
                        <span>Ngày gửi: </span>

                        <time>
                          {new Intl.DateTimeFormat("vi-VN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                            timeZone: "Asia/Ho_Chi_Minh",
                          }).format(new Date(comment.created_at))}
                        </time>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-black/5 bg-neutral-50 px-4 py-4 dark:border-white/10 dark:bg-neutral-950">
                      <p className="whitespace-pre-wrap break-words text-sm leading-7 text-neutral-700 dark:text-neutral-200">
                        {comment.content}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Cảm xúc
                      </span>

                      {Object.entries(reactionIcons).map(
                        ([reactionType, icon]) => {
                          const count = getReactionCount(
                            reactions,
                            reactionType
                          );

                          return (
                            <span
                              key={reactionType}
                              className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm text-neutral-700 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-300"
                            >
                              <span>{icon}</span>
                              <span className="text-xs font-semibold">
                                {count}
                              </span>
                            </span>
                          );
                        }
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3 border-t border-black/5 bg-neutral-50/80 px-5 py-4 dark:border-white/10 dark:bg-neutral-950/60 sm:px-6">
                    {comment.status !== "approved" && (
                      <form action={updateCommentStatus}>
                        <input
                          type="hidden"
                          name="comment_id"
                          value={comment.id}
                        />

                        <input
                          type="hidden"
                          name="status"
                          value="approved"
                        />

                        <button
                          type="submit"
                          className="inline-flex min-h-10 items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-400"
                        >
                          Duyệt
                        </button>
                      </form>
                    )}

                    {comment.status !== "rejected" && (
                      <form action={updateCommentStatus}>
                        <input
                          type="hidden"
                          name="comment_id"
                          value={comment.id}
                        />

                        <input
                          type="hidden"
                          name="status"
                          value="rejected"
                        />

                        <button
                          type="submit"
                          className="inline-flex min-h-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-500/20 dark:text-amber-300"
                        >
                          Từ chối
                        </button>
                      </form>
                    )}

                    {comment.status !== "pending" && (
                      <form action={updateCommentStatus}>
                        <input
                          type="hidden"
                          name="comment_id"
                          value={comment.id}
                        />

                        <input
                          type="hidden"
                          name="status"
                          value="pending"
                        />

                        <button
                          type="submit"
                          className="inline-flex min-h-10 items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        >
                          Chuyển về chờ duyệt
                        </button>
                      </form>
                    )}

                    <form action={deleteComment}>
                      <input
                        type="hidden"
                        name="comment_id"
                        value={comment.id}
                      />

                      <button
                        type="submit"
                        className="inline-flex min-h-10 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-500/20 dark:text-red-300"
                      >
                        Xóa
                      </button>
                    </form>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}