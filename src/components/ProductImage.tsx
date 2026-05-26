'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

export function ProductImage({
  src,
  alt,
  priority = false,
  imageUrls = []
}: {
  src: string;
  alt: string;
  priority?: boolean;
  imageUrls?: string[];
}) {
  const candidates = useMemo(() => {
    return Array.from(new Set([src, ...imageUrls].filter(Boolean)));
  }, [src, imageUrls]);

  const [index, setIndex] = useState(0);
  const currentSrc = candidates[index];

  if (!currentSrc || index >= candidates.length) {
    return (
      <div data-product-thumbnail="true" className="flex h-full min-h-[220px] w-full items-center justify-center bg-stone-100 p-8 text-center text-sm font-medium text-stone-500">
        Product image will be updated soon
      </div>
    );
  }

  return (
    <Image
      key={currentSrc}
      src={currentSrc}
      alt={alt}
      fill
      priority={priority}
      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 480px) 50vw, 100vw"
      className="object-cover transition duration-500 group-hover:scale-[1.045]"
      onError={() => setIndex((currentIndex) => currentIndex + 1)}
    />
  );
}
