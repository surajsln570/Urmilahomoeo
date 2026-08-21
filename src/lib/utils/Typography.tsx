import React from "react";
import { cn } from "@/lib/utils";

type TypographyProps = {
    children: React.ReactNode;
    className?: string;
};

export function H1({ children, className }: TypographyProps) {
    return (
        <h1
            className={cn(
                "text-4xl font-bold tracking-tight",
                "sm:text-5xl",
                className
            )}
        >
            {children}
        </h1>
    );
}

export function H2({ children, className }: TypographyProps) {
    return (
        <h2
            className={cn(
                "text-3xl font-bold tracking-tight",
                "sm:text-4xl",
                className
            )}
        >
            {children}
        </h2>
    );
}

export function H3({ children, className }: TypographyProps) {
    return (
        <h3
            className={cn(
                "text-2xl font-semibold tracking-tight",
                "sm:text-3xl",
                className
            )}
        >
            {children}
        </h3>
    );
}

export function H4({ children, className }: TypographyProps) {
    return (
        <h4
            className={cn(
                "text-xl font-semibold tracking-tight",
                className
            )}
        >
            {children}
        </h4>
    );
}

export function Body({ children, className }: TypographyProps) {
    return (
        <p
            className={cn(
                "text-base font-normal leading-7 text-muted-foreground",
                className
            )}
        >
            {children}
        </p>
    );
}

export function BodySmall({ children, className }: TypographyProps) {
    return (
        <p
            className={cn(
                "text-sm font-normal leading-6 text-muted-foreground",
                className
            )}
        >
            {children}
        </p>
    );
}

export function Label({ children, className }: TypographyProps) {
    return (
        <label
            className={cn(
                "text-sm font-medium leading-none",
                className
            )}
        >
            {children}
        </label>
    );
}

export function Caption({ children, className }: TypographyProps) {
    return (
        <span
            className={cn(
                "text-xs font-medium text-muted-foreground",
                className
            )}
        >
            {children}
        </span>
    );
}

export function Muted({ children, className }: TypographyProps) {
    return (
        <span
            className={cn(
                "text-sm text-muted-foreground",
                className
            )}
        >
            {children}
        </span>
    );
}