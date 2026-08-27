import type { ElementType, ReactNode } from "react";

type GlassPanelProps = {
  as?: ElementType;
  variant?: "default" | "light" | "strong";
  className?: string;
  children?: ReactNode;
};

const VARIANT_CLASS = {
  default: "glass",
  light: "glass-light",
  strong: "glass glass-strong",
};

export default function GlassPanel({
  as: Tag = "div",
  variant = "default",
  className,
  children,
  ...rest
}: GlassPanelProps) {
  return (
    <Tag className={[VARIANT_CLASS[variant], className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </Tag>
  );
}
