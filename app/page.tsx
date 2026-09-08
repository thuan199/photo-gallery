import Link from "next/link";
import PublicHeader from "./components/PublicHeader";
import PublicFooter from "./components/PublicFooter";
import { createClient } from "@/lib/supabase/server";

type Album = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
};

export default async function Home() {
  const supabase = await createClient();

  const { data: albums, error } = await supabase
    .from("albums")
    .select(`
      id,
      title,
      slug,
      description,
      cover_url
    `)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0] px-6 text-[#292722]">
        <div className="max-w-lg text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#9a8f7d]">
            Photo Journal
          </p>

          <h1 className="font-serif text-4xl">
            Không thể tải album
          </h1>

          <p className="mt-4 text-sm leading-7 text-red-500">
            {error.message}
          </p>
        </div>
      </main>
    );
  }

  const albumList = (albums ?? []) as Album[];
  const featuredAlbum = albumList[0];

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#292722]">

      {/* HEADER */}
      <PublicHeader active="home" />


      {/* HERO */}
      <section className="relative min-h-[100svh] overflow-hidden">

        {featuredAlbum?.cover_url ? (
          <img
            src={featuredAlbum.cover_url}
            alt={featuredAlbum.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[#d8d2c7]" />
        )}

        {/* lớp phủ nhẹ */}
        <div className="absolute inset-0 bg-black/15" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1440px] items-end px-6 pb-16 pt-32 text-white lg:px-10 lg:pb-20">

          <div className="max-w-4xl">

            <p className="mb-5 text-xs uppercase tracking-[0.45em] text-white/75">
              Personal Photo Journal
            </p>

            <h1 className="font-serif text-[clamp(3.8rem,9vw,8.5rem)] font-normal leading-[0.88] tracking-[-0.035em]">
              Những khoảnh khắc
              <br />
              mình muốn nhớ
            </h1>

            <div className="mt-8 flex flex-col gap-7 border-t border-white/35 pt-6 sm:flex-row sm:items-end sm:justify-between">

              <p className="max-w-md text-sm leading-7 text-white/80 sm:text-base">
                Những nơi đã đi qua, những người đã gặp
                và những khoảnh khắc bình thường nhưng đáng nhớ.
              </p>

              <a
                href="#albums"
                className="group flex w-fit items-center gap-4 text-xs uppercase tracking-[0.25em]"
              >
                Xem album

                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 transition duration-300 group-hover:bg-white group-hover:text-black">
                  ↓
                </span>
              </a>

            </div>
          </div>

        </div>
      </section>


      {/* INTRO */}
      <section className="mx-auto max-w-[1440px] px-6 py-24 lg:px-10 lg:py-36">

        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">

          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#9a8f7d]">
              About this place
            </p>
          </div>

          <div>
            <h2 className="max-w-4xl font-serif text-4xl font-normal leading-[1.15] tracking-[-0.02em] sm:text-5xl lg:text-6xl">
              Một góc nhỏ để lưu lại những điều
              mà thời gian có thể làm mình quên mất.
            </h2>

            <p className="mt-8 max-w-2xl text-[15px] leading-8 text-[#716b61]">
              Ở đây có ảnh cá nhân, những chuyến đi,
              những con đường miền quê và cả những khoảnh khắc
              rất đời thường.
            </p>
          </div>

        </div>
      </section>


      {/* ALBUMS */}
      <section
        id="albums"
        className="scroll-mt-20 pb-28 lg:pb-40"
      >

        <div className="mx-auto max-w-[1440px] px-6 lg:px-10">

          {/* TITLE */}
          <div className="mb-14 flex flex-col justify-between gap-7 border-t border-black/10 pt-8 md:flex-row md:items-end">

            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#9a8f7d]">
                Collections
              </p>

              <h2 className="mt-4 font-serif text-5xl font-normal tracking-[-0.025em] sm:text-6xl">
                Những album
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-[#716b61]">
              Một vài câu chuyện được kể lại bằng hình ảnh.
              Chọn một album để xem trọn bộ.
            </p>

          </div>


          {/* EMPTY */}
          {albumList.length === 0 ? (
            <div className="border-y border-black/10 py-28 text-center">

              <p className="font-serif text-3xl text-[#716b61]">
                Chưa có album nào.
              </p>

            </div>
          ) : (

            /* ALBUM GRID */
            <div className="grid gap-x-6 gap-y-14 md:grid-cols-2 lg:gap-x-8 lg:gap-y-20">

              {albumList.map((album, index) => {

                const isLarge =
                  index % 5 === 0;

                return (
                  <Link
                    key={album.id}
                    href={`/albums/${album.slug}`}
                    className={`group block ${
                      isLarge
                        ? "md:col-span-2"
                        : ""
                    }`}
                  >

                    {/* IMAGE */}
                    <div
                      className={`relative overflow-hidden bg-[#ded9d0] ${
                        isLarge
                          ? "aspect-[16/8]"
                          : "aspect-[4/5]"
                      }`}
                    >

                      {album.cover_url ? (
                        <img
                          src={album.cover_url}
                          alt={album.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.035]"
                        />
                      ) : (
                        <div className="h-full w-full bg-[#d8d2c7]" />
                      )}

                      <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/[0.08]" />

                      {/* arrow */}
                      <span className="absolute right-6 top-6 flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-[#f7f5f0] text-lg text-[#292722] opacity-0 shadow-sm transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        ↗
                      </span>

                    </div>


                    {/* INFO */}
                    <div className="mt-5 flex items-start justify-between gap-6">

                      <div>

                        <p className="mb-2 text-[10px] uppercase tracking-[0.35em] text-[#9a8f7d]">
                          Collection{" "}
                          {String(index + 1).padStart(2, "0")}
                        </p>

                        <h3 className="font-serif text-3xl font-normal tracking-[-0.02em] sm:text-4xl">
                          {album.title}
                        </h3>

                        {album.description && (
                          <p className="mt-3 max-w-xl text-sm leading-7 text-[#716b61]">
                            {album.description}
                          </p>
                        )}

                      </div>

                      <span className="mt-7 hidden text-xs uppercase tracking-[0.2em] text-[#716b61] sm:block">
                        View
                      </span>

                    </div>

                  </Link>
                );
              })}

            </div>
          )}

        </div>
      </section>


      {/* QUOTE */}
      <section className="bg-[#292722] px-6 py-28 text-[#f7f5f0] lg:py-36">

        <div className="mx-auto max-w-5xl text-center">

          <p className="mb-7 text-xs uppercase tracking-[0.45em] text-white/45">
            Memories
          </p>

          <blockquote className="font-serif text-4xl font-normal leading-[1.2] tracking-[-0.02em] sm:text-5xl lg:text-6xl">
            “Có những khoảnh khắc chỉ xảy ra một lần,
            nhưng một bức ảnh có thể giữ chúng lại rất lâu.”
          </blockquote>

        </div>

      </section>


      {/* FOOTER */}
      <PublicFooter />

    </main>
  );
}