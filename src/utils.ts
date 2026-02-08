import { TEvent } from "./types";

/**
 * Sort events by start time (earliest first)
 */
export function sortEventsByStartTime(events: TEvent[]): TEvent[] {
  return [...events].sort((a, b) => a.start_time - b.start_time);
}

/**
 * Filter events based on user login status
 * Logged in users see all events, logged out users only see public events
 */
export function filterEventsByPermission(
  events: TEvent[],
  isLoggedIn: boolean
): TEvent[] {
  if (isLoggedIn) {
    return events;
  }
  return events.filter(
    (event) => !event.permission || event.permission === "public"
  );
}

/**
 * Format Unix timestamp to readable date/time string
 */
export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format a time range (Start - End)
 */
export function formatTimeRange(start: number, end: number): string {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const dayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };

  const startTimeStr = startDate.toLocaleTimeString("en-US", timeOptions);
  const endTimeStr = endDate.toLocaleTimeString("en-US", timeOptions);
  const dateStr = startDate.toLocaleDateString("en-US", dayOptions);

  if (startDate.toDateString() !== endDate.toDateString()) {
    const endDateStr = endDate.toLocaleDateString("en-US", dayOptions);
    return `${dateStr} ${startTimeStr} - ${endDateStr} ${endTimeStr}`;
  }

  return `${dateStr} • ${startTimeStr} - ${endTimeStr}`;
}

/**
 * Format event type for display
 */
export function formatEventType(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Calculate duration between two timestamps
 */
export function calculateDuration(start: number, end: number): string {
  const durationMs = end - start;
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}
