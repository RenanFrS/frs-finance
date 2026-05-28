// Compat re-export. Prefer importing { Avatar } from "@/components/ui/avatar".
import * as React from "react";
import { Avatar, type AvatarProps } from "@/components/ui/avatar";

type Size = "sm" | "md" | "lg" | "xl";
const SIZE_MAP: Record<Size, number> = { sm: 28, md: 44, lg: 64, xl: 80 };

export interface InitialsAvatarProps extends Omit<AvatarProps, "size"> {
  size?: Size;
}

export function InitialsAvatar({ size = "md", ...rest }: InitialsAvatarProps) {
  return <Avatar size={SIZE_MAP[size]} {...rest} />;
}
