"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { initialsFromName } from "@/lib/initials";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  photoUrl?: string;
  /** Pixel size of the round mark. */
  size?: number;
  halo?: boolean;
}

export function Avatar({
  name,
  photoUrl,
  size = 38,
  halo = false,
  className,
  style,
  ...rest
}: AvatarProps) {
  const initials = initialsFromName(name) || "?";
  return (
    <div
      role="img"
      aria-label={name}
      data-slot="avatar"
      className={cn(
        "rounded-full flex items-center justify-center select-none border border-border overflow-hidden shrink-0",
        photoUrl
          ? "text-transparent"
          : "bg-foreground text-background font-display font-semibold tracking-[0.02em]",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.36),
        backgroundImage: photoUrl ? `url(${photoUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: halo
          ? "0 0 0 3px var(--background), 0 0 0 4px var(--border)"
          : undefined,
        ...style,
      }}
      {...rest}
    >
      {!photoUrl && initials}
    </div>
  );
}
