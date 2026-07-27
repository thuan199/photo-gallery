"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

import { loadMorePhotos } from "./actions";

export type LightboxPhoto = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  thumbnail_url: string | null;
  sort_order?: number;
};

type PhotoLightboxProps = {
  initialPhotos: LightboxPhoto[];
  albumId: string;
  total: number;
};

export default function PhotoLightbox({
  initialPhotos,
  albumId,
  total,
}: PhotoLightboxProps) {
  const [photos, setPhotos] =
    useState<LightboxPhoto[]>(initialPhotos);

  const [selectedIndex, setSelectedIndex] =
    useState<number | null>(null);

  const [loaded, setLoaded] = useState<
    Record<string, boolean>
  >({});

  const [zoom, setZoom] = useState(1);

  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  const [isDragging, setIsDragging] = useState(false);

  const [pending, startTransition] = useTransition();

  const touchStart = useRef<number | null>(null);

  const dragStart = useRef({
    mouseX: 0,
    mouseY: 0,
    imageX: 0,
    imageY: 0,
  });

  const current =
    selectedIndex === null
      ? null
      : photos[selectedIndex];

  const resetView = useCallback(() => {
    setZoom(1);
    setPosition({
      x: 0,
      y: 0,
    });
    setIsDragging(false);
  }, []);

  const openPhoto = useCallback((index: number) => {
    setSelectedIndex(index);
    setZoom(1);
    setPosition({
      x: 0,
      y: 0,
    });
  }, []);

  const close = useCallback(() => {
    setSelectedIndex(null);
    resetView();
  }, [resetView]);

  const previous = useCallback(() => {
    setSelectedIndex((index) => {
      if (index === null) return index;

      return index === 0
        ? photos.length - 1
        : index - 1;
    });

    resetView();
  }, [photos.length, resetView]);

  const next = useCallback(() => {
    setSelectedIndex((index) => {
      if (index === null) return index;

      return index === photos.length - 1
        ? 0
        : index + 1;
    });

    resetView();
  }, [photos.length, resetView]);

  const zoomIn = useCallback(() => {
    setZoom((currentZoom) =>
      Math.min(4, currentZoom + 0.25)
    );
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((currentZoom) => {
      const newZoom = Math.max(
        1,
        currentZoom - 0.25
      );

      if (newZoom === 1) {
        setPosition({
          x: 0,
          y: 0,
        });
      }

      return newZoom;
    });
  }, []);

  useEffect(() => {
    if (selectedIndex === null) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      }

      if (event.key === "ArrowLeft") {
        previous();
      }

      if (event.key === "ArrowRight") {
        next();
      }

      if (event.key === "+" || event.key === "=") {
        zoomIn();
      }

      if (event.key === "-") {
        zoomOut();
      }

      if (event.key === "0") {
        resetView();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    selectedIndex,
    close,
    previous,
    next,
    zoomIn,
    zoomOut,
    resetView,
  ]);

  function loadMore() {
    if (pending) return;

    startTransition(async () => {
      try {
        const more = await loadMorePhotos(
          albumId,
          photos.length,
          30
        );

        setPhotos((currentPhotos) => [
          ...currentPhotos,
          ...more,
        ]);
      } catch (error) {
        console.error(
          "Không thể tải thêm ảnh:",
          error
        );
      }
    });
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

  function handleMouseDown(
    event: React.MouseEvent<HTMLDivElement>
  ) {
    event.stopPropagation();

    if (zoom <= 1) return;

    setIsDragging(true);

    dragStart.current = {
      mouseX: event.clientX,
      mouseY: event.clientY,
      imageX: position.x,
      imageY: position.y,
    };
  }

  function handleMouseMove(
    event: React.MouseEvent<HTMLDivElement>
  ) {
    if (!isDragging || zoom <= 1) return;

    const deltaX =
      event.clientX - dragStart.current.mouseX;

    const deltaY =
      event.clientY - dragStart.current.mouseY;

    setPosition({
      x: dragStart.current.imageX + deltaX,
      y: dragStart.current.imageY + deltaY,
    });
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  if (total === 0) {
    return (
      <div className="rounded-3xl border border-dashed p-16 text-center">
        Album chưa có hình ảnh.
      </div>
    );
  }

  return (
    <>
      <div
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        onContextMenu={(event) =>
          event.preventDefault()
        }
      >
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => openPhoto(index)}
            className="
              group relative overflow-hidden
              rounded-3xl bg-neutral-200
              text-left
              dark:bg-neutral-900
            "
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              {!loaded[photo.id] && (
                <div
                  className="
                    absolute inset-0
                    animate-pulse
                    bg-neutral-300
                    dark:bg-neutral-800
                  "
                />
              )}

              <img
                src={
                  photo.thumbnail_url ||
                  photo.image_url
                }
                alt={
                  photo.title ||
                  `Ảnh ${index + 1}`
                }
                loading={
                  index === 0 ? "eager" : "lazy"
                }
                fetchPriority={
                  index === 0 ? "high" : "auto"
                }
                draggable={false}
                onLoad={() =>
                  setLoaded((currentLoaded) => ({
                    ...currentLoaded,
                    [photo.id]: true,
                  }))
                }
                className={`
                  h-full w-full
                  select-none object-cover
                  transition duration-500
                  group-hover:scale-105
                  ${
                    loaded[photo.id]
                      ? "opacity-100"
                      : "opacity-0"
                  }
                `}
              />
            </div>

            <div
              className="
                absolute inset-x-0 bottom-0
                bg-gradient-to-t
                from-black/80 to-transparent
                p-5 text-white
              "
            >
              <h3 className="truncate font-semibold">
                {photo.title || "Xem ảnh"}
              </h3>
            </div>
          </button>
        ))}
      </div>

      {photos.length < total && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={pending}
            className="
              rounded-full bg-neutral-900
              px-7 py-3
              font-semibold text-white
              disabled:opacity-50
              dark:bg-white dark:text-black
            "
          >
            {pending
              ? "Đang tải..."
              : `Xem thêm ${
                  total - photos.length
                } ảnh còn lại`}
          </button>
        </div>
      )}

      {current && selectedIndex !== null && (
        <div
          className="
            fixed inset-0 z-[9999]
            flex items-center justify-center
            overflow-hidden
            bg-black/95
          "
          role="dialog"
          aria-modal="true"
          onClick={close}
          onContextMenu={(event) =>
            event.preventDefault()
          }
          onWheel={handleWheel}
          onTouchStart={(event) => {
            if (zoom > 1) return;

            touchStart.current =
              event.touches[0].clientX;
          }}
          onTouchEnd={(event) => {
            if (
              touchStart.current === null ||
              zoom > 1
            ) {
              return;
            }

            const delta =
              event.changedTouches[0].clientX -
              touchStart.current;

            if (Math.abs(delta) > 50) {
              if (delta > 0) {
                previous();
              } else {
                next();
              }
            }

            touchStart.current = null;
          }}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              close();
            }}
            className="
              absolute right-5 top-5
              z-[10020]
              flex h-12 w-12
              items-center justify-center
              rounded-full
              bg-black/50
              text-3xl text-white
              transition
              hover:bg-white
              hover:text-black
            "
            aria-label="Đóng ảnh"
          >
            ×
          </button>

          <span
            className="
              absolute left-5 top-5
              z-[10020]
              rounded-full bg-black/50
              px-4 py-2
              text-sm text-white
            "
          >
            {selectedIndex + 1} / {photos.length}
          </span>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  previous();
                }}
                className="
                  absolute left-3 top-1/2
                  z-[10020]
                  flex h-14 w-14
                  -translate-y-1/2
                  items-center justify-center
                  rounded-full
                  bg-black/50
                  text-4xl text-white
                  transition
                  hover:bg-white
                  hover:text-black
                  md:left-7
                "
                aria-label="Ảnh trước"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  next();
                }}
                className="
                  absolute right-3 top-1/2
                  z-[10020]
                  flex h-14 w-14
                  -translate-y-1/2
                  items-center justify-center
                  rounded-full
                  bg-black/50
                  text-4xl text-white
                  transition
                  hover:bg-white
                  hover:text-black
                  md:right-7
                "
                aria-label="Ảnh tiếp theo"
              >
                ›
              </button>
            </>
          )}

          <div
            className={`
              flex h-full w-full
              items-center justify-center
              overflow-hidden
              px-16 pb-28 pt-20
              ${
                zoom > 1
                  ? isDragging
                    ? "cursor-grabbing"
                    : "cursor-grab"
                  : "cursor-default"
              }
            `}
            onClick={(event) =>
              event.stopPropagation()
            }
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transformOrigin: "center center",
              }}
              className="
                relative
                transition-transform
                duration-150
              "
            >
              <img
                src={current.image_url}
                alt={current.title || "Ảnh"}
                draggable={false}
                className="
                  max-h-[75vh]
                  max-w-[82vw]
                  select-none
                  object-contain
                  shadow-2xl
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute inset-0
                "
              />
            </div>
          </div>

          {(current.title ||
            current.description) && (
            <div
              className="
                pointer-events-none
                absolute bottom-20 left-1/2
                z-[10010]
                w-full max-w-3xl
                -translate-x-1/2
                px-5 text-center text-white
              "
            >
              {current.title && (
                <h2 className="text-xl font-bold">
                  {current.title}
                </h2>
              )}

              {current.description && (
                <p className="mt-2 text-white/65">
                  {current.description}
                </p>
              )}
            </div>
          )}

          <div
            className="
              absolute bottom-5 left-1/2
              z-[10020]
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
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              onClick={zoomOut}
              disabled={zoom <= 1}
              className="
                flex h-10 w-10
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
              onClick={resetView}
              className="
                min-w-20 rounded-full
                px-3 py-2
                text-sm font-semibold
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
        </div>
      )}
    </>
  );
}