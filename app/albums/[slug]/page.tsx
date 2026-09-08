/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CommentSection from "./comments/CommentSection";
import PhotoLightbox from "./PhotoLightbox";
import PublicHeader from "@/app/components/PublicHeader";
import PublicFooter from "@/app/components/PublicFooter";

type AlbumPageProps = {
  params: Promise<{
    slug: string;
  }>;

  searchParams: Promise<{
    comment_success?: string;
    comment_error?: string;
  }>;
};

type Photo = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  thumbnail_url: string | null;
  flickr_page_url: string | null;
  sort_order: number;
};

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

export default async function AlbumPage({
  params,
  searchParams,
}: AlbumPageProps) {
  const { slug } = await params;
  const query = await searchParams;

  const commentSuccess = query.comment_success === "1";
  const commentError = query.comment_error;

  const supabase = await createClient();

  const { data: album, error: albumError } = await supabase
    .from("albums")
    .select("id, title, slug, description, cover_url")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (albumError || !album) {
    console.error("Lỗi tải album:", albumError);
    notFound();
  }

  const { count: photoCount } = await supabase
    .from("photos")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("album_id", album.id)
    .eq("is_published", true);

  const { data: photosData, error: photosError } = await supabase
    .from("photos")
    .select(`
      id,
      title,
      description,
      image_url,
      thumbnail_url,
      flickr_page_url,
      sort_order
    `)
    .eq("album_id", album.id)
    .eq("is_published", true)
    .order("sort_order", {
      ascending: true,
    })
    .range(0, 29);

  if (photosError) {
    console.error("Lỗi tải ảnh:", photosError);
  }

  const { data: commentsData, error: commentsError } = await supabase
    .from("comments")
    .select(`
      id,
      name,
      content,
      created_at,
      comment_reactions (
        reaction_type,
        visitor_id
      )
    `)
    .eq("album_id", album.id)
    .eq("status", "approved")
    .order("created_at", {
      ascending: false,
    });

  if (commentsError) {
    console.error("Lỗi tải bình luận:", commentsError);
  }

  const photos: Photo[] = photosData ?? [];

  const comments = (commentsData ?? []).map((comment) => ({
    ...comment,
    comment_reactions: comment.comment_reactions ?? [],
  })) as Comment[];

  const coverImage =
    album.cover_url ||
    photos[0]?.thumbnail_url ||
    photos[0]?.image_url ||
    null;

  const cookieStore = await cookies();

  const visitorId =
    cookieStore.get("comment_visitor_id")?.value ?? null;

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#292722]">

      {/* HEADER */}
      <PublicHeader />


      {/* HERO COVER */}
      <section className="px-4 pt-[92px] sm:px-6 lg:px-10">

        <div className="relative mx-auto min-h-[68svh] max-w-[1600px] overflow-hidden bg-[#d8d2c7] sm:min-h-[74svh]">

          {coverImage ? (
            <img
              src={coverImage}
              alt={album.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[#d8d2c7]" />
          )}

          {/* overlay */}
          <div className="absolute inset-0 bg-black/15" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />


          {/* BACK BUTTON */}
          <div className="absolute left-5 top-5 z-10 sm:left-8 sm:top-8">

            <Link
              href="/#albums"
              className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-white"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/50 transition group-hover:bg-white group-hover:text-black">
                ←
              </span>

              <span className="hidden sm:inline">
                Quay lại
              </span>
            </Link>

          </div>


          {/* ALBUM TITLE */}
          <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-8 text-white sm:px-10 sm:pb-12 lg:px-14 lg:pb-14">

            <p className="mb-4 text-[10px] uppercase tracking-[0.45em] text-white/70 sm:text-xs">
              Photo Collection
            </p>

            <h1 className="max-w-5xl font-serif text-[clamp(3rem,8vw,7rem)] font-normal leading-[0.9] tracking-[-0.035em]">
              {album.title}
            </h1>

          </div>

        </div>

      </section>


      {/* ALBUM INTRO */}
      <section className="mx-auto max-w-[1440px] px-6 py-16 lg:px-10 lg:py-24">

        <div className="grid gap-10 border-b border-black/10 pb-16 lg:grid-cols-[0.7fr_1.5fr] lg:pb-24">

          {/* LEFT */}
          <div>

            <p className="text-[10px] uppercase tracking-[0.4em] text-[#9a8f7d]">
              Collection
            </p>

            <div className="mt-6 flex flex-col gap-2 text-sm text-[#716b61]">

              <p>
                {photoCount ?? photos.length} hình ảnh
              </p>

              <a
                href="#comments"
                className="w-fit border-b border-transparent transition hover:border-[#716b61]"
              >
                {comments.length} bình luận
              </a>

            </div>

          </div>


          {/* RIGHT */}
          <div>

            {album.description ? (
              <p className="max-w-4xl font-serif text-3xl font-normal leading-[1.35] tracking-[-0.015em] sm:text-4xl lg:text-5xl">
                {album.description}
              </p>
            ) : (
              <p className="max-w-4xl font-serif text-3xl font-normal leading-[1.35] text-[#716b61] sm:text-4xl lg:text-5xl">
                Một vài khoảnh khắc được lưu lại trong album này.
              </p>
            )}

          </div>

        </div>

      </section>


      {/* PHOTO COLLECTION */}
      <section className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-6 lg:px-10 lg:pb-36">

        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>

            <p className="text-[10px] uppercase tracking-[0.4em] text-[#9a8f7d]">
              Gallery
            </p>

            <h2 className="mt-3 font-serif text-4xl font-normal tracking-[-0.025em] sm:text-5xl">
              Những khoảnh khắc
            </h2>

          </div>

          <p className="text-xs uppercase tracking-[0.18em] text-[#9a8f7d]">
            Nhấn vào ảnh để xem toàn màn hình
          </p>

        </div>


        <PhotoLightbox
          initialPhotos={photos}
          albumId={album.id}
          total={photoCount ?? photos.length}
        />

      </section>


      {/* COMMENTS */}
      <section
        id="comments"
        className="scroll-mt-20 border-t border-black/10 bg-[#f1eee7]"
      >
        <CommentSection
          albumId={album.id}
          albumSlug={album.slug}
          comments={comments}
          commentSuccess={commentSuccess}
          commentError={commentError}
          visitorId={visitorId}
        />
      </section>


      {/* FOOTER */}
      <PublicFooter variant="dark" />

    </main>
  );
}