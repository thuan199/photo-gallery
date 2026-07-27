/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CommentSection from "./comments/CommentSection";
import PhotoLightbox from "./PhotoLightbox";

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
    .select("id", { count: "exact", head: true })
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
    <main className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-white">
      <section className="relative overflow-hidden border-b border-black/10 dark:border-white/10">
        {coverImage && (
          <div className="absolute inset-0">
            <img
              src={coverImage}
              alt=""
              aria-hidden="true"
              className="h-full w-full scale-105 object-cover blur-sm"
            />

            <div className="absolute inset-0 bg-white/75 dark:bg-black/75" />

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-neutral-50 dark:via-black/30 dark:to-neutral-950" />
          </div>
        )}

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-medium text-neutral-700 backdrop-blur transition hover:bg-white dark:border-white/10 dark:bg-black/40 dark:text-neutral-300 dark:hover:bg-black/60"
          >
            <span aria-hidden="true">←</span>
            Quay lại trang chủ
          </Link>

          <div className="mt-10 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
              Album ảnh
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-5xl lg:text-6xl">
              {album.title}
            </h1>

            {album.description && (
              <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-600 dark:text-neutral-300 sm:text-lg">
                {album.description}
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm text-neutral-600 backdrop-blur dark:border-white/10 dark:bg-black/40 dark:text-neutral-300">
                {photoCount ?? photos.length} ảnh
              </span>

              <a
                href="#comments"
                className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm text-neutral-600 backdrop-blur transition hover:bg-white dark:border-white/10 dark:bg-black/40 dark:text-neutral-300 dark:hover:bg-black/60"
              >
                {comments.length} bình luận
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
              Bộ sưu tập
            </p>

            <h2 className="mt-2 text-2xl font-bold text-neutral-900 dark:text-white sm:text-3xl">
              Hình ảnh trong album
            </h2>
          </div>

          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Nhấn vào ảnh để xem toàn màn hình
          </p>
        </div>

        <PhotoLightbox initialPhotos={photos} albumId={album.id} total={photoCount ?? photos.length} />
      </section>

      <div
        id="comments"
        className="scroll-mt-24 border-t border-black/10 dark:border-white/10"
      >
        <CommentSection
          albumId={album.id}
          albumSlug={album.slug}
          comments={comments}
          commentSuccess={commentSuccess}
          commentError={commentError}
          visitorId={visitorId}
        />
      </div>
    </main>
  );
}