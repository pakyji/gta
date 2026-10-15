"use client";
/**
 * Always-visible image tile. Uses <img> + CSS background fallback so flex/grid
 * layouts never collapse to 0x0 and broken paths still show a gradient.
 */
import { useState } from "react";

export function SafeImage({
  src,
  alt,
  fallback = "/images/veh-default.jpg",
  className = "",
  imgClassName = "h-full w-full object-cover",
  width,
  height,
}: {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  imgClassName?: string;
  width?: number;
  height?: number;
}) {
  const [current, setCurrent] = useState(src || fallback);
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-[#12121a] ${className}`}
      style={{
        backgroundImage: failed ? undefined : `url(${current})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minWidth: width,
        minHeight: height,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={current}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={imgClassName}
        style={{ display: "block" }}
        onError={() => {
          if (current !== fallback) {
            setCurrent(fallback);
          } else {
            setFailed(true);
          }
        }}
      />
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-900/40 to-cyan-900/30 text-2xl">
          🚗
        </div>
      )}
    </div>
  );
}
