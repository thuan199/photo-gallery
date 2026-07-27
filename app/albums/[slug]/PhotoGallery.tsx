"use client";

import { useEffect, useState } from "react";

type Photo = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  thumbnail_url: string | null;
};

type PhotoGalleryProps = {
  photos: Photo[];
  albumTitle: string;
};

export default function PhotoGallery({
  photos,
  albumTitle,
}: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    null
  );

  const [zoom, setZoom] = useState(1);

  const selectedPhoto =
    selectedIndex !== null ? photos[selectedIndex] : null;

  function openLightbox(index: number) {
    setSelectedIndex(index);
    setZoom(1);
  }

  function closeLightbox() {
    setSelectedIndex(null);
    setZoom(1);
  }

  function showPrevious() {
    if (selectedIndex === null || photos.length === 0) {
      return;
    }

    setSelectedIndex((currentIndex) => {
      if (currentIndex === null) return null;

      return currentIndex === 0
        ? photos.length - 1
        : currentIndex - 1;
    });

    setZoom(1);
  }

  function showNext() {
    if (selectedIndex === null || photos.length === 0) {
      return;
    }

    setSelectedIndex((currentIndex) => {
      if (currentIndex === null) return null;

      return currentIndex === photos.length - 1
        ? 0
        : currentIndex + 1;
    });

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
    event.stopPropagation();

    if (event.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  }

  useEffect(() => {
    if (selectedIndex === null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
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
    };
  }, [selectedIndex, photos.length]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedIndex]);

  if (photos.length === 0) {
    return (
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
    );
  }

  return (
    <>
      <section className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => openLightbox(index)}
            className="
              group mb-5 block w-full
              break-inside-avoid overflow-hidden
              rounded-2xl bg-neutral-900
              text-left
            "
            aria-label={`Xem ảnh ${
              photo.title || albumTitle
            }`}
          >
            <div className="relative overflow-hidden">
              <img
                src={photo.image_url}
                alt={photo.title || albumTitle}
                loading="lazy"
                draggable={false}
                className="
                  h-auto w-full
                  transition duration-500
                  group-hover:scale-105
                "
              />

              <div
                className="
                  absolute inset-0
                  bg-black/0
                  transition duration-300
                  group-hover:bg-black/30
                "
              />

              <div
                className="
                  absolute inset-x-0 bottom-0
                  translate-y-full
                  bg-gradient-to-t
                  from-black/90 to-transparent
                  p-5
                  transition duration-300
                  group-hover:translate-y-0
                "
              >
                <p className="font-medium text-white">
                  {photo.title || "Xem ảnh"}
                </p>

                {photo.description && (
                  <p
                    className="
                      mt-1 line-clamp-2
                      text-sm text-white/60
                    "
                  >
                    {photo.description}
                  </p>
                )}
              </div>

              <span
                className="
                  pointer-events-none
                  absolute right-3 top-3
                  rounded-full
                  bg-black/60
                  px-3 py-1.5
                  text-xs text-white
                  opacity-0
                  backdrop-blur-sm
                  transition-opacity
                  group-hover:opacity-100
                "
              >
                🔍 Xem ảnh
              </span>
            </div>
          </button>
        ))}
      </section>

      {selectedPhoto && selectedIndex !== null && (
        <div
          className="
            fixed inset-0 z-[9999]
            flex items-center justify-center
            bg-black/95
            backdrop-blur-sm
          "
          onClick={closeLightbox}
          onWheel={handleWheel}
          role="dialog"
          aria-modal="true"
          aria-label="Xem ảnh lớn"
        >
          <div
            className="
              fixed left-5 top-5 z-[10010]
              max-w-[60vw]
              truncate rounded-full
              bg-black/50 px-4 py-2
              text-sm font-medium text-white
              backdrop-blur-sm
            "
          >
            {selectedPhoto.title || albumTitle}
          </div>

          <button
            type="button"
            onClick={closeLightbox}
            className="
              fixed right-5 top-5 z-[10010]
              flex h-12 w-12
              cursor-pointer
              items-center justify-center
              rounded-full
              border border-white/20
              bg-black/50
              text-3xl text-white
              backdrop-blur-md
              transition
              hover:scale-110
              hover:bg-white
              hover:text-black
            "
            aria-label="Đóng"
          >
            ×
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrevious();
                }}
                className="
                  fixed left-4 top-1/2
                  z-[10010]
                  flex h-14 w-14
                  -translate-y-1/2
                  cursor-pointer
                  items-center justify-center
                  rounded-full
                  border border-white/20
                  bg-black/50
                  text-4xl text-white
                  backdrop-blur-md
                  transition
                  hover:scale-110
                  hover:bg-white
                  hover:text-black
                  md:left-8
                "
                aria-label="Ảnh trước"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                className="
                  fixed right-4 top-1/2
                  z-[10010]
                  flex h-14 w-14
                  -translate-y-1/2
                  cursor-pointer
                  items-center justify-center
                  rounded-full
                  border border-white/20
                  bg-black/50
                  text-4xl text-white
                  backdrop-blur-md
                  transition
                  hover:scale-110
                  hover:bg-white
                  hover:text-black
                  md:right-8
                "
                aria-label="Ảnh tiếp theo"
              >
                ›
              </button>
            </>
          )}

          <div
            className="
              flex h-full w-full
              items-center justify-center
              overflow-auto
              px-6 pb-32 pt-20
              md:px-28
            "
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={selectedPhoto.image_url}
              alt={selectedPhoto.title || albumTitle}
              draggable={false}
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "center center",
              }}
              className="
                max-h-[75vh]
                max-w-[85vw]
                select-none
                object-contain
                shadow-2xl
                transition-transform
                duration-200
              "
            />
          </div>

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
              text-white
              shadow-xl
              backdrop-blur-md
            "
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={zoomOut}
              disabled={zoom <= 0.5}
              className="
                flex h-10 w-10
                cursor-pointer
                items-center justify-center
                rounded-full
                text-2xl
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
                rounded-full
                px-3 py-2
                text-sm font-medium
                transition
                hover:bg-white/15
              "
              title="Đưa ảnh về 100%"
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
                rounded-full
                text-2xl
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

          <div
            className="
              fixed bottom-20 left-1/2
              z-[10010]
              w-full max-w-3xl
              -translate-x-1/2
              px-5 text-center
              pointer-events-none
            "
          >
            {selectedPhoto.description && (
              <p className="text-sm leading-6 text-white/60">
                {selectedPhoto.description}
              </p>
            )}

            <p className="mt-2 text-xs text-white/40">
              {selectedIndex + 1} / {photos.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}