import { submitComment } from "./actions";
import { toggleCommentReaction } from "./reaction-actions";

type ReactionType = "like" | "love" | "laugh" | "wow" | "sad";

type CommentReaction = {
  reaction_type: ReactionType;
  visitor_id: string;
};

type Comment = {
  id: string;
  name: string;
  content: string;
  created_at: string;
  comment_reactions: CommentReaction[];
};

type CommentSectionProps = {
  albumId: string;
  albumSlug: string;
  comments: Comment[];
  commentSuccess: boolean;
  commentError?: string;
  visitorId: string | null;
};

const reactionOptions: {
  type: ReactionType;
  icon: string;
  label: string;
}[] = [
  {
    type: "like",
    icon: "👍",
    label: "Thích",
  },
  {
    type: "love",
    icon: "❤️",
    label: "Yêu thích",
  },
  {
    type: "laugh",
    icon: "😂",
    label: "Vui",
  },
  {
    type: "wow",
    icon: "😮",
    label: "Ngạc nhiên",
  },
  {
    type: "sad",
    icon: "😢",
    label: "Buồn",
  },
];

export default function CommentSection({
  albumId,
  albumSlug,
  comments,
  commentSuccess,
  commentError,
  visitorId,
}: CommentSectionProps) {
  return (
    <section
      id="comments"
      className="mx-auto mt-20 w-full max-w-5xl scroll-mt-24 px-4 pb-20 sm:px-6"
    >
      <div className="overflow-hidden rounded-3xl border border-black/10 bg-white/80 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/80">
        <div className="border-b border-black/10 px-6 py-6 dark:border-white/10 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
            Chia sẻ cảm nhận
          </p>

          <h2 className="mt-2 text-2xl font-bold text-neutral-900 dark:text-white sm:text-3xl">
            Bình luận về album
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
            Bình luận sẽ được hiển thị sau khi quản trị viên xét duyệt.
            Email của bạn không hiển thị công khai.
          </p>
        </div>

        <div className="px-6 py-6 sm:px-8 sm:py-8">
          {commentSuccess && (
            <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
              Gửi bình luận thành công. Bình luận đang chờ quản trị viên xét
              duyệt.
            </div>
          )}

          {commentError && (
            <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
              {commentError}
            </div>
          )}

          <form action={submitComment} className="space-y-5">
            <input type="hidden" name="album_id" value={albumId} />
            <input type="hidden" name="album_slug" value={albumSlug} />

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="comment-name"
                  className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Họ tên
                </label>

                <input
                  id="comment-name"
                  name="name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={100}
                  placeholder="Nhập tên của bạn"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-500 focus:ring-4 focus:ring-neutral-500/10 dark:border-white/10 dark:bg-neutral-950 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="comment-email"
                  className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Email
                </label>

                <input
                  id="comment-email"
                  name="email"
                  type="email"
                  required
                  placeholder="email@example.com"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-500 focus:ring-4 focus:ring-neutral-500/10 dark:border-white/10 dark:bg-neutral-950 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="comment-content"
                className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Nội dung bình luận
              </label>

              <textarea
                id="comment-content"
                name="content"
                required
                minLength={5}
                maxLength={2000}
                rows={5}
                placeholder="Viết cảm nhận của bạn về album này..."
                className="w-full resize-y rounded-2xl border border-black/10 bg-white px-4 py-3 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-500 focus:ring-4 focus:ring-neutral-500/10 dark:border-white/10 dark:bg-neutral-950 dark:text-white"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700 active:scale-[0.98] dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
              >
                Gửi bình luận
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-12">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              Cảm nhận của người xem
            </p>

            <h3 className="mt-2 text-xl font-bold text-neutral-900 dark:text-white sm:text-2xl">
              Bình luận đã được duyệt
            </h3>
          </div>

          <span className="shrink-0 rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-xs font-medium text-neutral-600 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-400">
            {comments.length} bình luận
          </span>
        </div>

        {comments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-black/10 bg-white/50 px-6 py-12 text-center dark:border-white/10 dark:bg-neutral-900/50">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-xl dark:bg-neutral-800">
              💬
            </div>

            <p className="mt-4 font-medium text-neutral-800 dark:text-neutral-200">
              Chưa có bình luận
            </p>

            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Hãy là người đầu tiên chia sẻ cảm nhận về album này.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <article
                key={comment.id}
                className="rounded-3xl border border-black/10 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-900/70 sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-bold uppercase text-white dark:bg-white dark:text-neutral-900">
                    {comment.name.trim().charAt(0) || "?"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-semibold text-neutral-900 dark:text-white">
                        {comment.name}
                      </h4>

                      <time className="text-xs text-neutral-500 dark:text-neutral-500">
                        {new Intl.DateTimeFormat("vi-VN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                          timeZone: "Asia/Ho_Chi_Minh",
                        }).format(new Date(comment.created_at))}
                      </time>
                    </div>

                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-neutral-700 dark:text-neutral-300">
                      {comment.content}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      {reactionOptions.map((reaction) => {
                        const reactionList =
                          comment.comment_reactions ?? [];

                        const count = reactionList.filter(
                          (item) =>
                            item.reaction_type === reaction.type
                        ).length;

                        const isSelected =
                          visitorId !== null &&
                          reactionList.some(
                            (item) =>
                              item.reaction_type === reaction.type &&
                              item.visitor_id === visitorId
                          );

                        return (
                          <form
                            key={reaction.type}
                            action={toggleCommentReaction}
                          >
                            <input
                              type="hidden"
                              name="comment_id"
                              value={comment.id}
                            />

                            <input
                              type="hidden"
                              name="album_slug"
                              value={albumSlug}
                            />

                            <input
                              type="hidden"
                              name="reaction_type"
                              value={reaction.type}
                            />

                            <button
                              type="submit"
                              title={reaction.label}
                              aria-label={`${reaction.label}: ${count}`}
                              className={[
                                "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition active:scale-95",
                                isSelected
                                  ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                                  : "border-black/10 bg-white/80 text-neutral-700 hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800",
                              ].join(" ")}
                            >
                              <span aria-hidden="true">
                                {reaction.icon}
                              </span>

                              {count > 0 && (
                                <span className="text-xs font-semibold">
                                  {count}
                                </span>
                              )}
                            </button>
                          </form>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}