export function formatTimestamp(timestamp: bigint): string {
  // Convert nanoseconds to milliseconds
  const milliseconds = Number(timestamp / BigInt(1_000_000));
  const date = new Date(milliseconds);

  // Format: "Feb 17, 2026 2:30 PM"
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  return date.toLocaleString('en-US', options);
}
