import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import Link from "next/link";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-primary bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        special: "rounded-none flex justify-start",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        special: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  href?: string;
  target?: string;
  isReload?: boolean;
}

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { isReload?: boolean }
>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      href,
      target,
      isReload = false,
      ...props
    },
    ref
  ) => {
    let Comp: any;

    if (href && isReload) {
      Comp = "a";
    } else if (href) {
      Comp = Link;
    } else if (asChild) {
      Comp = Slot;
    } else {
      Comp = "button";
    }
    return (
      <Comp
        href={href!}
        target={target}
        className={cn(buttonVariants({ variant, size, className }))}
        // @ts-ignore
        ref={ref!}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
