"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
  useTransition,
} from "react";

import {
  deletePhoto,
  setAlbumCover,
  updatePhotoOrder,
} from "./actions";

export type AdminPhoto = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  thumbnail_url: string | null;
  flickr_page_url: string | null;
  sort_order: number;
  is_published: boolean;
};

type PhotoManagerProps = {
  albumId: string;
  photos: AdminPhoto[];
  coverUrl: string | null;
};

type MessageType = "success" | "error" | "";

export default function PhotoManager({
  albumId,
  photos,
  coverUrl,
}: PhotoManagerProps) {
  const [items, setItems] = useState<AdminPhoto[]>(photos);
  const [dragId, setDragId] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<MessageType>("");

  const [selectedPhoto, setSelectedPhoto] =
    useState<AdminPhoto | null>(null);

  const [zoom, setZoom] = useState(1);

  const [coverPhotoId, setCoverPhotoId] = useState<
    string | null
  >(() => {
    const coverPhoto = photos.find(
      (photo) => photo.image_url === coverUrl
    );

    return coverPhoto?.id ?? null;
  });

  const [pending, startTransition] = useTransition();

  /*
   * Tự động tắt thông báo sau 4 giây.
   */
  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [message]);

  /*
   * Khi mở ảnh:
   * - Nhấn Escape để đóng.
   * - Khóa cuộn trang phía sau.
   */
  useEffect(() => {
    if (!selectedPhoto) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closePhoto();
      }

      if (event.key === "+" || event.key === "=") {
        zoomIn();
      }

      if (event.key === "-") {
        zoomOut();
      }

      if (event.key === "0") {
        resetZoom();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedPhoto]);

  function showMessage(
    content: string,
    type: Exclude<MessageType, "">
  ) {
    setMessage(content);
    setMessageType(type);
  }

  function openPhoto(photo: AdminPhoto) {
    setSelectedPhoto(photo);
    setZoom(1);
  }

  function closePhoto() {
    setSelectedPhoto(null);
    setZoom(1);
  }

  function zoomIn() {
    setZoom((currentZoom) =>
      Math.min(4, currentZoom + 0.25)
    );
  }

  function zoomOut() {
    setZoom((currentZoom) =>
      Math.max(0.5, currentZoom - 0.25)
    );
  }

  function resetZoom() {
    setZoom(1);
  }

  function handleWheel(
    event: React.WheelEvent<HTMLDivElement>
  ) {
    event.preventDefault();

    if (event.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  }

  function dropOn(targetId: string) {
    if (!dragId || dragId === targetId || pending) {
      return;
    }

    const previousItems = [...items];
    const nextItems = [...items];

    const fromIndex = nextItems.findIndex(
      (item) => item.id === dragId
    );

    const toIndex = nextItems.findIndex(
      (item) => item.id === targetId
    );

    if (fromIndex === -1 || toIndex === -1) {
      setDragId(null);
      return;
    }

    const [movedItem] = nextItems.splice(fromIndex, 1);
    nextItems.splice(toIndex, 0, movedItem);

    setItems(nextItems);
    setDragId(null);

    startTransition(async () => {
      try {
        await updatePhotoOrder(
          albumId,
          nextItems.map((item) => item.id)
        );

        showMessage(
          "Đã lưu thứ tự ảnh thành công.",
          "success"
        );
      } catch (error) {
        setItems(previousItems);

        showMessage(
          error instanceof Error
            ? error.message
            : "Không thể lưu thứ tự ảnh.",
          "error"
        );
      }
    });
  }

  function chooseCover(photo: AdminPhoto) {
    if (coverPhotoId === photo.id || pending) {
      return;
    }

    const previousCoverPhotoId = coverPhotoId;

    // Cập nhật giao diện ngay lập tức.
    setCoverPhotoId(photo.id);

    startTransition(async () => {
      try {
        const formData = new FormData();

        formData.set("album_id", albumId);
        formData.set("photo_id", photo.id);
        formData.set("image_url", photo.image_url);

        await setAlbumCover(formData);

        showMessage(
          `Đã đặt "${
            photo.title || "ảnh này"
          }" làm ảnh bìa.`,
          "success"
        );
      } catch (error) {
        setCoverPhotoId(previousCoverPhotoId);

        showMessage(
          error instanceof Error
            ? error.message
            : "Không thể đặt ảnh bìa.",
          "error"
        );
      }
    });
  }

  function removePhoto(photo: AdminPhoto) {
    if (pending) return;

    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa ảnh "${
        photo.title || "Chưa có tiêu đề"
      }" không?`
    );

    if (!confirmed) return;

    const previousItems = [...items];
    const previousCoverPhotoId = coverPhotoId;

    // Xóa khỏi giao diện trước.
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== photo.id
      )
    );

    if (coverPhotoId === photo.id) {
      setCoverPhotoId(null);
    }

    startTransition(async () => {
      try {
        const formData = new FormData();

        formData.set("photo_id", photo.id);
        formData.set("album_id", albumId);

        await deletePhoto(formData);

        showMessage(
          "Đã xóa ảnh thành công.",
          "success"
        );
      } catch (error) {
        // Khôi phục lại nếu xóa thất bại.
        setItems(previousItems);
        setCoverPhotoId(previousCoverPhotoId);

        showMessage(
          error instanceof Error
            ? error.message
            : "Không thể xóa ảnh.",
          "error"
        );
      }
    });
  }

  return (
    <div>
      {/* Hướng dẫn và trạng thái xử lý */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-neutral-500">
          Kéo thẻ ảnh để sắp xếp. Thứ tự được lưu tự
          động. Bấm vào ảnh để xem lớn.
        </p>

        {pending && (
          <span className="text-sm font-medium text-amber-500">
            Đang xử lý...
          </span>
        )}
      </div>

      {/* Thông báo thành công hoặc lỗi */}
      {message && (
        <div
          role={
            messageType === "error"
              ? "alert"
              : "status"
          }
          className={`
            mb-5 flex items-center justify-between gap-3
            rounded-xl border px-4 py-3 text-sm
            ${
              messageType === "error"
                ? `
                  border-rose-500/40
                  bg-rose-500/10
                  text-rose-600
                  dark:text-rose-300
                `
                : `
                  border-emerald-500/40
                  bg-emerald-500/10
                  text-emerald-700
                  dark:text-emerald-300
                `
            }
          `}
        >
          <span>
            {messageType === "error" ? "⚠️" : "✅"}{" "}
            {message}
          </span>

          <button
            type="button"
            onClick={() => {
              setMessage("");
              setMessageType("");
            }}
            className="
              cursor-pointer rounded-md px-2 py-1
              text-lg leading-none opacity-70
              transition
              hover:bg-black/5 hover:opacity-100
              dark:hover:bg-white/10
            "
            aria-label="Đóng thông báo"
          >
            ×
          </button>
        </div>
      )}

      {/* Album chưa có ảnh */}
      {items.length === 0 ? (
        <div
          className="
            rounded-3xl border border-dashed
            border-neutral-300 p-12
            text-center text-neutral-500
            dark:border-neutral-700
          "
        >
          Album chưa có ảnh.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((photo, index) => {
            const isCover =
              coverPhotoId === photo.id;

            return (
              <article
                key={photo.id}
                draggable={!pending}
                onDragStart={() =>
                  setDragId(photo.id)
                }
                onDragEnd={() => setDragId(null)}
                onDragOver={(event) =>
                  event.preventDefault()
                }
                onDrop={() => dropOn(photo.id)}
                className={`
                  overflow-hidden rounded-3xl
                  border bg-white shadow-sm
                  transition-all duration-200
                  dark:bg-neutral-900
                  ${
                    isCover
                      ? `
                        border-amber-400
                        ring-2 ring-amber-400/30
                        dark:border-amber-400
                      `
                      : `
                        border-neutral-200
                        hover:border-neutral-400
                        hover:shadow-md
                        dark:border-white/10
                        dark:hover:border-white/30
                      `
                  }
                  ${
                    dragId === photo.id
                      ? "scale-[0.98] opacity-40"
                      : ""
                  }
                `}
              >
                {/* Hình ảnh */}
                <div
                  className="
                    relative aspect-[4/3]
                    overflow-hidden
                    bg-neutral-200
                    dark:bg-neutral-800
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      openPhoto(photo)
                    }
                    className="
                      group relative block
                      h-full w-full
                      cursor-zoom-in
                      overflow-hidden
                    "
                    aria-label={`Xem lớn ${
                      photo.title || "ảnh album"
                    }`}
                  >
                    <img
                      src={photo.image_url}
                      alt={
                        photo.title || "Ảnh album"
                      }
                      loading="lazy"
                      draggable={false}
                      className="
                        h-full w-full object-cover
                        transition-transform
                        duration-300
                        group-hover:scale-105
                      "
                    />

                    <span
                      className="
                        pointer-events-none
                        absolute bottom-3 right-3
                        rounded-full bg-black/65
                        px-3 py-1.5
                        text-xs font-medium text-white
                        opacity-0 backdrop-blur-sm
                        transition-opacity duration-200
                        group-hover:opacity-100
                      "
                    >
                      🔍 Xem ảnh
                    </span>
                  </button>

                  {/* Số thứ tự */}
                  <span
                    className="
                      pointer-events-none
                      absolute left-3 top-3
                      rounded-full bg-black/60
                      px-3 py-1 text-xs text-white
                      backdrop-blur-sm
                    "
                  >
                    ↕ {index + 1}
                  </span>

                  {/* Trạng thái công khai */}
                  <span
                    className="
                      pointer-events-none
                      absolute right-3 top-3
                      rounded-full bg-black/60
                      px-3 py-1 text-xs text-white
                      backdrop-blur-sm
                    "
                  >
                    {photo.is_published
                      ? "Công khai"
                      : "Ẩn"}
                  </span>

                  {/* Nhãn ảnh bìa */}
                  {isCover && (
                    <div
                      className="
                        pointer-events-none
                        absolute bottom-3 left-1/2
                        -translate-x-1/2
                        whitespace-nowrap
                        rounded-full
                        border border-amber-300/60
                        bg-amber-500/95
                        px-4 py-1.5
                        text-xs font-bold
                        text-neutral-950
                        shadow-lg backdrop-blur-sm
                      "
                    >
                      ⭐ Ảnh bìa
                    </div>
                  )}
                </div>

                {/* Nội dung thẻ */}
                <div className="p-5">
                  <h3 className="truncate text-lg font-bold">
                    {photo.title ||
                      "Chưa có tiêu đề"}
                  </h3>

                  <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-3">
                    {/* Chỉnh sửa */}
                    <Link
                      href={`/admin/albums/${albumId}/photos/${photo.id}/edit`}
                      className="
                        inline-flex cursor-pointer
                        items-center justify-center gap-2
                        rounded-lg
                        border border-amber-400/70
                        bg-amber-50
                        px-3 py-2
                        text-sm font-medium
                        text-amber-700
                        shadow-sm
                        transition-all duration-200
                        hover:-translate-y-0.5
                        hover:border-amber-500
                        hover:bg-amber-500
                        hover:text-white
                        hover:shadow-md
                        active:translate-y-0
                        active:scale-95
                        dark:border-amber-500/60
                        dark:bg-amber-500/10
                        dark:text-amber-300
                        dark:hover:bg-amber-500
                        dark:hover:text-neutral-950
                      "
                    >
                      <span aria-hidden="true">
                        ✏️
                      </span>
                      Chỉnh sửa
                    </Link>

                    {/* Xóa ảnh */}
                    <button
                      type="button"
                      onClick={() =>
                        removePhoto(photo)
                      }
                      disabled={pending}
                      className="
                        inline-flex cursor-pointer
                        items-center justify-center gap-2
                        rounded-lg
                        border border-rose-400/50
                        bg-rose-500/5
                        px-3 py-2
                        text-sm font-medium
                        text-rose-500
                        transition-all duration-200
                        hover:-translate-y-0.5
                        hover:border-rose-400/80
                        hover:bg-rose-500/15
                        hover:text-rose-600
                        hover:shadow-md
                        active:translate-y-0
                        active:scale-95
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        dark:text-rose-300
                        dark:hover:text-rose-200
                      "
                    >
                      <span aria-hidden="true">
                        🗑️
                      </span>
                      Xóa ảnh
                    </button>

                    {/* Đặt ảnh bìa */}
                    <button
                      type="button"
                      onClick={() =>
                        chooseCover(photo)
                      }
                      disabled={isCover || pending}
                      className="
                        inline-flex cursor-pointer
                        items-center justify-center gap-2
                        rounded-lg
                        border border-amber-400/70
                        bg-amber-50
                        px-3 py-2
                        text-sm font-medium
                        text-amber-700
                        shadow-sm
                        transition-all duration-200
                        hover:-translate-y-0.5
                        hover:border-amber-500
                        hover:bg-amber-500
                        hover:text-white
                        hover:shadow-md
                        active:translate-y-0
                        active:scale-95
                        disabled:cursor-default
                        disabled:border-amber-400/30
                        disabled:bg-amber-500/10
                        disabled:text-amber-600/60
                        disabled:shadow-none
                        disabled:hover:translate-y-0
                        dark:border-amber-500/60
                        dark:bg-amber-500/10
                        dark:text-amber-300
                        dark:hover:bg-amber-500
                        dark:hover:text-neutral-950
                        dark:disabled:text-amber-300/50
                      "
                    >
                      <span aria-hidden="true">
                        ⭐
                      </span>

                      {isCover
                        ? "Đang là ảnh bìa"
                        : "Đặt ảnh bìa"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/*
       * Cửa sổ xem ảnh lớn.
       * Phải nằm ngoài items.map() để không bị thẻ article che.
       */}
      {selectedPhoto && (
        <div
          className="
            fixed inset-0 z-[9999]
            flex items-center justify-center
            bg-black/95 p-4
            backdrop-blur-sm
          "
          onClick={closePhoto}
          onWheel={handleWheel}
          role="dialog"
          aria-modal="true"
          aria-label="Xem ảnh lớn"
        >
          {/* Tiêu đề ảnh */}
          <div
            className="
              fixed left-5 top-5
              z-[10010]
              max-w-[60vw]
              truncate rounded-full
              bg-black/50 px-4 py-2
              text-sm font-medium text-white
              backdrop-blur-sm
            "
          >
            {selectedPhoto.title || "Ảnh album"}
          </div>

          {/* Nút đóng */}
          <button
            type="button"
            onClick={closePhoto}
            className="
              fixed right-5 top-5
              z-[10010]
              flex h-12 w-12
              cursor-pointer
              items-center justify-center
              rounded-full
              bg-white/15
              text-3xl text-white
              transition-all duration-200
              hover:scale-110
              hover:bg-white/25
              active:scale-95
            "
            aria-label="Đóng ảnh"
          >
            ×
          </button>

          {/* Khu vực chứa ảnh */}
          <div
            className="
              flex h-full w-full
              items-center justify-center
              overflow-auto
              px-4 pb-24 pt-16
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <img
              src={selectedPhoto.image_url}
              alt={
                selectedPhoto.title ||
                "Ảnh album"
              }
              draggable={false}
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "center center",
              }}
              className="
                max-h-[78vh]
                max-w-[88vw]
                select-none object-contain
                shadow-2xl
                transition-transform
                duration-200
              "
            />
          </div>

          {/* Thanh zoom */}
          <div
            className="
              fixed bottom-6 left-1/2
              z-[10010]
              flex -translate-x-1/2
              items-center gap-2
              rounded-full
              border border-white/15
              bg-black/70
              px-3 py-2
              text-white shadow-xl
              backdrop-blur
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              onClick={zoomOut}
              disabled={zoom <= 0.5}
              className="
                flex h-10 w-10
                cursor-pointer
                items-center justify-center
                rounded-full text-2xl
                transition
                hover:bg-white/15
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
              aria-label="Thu nhỏ ảnh"
            >
              −
            </button>

            <button
              type="button"
              onClick={resetZoom}
              className="
                min-w-20 cursor-pointer
                rounded-full px-3 py-2
                text-sm font-medium
                transition
                hover:bg-white/15
              "
              title="Đưa ảnh về kích thước ban đầu"
            >
              {Math.round(zoom * 100)}%
            </button>

            <button
              type="button"
              onClick={zoomIn}
              disabled={zoom >= 4}
              className="
                flex h-10 w-10
                cursor-pointer
                items-center justify-center
                rounded-full text-2xl
                transition
                hover:bg-white/15
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
              aria-label="Phóng to ảnh"
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
}