import { submitContact } from "./actions";
import PublicHeader from "@/app/components/PublicHeader";
import PublicFooter from "@/app/components/PublicFooter";

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
      return error
        ? decodeURIComponent(error)
        : null;
  }
}

export default async function ContactPage({
  searchParams,
}: ContactPageProps) {
  const params = await searchParams;

  const isSuccess =
    params.success === "1";

  const errorMessage =
    getErrorMessage(params.error);

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#292722]">

      {/* HEADER */}
      <PublicHeader active="contact" />


      {/* PAGE INTRO */}
      <section className="mx-auto max-w-[1440px] px-6 pb-20 pt-36 lg:px-10 lg:pb-28 lg:pt-44">

        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.5fr]">

          {/* LEFT */}
          <div>

            <p className="text-[10px] uppercase tracking-[0.45em] text-[#9a8f7d]">
              Contact
            </p>

          </div>


          {/* RIGHT */}
          <div>

            <h1 className="max-w-5xl font-serif text-[clamp(3.8rem,8vw,7.5rem)] font-normal leading-[0.92] tracking-[-0.04em]">
              Gửi mình
              <br />
              một lời nhắn.
            </h1>

            <p className="mt-8 max-w-2xl text-[15px] leading-8 text-[#716b61] sm:text-base">
              Nếu bạn muốn góp ý về website,
              hỏi về một album, một bức ảnh hoặc
              đơn giản là muốn để lại vài dòng,
              bạn có thể gửi cho mình ở đây.
            </p>

          </div>

        </div>

      </section>


      {/* CONTACT CONTENT */}
      <section className="mx-auto max-w-[1440px] px-6 pb-28 lg:px-10 lg:pb-40">

        <div className="border-t border-black/10 pt-12 lg:pt-16">

          <div className="grid gap-16 lg:grid-cols-[0.7fr_1.5fr]">

            {/* LEFT INFORMATION */}
            <aside>

              <p className="text-[10px] uppercase tracking-[0.4em] text-[#9a8f7d]">
                A little note
              </p>

              <div className="mt-8 max-w-sm">

                <h2 className="font-serif text-3xl leading-[1.2]">
                  Mình luôn vui khi nhận được
                  những lời nhắn từ người ghé xem.
                </h2>

                <p className="mt-6 text-sm leading-7 text-[#716b61]">
                  Nội dung gửi từ biểu mẫu sẽ được
                  lưu riêng trong khu vực quản trị
                  của website.
                </p>

              </div>


              {/* PRIVACY */}
              <div className="mt-14 border-t border-black/10 pt-7">

                <p className="text-[10px] uppercase tracking-[0.3em] text-[#9a8f7d]">
                  Privacy
                </p>

                <p className="mt-4 max-w-xs text-sm leading-7 text-[#716b61]">
                  Email của bạn chỉ được dùng để
                  mình có thể phản hồi khi cần và
                  sẽ không hiển thị công khai trên
                  website.
                </p>

              </div>

            </aside>


            {/* FORM */}
            <div className="max-w-4xl">

              <div className="mb-12">

                <p className="text-[10px] uppercase tracking-[0.4em] text-[#9a8f7d]">
                  Send a message
                </p>

                <h2 className="mt-4 font-serif text-4xl font-normal tracking-[-0.025em] sm:text-5xl">
                  Bạn muốn nói gì?
                </h2>

              </div>


              {/* SUCCESS */}
              {isSuccess && (
                <div className="mb-12 border-l-2 border-[#6e8065] pl-5">

                  <p className="font-serif text-xl text-[#56634f]">
                    Đã gửi liên hệ thành công.
                  </p>

                  <p className="mt-2 text-sm leading-7 text-[#6d7867]">
                    Cảm ơn bạn. Mình sẽ xem nội dung
                    trong thời gian sớm nhất.
                  </p>

                </div>
              )}


              {/* ERROR */}
              {errorMessage && (
                <div className="mb-12 border-l-2 border-[#a85f56] pl-5">

                  <p className="font-serif text-xl text-[#8b4e47]">
                    Không thể gửi liên hệ.
                  </p>

                  <p className="mt-2 text-sm leading-7 text-[#8b4e47]">
                    {errorMessage}
                  </p>

                </div>
              )}


              <form action={submitContact}>

                {/* NAME + EMAIL */}
                <div className="grid gap-10 sm:grid-cols-2">

                  {/* NAME */}
                  <div>

                    <label
                      htmlFor="name"
                      className="block text-[10px] uppercase tracking-[0.28em] text-[#716b61]"
                    >
                      Họ tên *
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      minLength={2}
                      maxLength={100}
                      autoComplete="name"
                      placeholder="Tên của bạn"
                      className="
                        mt-3
                        w-full
                        border-0
                        border-b
                        border-black/20
                        bg-transparent
                        px-0
                        py-4
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
                      htmlFor="email"
                      className="block text-[10px] uppercase tracking-[0.28em] text-[#716b61]"
                    >
                      Email *
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      maxLength={200}
                      autoComplete="email"
                      placeholder="email@example.com"
                      className="
                        mt-3
                        w-full
                        border-0
                        border-b
                        border-black/20
                        bg-transparent
                        px-0
                        py-4
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


                {/* SUBJECT */}
                <div className="mt-10">

                  <label
                    htmlFor="subject"
                    className="block text-[10px] uppercase tracking-[0.28em] text-[#716b61]"
                  >
                    Tiêu đề
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    maxLength={200}
                    placeholder="Bạn muốn trao đổi về điều gì?"
                    className="
                      mt-3
                      w-full
                      border-0
                      border-b
                      border-black/20
                      bg-transparent
                      px-0
                      py-4
                      text-[15px]
                      text-[#292722]
                      outline-none
                      transition
                      placeholder:text-[#aaa397]
                      focus:border-[#292722]
                    "
                  />

                </div>


                {/* MESSAGE */}
                <div className="mt-10">

                  <label
                    htmlFor="message"
                    className="block text-[10px] uppercase tracking-[0.28em] text-[#716b61]"
                  >
                    Nội dung *
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    required
                    minLength={10}
                    maxLength={3000}
                    rows={7}
                    placeholder="Viết lời nhắn của bạn..."
                    className="
                      mt-3
                      w-full
                      resize-y
                      border-0
                      border-b
                      border-black/20
                      bg-transparent
                      px-0
                      py-4
                      text-[15px]
                      leading-8
                      text-[#292722]
                      outline-none
                      transition
                      placeholder:text-[#aaa397]
                      focus:border-[#292722]
                    "
                  />

                  <p className="mt-3 text-[11px] leading-6 text-[#9a8f7d]">
                    Nội dung tối thiểu 10 ký tự.
                  </p>

                </div>


                {/* SUBMIT */}
                <div className="mt-12 flex justify-end">

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
                      Gửi liên hệ
                    </span>

                    <span
                      className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[#292722]
                        text-lg
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

              </form>

            </div>

          </div>

        </div>

      </section>


      {/* BOTTOM QUOTE */}
      <section className="bg-[#292722] px-6 py-24 text-[#f7f5f0] lg:py-32">

        <div className="mx-auto max-w-5xl text-center">

          <p className="text-[10px] uppercase tracking-[0.45em] text-white/40">
            Thank you for visiting
          </p>

          <p className="mx-auto mt-7 max-w-4xl font-serif text-4xl leading-[1.25] sm:text-5xl">
            Cảm ơn vì đã dành một chút thời gian
            để ghé qua những ký ức của mình.
          </p>

        </div>

      </section>


      {/* FOOTER */}
      <PublicFooter />

    </main>
  );
}