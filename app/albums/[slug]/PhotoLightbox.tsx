"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { loadMorePhotos } from "./actions";

export type LightboxPhoto = { id: string; title: string | null; description: string | null; image_url: string; thumbnail_url: string | null; sort_order?: number };

export default function PhotoLightbox({ initialPhotos, albumId, total }: { initialPhotos: LightboxPhoto[]; albumId: string; total: number }) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [pending, startTransition] = useTransition();
  const touchStart = useRef<number | null>(null);
  const watermark = process.env.NEXT_PUBLIC_WATERMARK_TEXT || "© Moments";
  const close = useCallback(() => setSelectedIndex(null), []);
  const previous = useCallback(() => setSelectedIndex((i) => i === null ? i : (i === 0 ? photos.length - 1 : i - 1)), [photos.length]);
  const next = useCallback(() => setSelectedIndex((i) => i === null ? i : (i === photos.length - 1 ? 0 : i + 1)), [photos.length]);

  useEffect(() => {
    if (selectedIndex === null) return;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") close(); if (e.key === "ArrowLeft") previous(); if (e.key === "ArrowRight") next(); };
    window.addEventListener("keydown", key);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", key); };
  }, [selectedIndex, close, previous, next]);

  function loadMore() {
    startTransition(async () => {
      const more = await loadMorePhotos(albumId, photos.length, 30);
      setPhotos((current) => [...current, ...more]);
    });
  }

  const current = selectedIndex === null ? null : photos[selectedIndex];
  if (total === 0) return <div className="rounded-3xl border border-dashed p-16 text-center">Album chưa có hình ảnh.</div>;

  return <>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" onContextMenu={(e) => e.preventDefault()}>
      {photos.map((photo, index) => <button key={photo.id} type="button" onClick={() => setSelectedIndex(index)} className="group relative overflow-hidden rounded-3xl bg-neutral-200 text-left dark:bg-neutral-900">
        <div className="relative aspect-[4/3] overflow-hidden">
          {!loaded[photo.id] && <div className="absolute inset-0 animate-pulse bg-neutral-300 dark:bg-neutral-800"/>}
          <img src={photo.thumbnail_url || photo.image_url} alt={photo.title || `Ảnh ${index + 1}`} loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} draggable={false} onLoad={() => setLoaded((v) => ({ ...v, [photo.id]: true }))} className={`h-full w-full select-none object-cover transition duration-500 group-hover:scale-105 ${loaded[photo.id] ? "opacity-100" : "opacity-0"}`}/>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100"><span className="rotate-[-18deg] text-lg font-bold tracking-widest text-white/65 drop-shadow">{watermark}</span></div>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 text-white"><h3 className="truncate font-semibold">{photo.title || "Xem ảnh"}</h3></div>
      </button>)}
    </div>
    {photos.length < total && <div className="mt-8 text-center"><button type="button" onClick={loadMore} disabled={pending} className="rounded-full bg-neutral-900 px-7 py-3 font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-black">{pending ? "Đang tải..." : `Xem thêm (${total - photos.length} ảnh còn lại)`}</button></div>}

    {current && selectedIndex !== null && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4" role="dialog" aria-modal="true" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }} onContextMenu={(e) => e.preventDefault()} onTouchStart={(e) => touchStart.current = e.touches[0].clientX} onTouchEnd={(e) => { if (touchStart.current === null) return; const delta = e.changedTouches[0].clientX - touchStart.current; if (Math.abs(delta) > 50) delta > 0 ? previous() : next(); touchStart.current = null; }}>
      <button onClick={close} className="absolute right-5 top-5 z-20 h-12 w-12 rounded-full bg-black/50 text-2xl text-white">×</button>
      <span className="absolute left-5 top-5 z-20 rounded-full bg-black/50 px-4 py-2 text-sm text-white">{selectedIndex + 1} / {photos.length}</span>
      {photos.length > 1 && <><button onClick={previous} className="absolute left-3 z-20 h-14 w-14 rounded-full bg-black/50 text-4xl text-white">‹</button><button onClick={next} className="absolute right-3 z-20 h-14 w-14 rounded-full bg-black/50 text-4xl text-white">›</button></>}
      <div className="flex max-h-full max-w-7xl flex-col items-center" onMouseDown={(e) => e.stopPropagation()}>
        <div className="relative"><img src={current.image_url} alt={current.title || "Ảnh"} draggable={false} className="max-h-[78vh] max-w-full select-none object-contain"/><div className="pointer-events-none absolute inset-0 grid place-items-center"><span className="rotate-[-22deg] text-2xl font-bold tracking-[.25em] text-white/35 drop-shadow-lg sm:text-4xl">{watermark}</span></div><div className="pointer-events-none absolute inset-0"/></div>
        {(current.title || current.description) && <div className="mt-4 max-w-3xl text-center text-white"><h2 className="text-xl font-bold">{current.title}</h2>{current.description && <p className="mt-2 text-white/65">{current.description}</p>}</div>}
      </div>
    </div>}
  </>;
}
