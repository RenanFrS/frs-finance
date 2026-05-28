// Compat re-export. Use `@/components/ui/badge` directly in new code.
import * as React from "react";
import { Badge, type BadgeProps } from "@/components/ui/badge";

export type FrsBadgeProps = BadgeProps & { dot?: boolean };

export function FrsBadge({ dot, children, ...props }: FrsBadgeProps) {
  return (
    <Badge {...props}>
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </Badge>
  );
}
