import { ViewTransition, type ReactNode } from "react";

/** Animates page content in and out on navigation. Goes in each page, not the layout (layouts persist). */
export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <div className={className}>{children}</div>
    </ViewTransition>
  );
}
