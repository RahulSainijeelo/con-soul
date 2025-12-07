import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    style={{
      backgroundColor: "var(--color-surface)",
      color: "var(--color-text-primary)",
      boxShadow: "var(--shadow-md)", // You can use var(--shadow-sm) or another shadow if preferred
      ...style,
    }}
    className={cn("rounded-lg", className)}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    style={{
      padding: "1.5rem",
      gap: "0.375rem",
      flexDirection: "column",
      display: "flex",
      ...style,
    }}
    className={cn(className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, style, ...props }, ref) => (
  <h3
    ref={ref}
    style={{
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: "-0.02em",
      fontSize: "1.5rem",
      color: "var(--color-text-primary)",
      fontFamily: "var(--font-heading)",
      ...style,
    }}
    className={cn(className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, style, ...props }, ref) => (
  <p
    ref={ref}
    style={{
      fontSize: "0.875rem",
      color: "var(--color-text-secondary)",
      ...style,
    }}
    className={cn(className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    style={{ padding: "1.5rem", paddingTop: 0, ...style }}
    className={cn(className)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    style={{
      ...style,
    }}
    className={cn(className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
