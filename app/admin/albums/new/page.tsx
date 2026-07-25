import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAlbum } from "../actions";
import { requireAdmin } from "@/lib/auth/admin";

type NewAlbumPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

function getErrorMessage(error?: string) {
  switch (error) {
    case "ten-album-phai-co-it-nhat-2-ky-tu":
      return "Tên album phải có ít nhất 2 ký tự.";

    case "slug-khong-hop-le":
      return "Slug không hợp lệ.";

    case "slug-da-ton-tai":
      return "Slug này đã được sử dụng. Hãy nhập slug khác.";

    default:
      return error
        ? decodeURIComponent(error)
        : null;
  }
}

export default async function NewAlbumPage({
  searchParams,
}: NewAlbumPageProps) {
  const { supabase } = await requireAdmin();

  const params = await searchParams;
  const errorMessage = getErrorMessage(params.error);

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/admin/albums"
          className="text-sm text-neutral-400 transition hover:text-white"
        >
          ← Quay lại danh sách album
        </Link>

        <h1 className="mt-4 text-4xl font-bold">
          Tạo album mới
        </h1>

        <p className="mt-2 text-neutral-400">
          Nhập thông tin cơ bản cho album ảnh.
        </p>

        {errorMessage && (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            {errorMessage}
          </div>
        )}

        <form
          action={createAlbum}
          className="mt-8 space-y-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium"
            >
              Tên album <span className="text-red-400">*</span>
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              minLength={2}
              maxLength={200}
              placeholder="Ví dụ: Đà Lạt 2026"
              className="mt-2 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 outline-none transition focus:border-white"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium"
            >
              Slug
            </label>

            <input
              id="slug"
              name="slug"
              type="text"
              maxLength={200}
              placeholder="Để trống sẽ tự tạo từ tên album"
              className="mt-2 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 outline-none transition focus:border-white"
            />

            <p className="mt-2 text-xs text-neutral-500">
              Ví dụ: da-lat-2026
            </p>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium"
            >
              Mô tả
            </label>

            <textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Mô tả ngắn về album..."
              className="mt-2 w-full resize-y rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 outline-none transition focus:border-white"
            />
          </div>

          <div>
            <label
              htmlFor="cover_url"
              className="block text-sm font-medium"
            >
              Link ảnh bìa
            </label>

            <input
              id="cover_url"
              name="cover_url"
              type="url"
              placeholder="https://live.staticflickr.com/..."
              className="mt-2 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 outline-none transition focus:border-white"
            />

            <p className="mt-2 text-xs text-neutral-500">
              Hiện tại có thể để trống. Sau này mình sẽ làm chức
              năng lấy ảnh từ Flickr.
            </p>
          </div>

          <div>
            <label
              htmlFor="sort_order"
              className="block text-sm font-medium"
            >
              Thứ tự hiển thị
            </label>

            <input
              id="sort_order"
              name="sort_order"
              type="number"
              min={0}
              defaultValue={0}
              className="mt-2 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 outline-none transition focus:border-white"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              name="is_published"
              type="checkbox"
              defaultChecked
              className="h-5 w-5 accent-white"
            />

            <span>
              <span className="block font-medium">
                Công khai album
              </span>

              <span className="block text-sm text-neutral-500">
                Album sẽ xuất hiện trên trang chủ.
              </span>
            </span>
          </label>

          <div className="flex flex-col-reverse gap-3 border-t border-neutral-800 pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/admin/albums"
              className="rounded-lg border border-neutral-700 px-5 py-3 text-center font-medium transition hover:bg-neutral-800"
            >
              Hủy
            </Link>

            <button
              type="submit"
              className="rounded-lg bg-white px-5 py-3 font-semibold text-black transition hover:bg-neutral-200"
            >
              Lưu album
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}