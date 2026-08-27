import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "light";

type BaseProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

type ButtonStyleProps = Pick<BaseProps, "variant" | "className">;

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "btn btn-primary",
  ghost: "btn btn-ghost",
  light: "btn btn-light",
};

function classes({ variant = "primary", className }: ButtonStyleProps) {
  return [VARIANT_CLASS[variant], className].filter(Boolean).join(" ");
}

export function Button({
  variant = "primary",
  children,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & BaseProps) {
  return (
    <button className={classes({ variant, className })} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & BaseProps & { href: string };

export function ButtonLink({ variant = "primary", href, children, className, ...rest }: LinkProps) {
  return (
    <Link href={href} className={classes({ variant, className })} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
      {children}
    </Link>
  );
}
