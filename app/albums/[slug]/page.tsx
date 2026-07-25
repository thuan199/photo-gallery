import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PhotoGallery from "./PhotoGallery";

type AlbumPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type Photo = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  thumbnail_url: string | null;
  sort_order: number;
};

export default async function AlbumPage({
  params,
}: AlbumPageProps) {
  const supabase = await createClient();
  const { slug } = await params;

  const { data: album, error: albumError } = await supabase
    .from("albums")
    .select("id, title, description, slug")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (albumError || !album) {
    notFound();
  }

  const { data } = await supabase
    .from("photos")
    .select(`
      id,
      title,
      description,
      image_url,
      thumbnail_url,
      sort_order
    `)
    .eq("album_id", album.id)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const photos = (data ?? []) as Photo[];

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="text-sm text-neutral-400 hover:text-white"
        >
          ← Quay lại trang chủ
        </Link>

        <div className="mt-6">
          <h1 className="text-4xl font-bold">
            {album.title}
          </h1>

          {album.description && (
            <p className="mt-4 max-w-3xl text-neutral-400">
              {album.description}
            </p>
          )}
        </div>

        {photos.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-neutral-700 p-12 text-center text-neutral-400">
            Album này chưa có ảnh công khai.
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {photos.length === 0 ? (
              <div className="mt-12 rounded-2xl border border-dashed border-white/10 p-12 text-center text-white/40">
                Album này chưa có ảnh công khai.
              </div>
            ) : (
              <div className="mt-12">
                <PhotoGallery
                  photos={photos}
                  albumTitle={album.title}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}