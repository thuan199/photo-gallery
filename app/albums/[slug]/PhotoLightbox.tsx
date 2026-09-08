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

  const [isDragging, setIsDragging] =
    useState(false);

  const [pending, startTransition] =
    useTransition();

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

  const openPhoto = useCallback(
    (index: number) => {
      setSelectedIndex(index);

      setZoom(1);

      setPosition({
        x: 0,
        y: 0,
      });
    },
    []
  );

  const close = useCallback(() => {
    setSelectedIndex(null);
    resetView();
  }, [resetView]);

  const previous = useCallback(() => {
    setSelectedIndex((index) => {
      if (index === null) {
        return index;
      }

      return index === 0
        ? photos.length - 1
        : index - 1;
    });

    resetView();
  }, [photos.length, resetView]);

  const next = useCallback(() => {
    setSelectedIndex((index) => {
      if (index === null) {
        return index;
      }

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
    if (selectedIndex === null) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        close();
      }

      if (event.key === "ArrowLeft") {
        previous();
      }

      if (event.key === "ArrowRight") {
        next();
      }

      if (
        event.key === "+" ||
        event.key === "="
      ) {
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
    if (pending) {
      return;
    }

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

    if (zoom <= 1) {
      return;
    }

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
    if (!isDragging || zoom <= 1) {
      return;
    }

    const deltaX =
      event.clientX -
      dragStart.current.mouseX;

    const deltaY =
      event.clientY -
      dragStart.current.mouseY;

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
      <div className="border-y border-black/10 py-24 text-center">
        <p className="font-serif text-3xl text-[#716b61]">
          Album này chưa có hình ảnh.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* MASONRY GALLERY */}
      <div
        className="
          columns-1
          gap-4
          sm:columns-2
          sm:gap-6
          lg:columns-3
          lg:gap-7
        "
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
              group
              relative
              mb-4
              block
              w-full
              break-inside-avoid
              overflow-hidden
              bg-[#ded9d0]
              text-left
              sm:mb-6
              lg:mb-7
            "
          >
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
                index < 3 ? "eager" : "lazy"
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
                block
                h-auto
                w-full
                select-none
                object-cover
                transition
                duration-[900ms]
                ease-out
                group-hover:scale-[1.025]
                ${
                  loaded[photo.id]
                    ? "opacity-100"
                    : "opacity-0"
                }
              `}
            />

            {!loaded[photo.id] && (
              <div
                className="
                  absolute
                  inset-0
                  min-h-[260px]
                  animate-pulse
                  bg-[#ded9d0]
                "
              />
            )}

            {/* OVERLAY */}
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-black/0
                transition
                duration-500
                group-hover:bg-black/10
              "
            />

            {/* PHOTO NUMBER */}
            <span
              className="
                absolute
                right-4
                top-4
                flex
                h-9
                min-w-9
                translate-y-1
                items-center
                justify-center
                rounded-full
                bg-[#f7f5f0]/90
                px-2
                text-[10px]
                tracking-[0.15em]
                text-[#292722]
                opacity-0
                backdrop-blur-md
                transition
                duration-300
                group-hover:translate-y-0
                group-hover:opacity-100
              "
            >
              {String(index + 1).padStart(
                2,
                "0"
              )}
            </span>

            {/* TITLE */}
            {photo.title && (
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-x-0
                  bottom-0
                  translate-y-3
                  bg-gradient-to-t
                  from-black/65
                  via-black/20
                  to-transparent
                  px-5
                  pb-5
                  pt-16
                  text-white
                  opacity-0
                  transition
                  duration-300
                  group-hover:translate-y-0
                  group-hover:opacity-100
                "
              >
                <p className="font-serif text-xl">
                  {photo.title}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* LOAD MORE */}
      {photos.length < total && (
        <div className="mt-16 flex justify-center lg:mt-24">
          <button
            type="button"
            onClick={loadMore}
            disabled={pending}
            className="
              group
              inline-flex
              items-center
              gap-5
              border-b
              border-[#292722]
              pb-2
              text-[11px]
              uppercase
              tracking-[0.25em]
              text-[#292722]
              transition
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <span>
              {pending
                ? "Đang tải..."
                : `Xem thêm ${
                    total - photos.length
                  } ảnh`}
            </span>

            <span
              className="
                transition-transform
                duration-300
                group-hover:translate-y-1
              "
            >
              ↓
            </span>
          </button>
        </div>
      )}

      {/* LIGHTBOX */}
      {current &&
        selectedIndex !== null && (
          <div
            className="
              fixed
              inset-0
              z-[9999]
              flex
              items-center
              justify-center
              overflow-hidden
              bg-[#11110f]/[0.98]
            "
            role="dialog"
            aria-modal="true"
            onClick={close}
            onContextMenu={(event) =>
              event.preventDefault()
            }
            onWheel={handleWheel}
            onTouchStart={(event) => {
              if (zoom > 1) {
                return;
              }

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
                event.changedTouches[0]
                  .clientX -
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
            {/* TOP BAR */}
            <div
              className="
                pointer-events-none
                absolute
                inset-x-0
                top-0
                z-[10020]
                flex
                items-center
                justify-between
                px-5
                py-5
                text-white
                sm:px-8
              "
            >
              <span
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.3em]
                  text-white/60
                "
              >
                {String(
                  selectedIndex + 1
                ).padStart(2, "0")}
                {" / "}
                {String(
                  photos.length
                ).padStart(2, "0")}
              </span>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  close();
                }}
                className="
                  pointer-events-auto
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/30
                  text-2xl
                  font-light
                  text-white
                  transition
                  hover:bg-white
                  hover:text-black
                "
                aria-label="Đóng ảnh"
              >
                ×
              </button>
            </div>

            {/* PREVIOUS / NEXT */}
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    previous();
                  }}
                  className="
                    absolute
                    left-3
                    top-1/2
                    z-[10020]
                    flex
                    h-12
                    w-12
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/20
                    bg-black/20
                    text-3xl
                    font-light
                    text-white
                    backdrop-blur-sm
                    transition
                    hover:bg-white
                    hover:text-black
                    sm:left-6
                    sm:h-14
                    sm:w-14
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
                    absolute
                    right-3
                    top-1/2
                    z-[10020]
                    flex
                    h-12
                    w-12
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/20
                    bg-black/20
                    text-3xl
                    font-light
                    text-white
                    backdrop-blur-sm
                    transition
                    hover:bg-white
                    hover:text-black
                    sm:right-6
                    sm:h-14
                    sm:w-14
                  "
                  aria-label="Ảnh tiếp theo"
                >
                  ›
                </button>
              </>
            )}

            {/* IMAGE AREA */}
            <div
              className={`
                flex
                h-full
                w-full
                items-center
                justify-center
                overflow-hidden
                px-5
                pb-32
                pt-20
                sm:px-20
                sm:pb-36
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
                  transformOrigin:
                    "center center",
                }}
                className="
                  relative
                  transition-transform
                  duration-150
                "
              >
                <img
                  src={current.image_url}
                  alt={
                    current.title || "Ảnh"
                  }
                  draggable={false}
                  className="
                    max-h-[72svh]
                    max-w-[92vw]
                    select-none
                    object-contain
                    sm:max-w-[82vw]
                  "
                />
              </div>
            </div>

            {/* PHOTO INFO */}
            {(current.title ||
              current.description) && (
              <div
                className="
                  pointer-events-none
                  absolute
                  bottom-[76px]
                  left-1/2
                  z-[10010]
                  w-full
                  max-w-3xl
                  -translate-x-1/2
                  px-6
                  text-center
                  text-white
                "
              >
                {current.title && (
                  <h2
                    className="
                      font-serif
                      text-2xl
                      font-normal
                      sm:text-3xl
                    "
                  >
                    {current.title}
                  </h2>
                )}

                {current.description && (
                  <p
                    className="
                      mx-auto
                      mt-2
                      max-w-xl
                      text-sm
                      leading-6
                      text-white/55
                    "
                  >
                    {current.description}
                  </p>
                )}
              </div>
            )}

            {/* ZOOM CONTROLS */}
            <div
              className="
                absolute
                bottom-5
                left-1/2
                z-[10020]
                flex
                -translate-x-1/2
                items-center
                gap-1
                rounded-full
                border
                border-white/15
                bg-black/30
                p-1
                text-white
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
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  text-xl
                  transition
                  hover:bg-white/10
                  disabled:cursor-not-allowed
                  disabled:opacity-25
                "
                aria-label="Thu nhỏ ảnh"
              >
                −
              </button>

              <button
                type="button"
                onClick={resetView}
                className="
                  min-w-[68px]
                  rounded-full
                  px-2
                  py-2
                  text-xs
                  tracking-[0.08em]
                  transition
                  hover:bg-white/10
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
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  text-xl
                  transition
                  hover:bg-white/10
                  disabled:cursor-not-allowed
                  disabled:opacity-25
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