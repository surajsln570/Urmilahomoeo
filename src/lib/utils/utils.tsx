// lib/utils.ts

export function formatDate(date: Date | string | number): string {
    const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;

    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function formatTime(date: Date | string | number): string {
    const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;

    return d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}