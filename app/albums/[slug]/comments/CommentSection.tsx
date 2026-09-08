import { submitComment } from "./actions";
import { toggleCommentReaction } from "./reaction-actions";

type ReactionType =
  | "like"
  | "love"
  | "laugh"
  | "wow"
  | "sad";

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
    <div className="mx-auto w-full max-w-[1440px] px-6 py-24 lg:px-10 lg:py-32">

      {/* HEADER */}
      <div className="grid gap-10 lg:grid-cols-[0.75fr_1.5fr]">

        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#9a8f7d]">
            Guestbook
          </p>

          <p className="mt-4 text-sm leading-7 text-[#716b61]">
            {comments.length} lời nhắn
          </p>
        </div>

        <div>
          <h2 className="max-w-3xl font-serif text-4xl font-normal leading-[1.1] tracking-[-0.025em] sm:text-5xl lg:text-6xl">
            Để lại một lời nhắn
          </h2>

          <p className="mt-6 max-w-2xl text-[15px] leading-8 text-[#716b61]">
            Nếu album này gợi cho bạn một câu chuyện,
            một kỷ niệm hay đơn giản là một cảm xúc,
            hãy để lại vài dòng ở đây.
          </p>

          <p className="mt-3 text-xs leading-6 text-[#9a8f7d]">
            Bình luận sẽ được hiển thị sau khi được duyệt.
            Email chỉ dùng để xác nhận và không hiển thị công khai.
          </p>
        </div>

      </div>


      {/* FORM AREA */}
      <div className="mt-16 border-t border-black/10 pt-12 lg:mt-20 lg:pt-16">

        {commentSuccess && (
          <div className="mb-10 border-l-2 border-[#6e8065] pl-5">
            <p className="text-sm leading-7 text-[#56634f]">
              Cảm ơn bạn. Lời nhắn đã được gửi và đang chờ duyệt.
            </p>
          </div>
        )}

        {commentError && (
          <div className="mb-10 border-l-2 border-[#a85f56] pl-5">
            <p className="text-sm leading-7 text-[#8b4e47]">
              {commentError}
            </p>
          </div>
        )}


        <form
          action={submitComment}
          className="grid gap-10 lg:grid-cols-[0.75fr_1.5fr]"
        >
          <input
            type="hidden"
            name="album_id"
            value={albumId}
          />

          <input
            type="hidden"
            name="album_slug"
            value={albumSlug}
          />


          {/* LEFT */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#9a8f7d]">
              Your message
            </p>
          </div>


          {/* RIGHT */}
          <div className="max-w-4xl">

            <div className="grid gap-8 sm:grid-cols-2">

              {/* NAME */}
              <div>
                <label
                  htmlFor="comment-name"
                  className="block text-[10px] uppercase tracking-[0.25em] text-[#716b61]"
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
                  placeholder="Tên của bạn"
                  className="
                    mt-3
                    w-full
                    border-0
                    border-b
                    border-black/20
                    bg-transparent
                    px-0
                    py-3
                    text-[15px]
                    text-[#292722]
                    outline-none
                    transition
                    placeholder:text-[#aaa397]
                    focus:border-[#292722]
                  "
                />
              </div>


              {/* EMAIL */}
              <div>
                <label
                  htmlFor="comment-email"
                  className="block text-[10px] uppercase tracking-[0.25em] text-[#716b61]"
                >
                  Email
                </label>

                <input
                  id="comment-email"
                  name="email"
                  type="email"
                  required
                  placeholder="email@example.com"
                  className="
                    mt-3
                    w-full
                    border-0
                    border-b
                    border-black/20
                    bg-transparent
                    px-0
                    py-3
                    text-[15px]
                    text-[#292722]
                    outline-none
                    transition
                    placeholder:text-[#aaa397]
                    focus:border-[#292722]
                  "
                />
              </div>

            </div>


            {/* CONTENT */}
            <div className="mt-10">

              <label
                htmlFor="comment-content"
                className="block text-[10px] uppercase tracking-[0.25em] text-[#716b61]"
              >
                Lời nhắn
              </label>

              <textarea
                id="comment-content"
                name="content"
                required
                minLength={5}
                maxLength={2000}
                rows={5}
                placeholder="Viết vài dòng..."
                className="
                  mt-3
                  w-full
                  resize-y
                  border-0
                  border-b
                  border-black/20
                  bg-transparent
                  px-0
                  py-3
                  text-[15px]
                  leading-7
                  text-[#292722]
                  outline-none
                  transition
                  placeholder:text-[#aaa397]
                  focus:border-[#292722]
                "
              />

            </div>


            {/* SUBMIT */}
            <div className="mt-10 flex justify-end">

              <button
                type="submit"
                className="
                  group
                  inline-flex
                  items-center
                  gap-5
                  text-[11px]
                  uppercase
                  tracking-[0.25em]
                  text-[#292722]
                "
              >
                <span className="border-b border-[#292722] pb-1">
                  Gửi lời nhắn
                </span>

                <span
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#292722]
                    text-base
                    transition
                    duration-300
                    group-hover:bg-[#292722]
                    group-hover:text-[#f7f5f0]
                  "
                >
                  ↗
                </span>
              </button>

            </div>

          </div>
        </form>

      </div>


      {/* APPROVED COMMENTS */}
      <div className="mt-24 border-t border-black/10 pt-14 lg:mt-32 lg:pt-20">

        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.5fr]">

          {/* LEFT */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#9a8f7d]">
              Messages
            </p>

            <p className="mt-4 text-sm text-[#716b61]">
              {comments.length} bình luận
            </p>
          </div>


          {/* RIGHT */}
          <div>

            <h3 className="font-serif text-4xl font-normal tracking-[-0.02em] sm:text-5xl">
              Những lời đã để lại
            </h3>


            {/* EMPTY */}
            {comments.length === 0 ? (
              <div className="mt-12 border-t border-black/10 py-16">

                <p className="font-serif text-2xl text-[#716b61]">
                  Chưa có lời nhắn nào.
                </p>

                <p className="mt-3 text-sm leading-7 text-[#9a8f7d]">
                  Có thể bạn sẽ là người đầu tiên để lại một vài dòng.
                </p>

              </div>
            ) : (
              <div className="mt-12">

                {comments.map(
                  (comment, commentIndex) => {

                    const reactionList =
                      comment.comment_reactions ?? [];

                    return (
                      <article
                        key={comment.id}
                        className="
                          border-t
                          border-black/10
                          py-10
                          first:pt-0
                          first:border-t-0
                          sm:py-12
                        "
                      >

                        {/* COMMENT HEADER */}
                        <div className="flex items-start gap-4 sm:gap-6">

                          {/* INITIAL */}
                          <div
                            className="
                              flex
                              h-11
                              w-11
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              border
                              border-black/15
                              font-serif
                              text-lg
                              text-[#292722]
                            "
                          >
                            {comment.name
                              .trim()
                              .charAt(0)
                              .toUpperCase() || "?"}
                          </div>


                          <div className="min-w-0 flex-1">

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                              <div>

                                <p className="font-serif text-xl sm:text-2xl">
                                  {comment.name}
                                </p>

                                <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[#aaa397]">
                                  Message{" "}
                                  {String(
                                    commentIndex + 1
                                  ).padStart(2, "0")}
                                </p>

                              </div>

                              <time className="text-[11px] tracking-[0.05em] text-[#9a8f7d]">
                                {new Intl.DateTimeFormat(
                                  "vi-VN",
                                  {
                                    dateStyle:
                                      "medium",
                                    timeStyle:
                                      "short",
                                    timeZone:
                                      "Asia/Ho_Chi_Minh",
                                  }
                                ).format(
                                  new Date(
                                    comment.created_at
                                  )
                                )}
                              </time>

                            </div>


                            {/* COMMENT CONTENT */}
                            <p
                              className="
                                mt-6
                                whitespace-pre-wrap
                                break-words
                                font-serif
                                text-xl
                                font-normal
                                leading-[1.6]
                                text-[#47433d]
                                sm:text-2xl
                              "
                            >
                              {comment.content}
                            </p>


                            {/* REACTIONS */}
                            <div className="mt-7 flex flex-wrap items-center gap-2">

                              {reactionOptions.map(
                                (reaction) => {

                                  const count =
                                    reactionList.filter(
                                      (item) =>
                                        item.reaction_type ===
                                        reaction.type
                                    ).length;

                                  const isSelected =
                                    visitorId !==
                                      null &&
                                    reactionList.some(
                                      (item) =>
                                        item.reaction_type ===
                                          reaction.type &&
                                        item.visitor_id ===
                                          visitorId
                                    );

                                  return (
                                    <form
                                      key={
                                        reaction.type
                                      }
                                      action={
                                        toggleCommentReaction
                                      }
                                    >
                                      <input
                                        type="hidden"
                                        name="comment_id"
                                        value={
                                          comment.id
                                        }
                                      />

                                      <input
                                        type="hidden"
                                        name="album_slug"
                                        value={
                                          albumSlug
                                        }
                                      />

                                      <input
                                        type="hidden"
                                        name="reaction_type"
                                        value={
                                          reaction.type
                                        }
                                      />

                                      <button
                                        type="submit"
                                        title={
                                          reaction.label
                                        }
                                        aria-label={`${reaction.label}: ${count}`}
                                        className={[
                                          `
                                            inline-flex
                                            min-h-9
                                            items-center
                                            gap-1.5
                                            rounded-full
                                            border
                                            px-3
                                            py-1.5
                                            text-sm
                                            transition
                                            duration-200
                                            active:scale-95
                                          `,
                                          isSelected
                                            ? "border-[#292722] bg-[#292722] text-[#f7f5f0]"
                                            : "border-black/15 bg-transparent text-[#716b61] hover:border-[#292722] hover:text-[#292722]",
                                        ].join(
                                          " "
                                        )}
                                      >
                                        <span
                                          aria-hidden="true"
                                        >
                                          {
                                            reaction.icon
                                          }
                                        </span>

                                        {count > 0 && (
                                          <span className="text-[11px]">
                                            {count}
                                          </span>
                                        )}

                                      </button>
                                    </form>
                                  );
                                }
                              )}

                            </div>

                          </div>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}