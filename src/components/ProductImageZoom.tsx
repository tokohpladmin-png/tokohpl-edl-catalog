'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

export function ProductImageZoom({
  src,
  alt,
  imageUrls = []
}: {
  src: string;
  alt: string;
  imageUrls?: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  const candidates = useMemo(() => {
    return Array.from(new Set([src, ...imageUrls].filter(Boolean)));
  }, [src, imageUrls]);

  const [index, setIndex] = useState(0);
  const currentSrc = candidates[index];

  if (!currentSrc || index >= candidates.length) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-[2rem] border border-stone-200 bg-stone-100 p-8 text-center text-sm font-medium text-stone-500">
        Product image will be updated soon
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] border border-stone-200 bg-stone-100 text-left shadow-card"
      >
        <Image
          key={currentSrc}
          src={currentSrc}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 48vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.035]"
          onError={() => setIndex((currentIndex) => currentIndex + 1)}
        />
        <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-stone-950 shadow-sm backdrop-blur">
          Click to zoom
        </span>
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/85 p-4 backdrop-blur" role="dialog" aria-modal="true">
          <div className="w-full max-w-5xl rounded-[2rem] bg-white p-3 shadow-luxury">
            <div className="mb-3 flex items-center justify-between gap-3 px-2 pt-1">
              <p className="line-clamp-1 text-sm font-bold text-stone-950">{alt}</p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xl font-bold text-stone-950 hover:bg-stone-200"
                aria-label="Close image zoom"
              >
                ×
              </button>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-stone-100">
              <Image src={currentSrc} alt={alt} fill sizes="100vw" className="object-contain" />
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3 px-2 py-3 text-sm text-stone-600">
              <a href={currentSrc} download target="_blank" rel="noreferrer" className="font-bold text-stone-950 hover:underline">
                Download
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
