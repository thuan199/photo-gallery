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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectedPhoto =
    selectedIndex !== null ? photos[selectedIndex] : null;

  function closeLightbox() {
    setSelectedIndex(null);
  }

  function showPrevious() {
    if (selectedIndex === null) return;

    setSelectedIndex(
      selectedIndex === 0
        ? photos.length - 1
        : selectedIndex - 1
    );
  }

  function showNext() {
    if (selectedIndex === null) return;

    setSelectedIndex(
      selectedIndex === photos.length - 1
        ? 0
        : selectedIndex + 1
    );
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (selectedIndex === null) return;

      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  return (
    <>
      <section className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className="group mb-5 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-neutral-900 text-left"
          >
            <div className="relative overflow-hidden">
              <img
                src={photo.thumbnail_url || photo.image_url}
                alt={photo.title || albumTitle}
                loading="lazy"
                className="h-auto w-full transition duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/30" />

              <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/90 to-transparent p-5 transition duration-300 group-hover:translate-y-0">
                <p className="font-medium">
                  {photo.title || "Xem ảnh"}
                </p>

                {photo.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-white/60">
                    {photo.description}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </section>

      {selectedPhoto && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-5 top-5 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/40 text-2xl text-white backdrop-blur-md transition hover:bg-white hover:text-black"
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
                className="absolute left-4 z-20 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/40 text-3xl text-white backdrop-blur-md transition hover:bg-white hover:text-black md:left-8"
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
                className="absolute right-4 z-20 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/40 text-3xl text-white backdrop-blur-md transition hover:bg-white hover:text-black md:right-8"
                aria-label="Ảnh tiếp theo"
              >
                ›
              </button>
            </>
          )}

          <div
            className="flex h-full w-full flex-col items-center justify-center px-4 py-20 md:px-24"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={selectedPhoto.image_url}
              alt={selectedPhoto.title || albumTitle}
              className="max-h-[78vh] max-w-full object-contain"
            />

            <div className="mt-5 max-w-3xl text-center">
              {selectedPhoto.title && (
                <h2 className="text-xl font-semibold text-white">
                  {selectedPhoto.title}
                </h2>
              )}

              {selectedPhoto.description && (
                <p className="mt-2 text-sm leading-6 text-white/60">
                  {selectedPhoto.description}
                </p>
              )}

              <p className="mt-3 text-xs text-white/40">
                {selectedIndex + 1} / {photos.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}