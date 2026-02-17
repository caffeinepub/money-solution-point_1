import type { EntryIdVisitorRecord } from '../backend';
import { formatTimestamp } from './formatTimestamp';

export function exportToCSV(records: EntryIdVisitorRecord[]): void {
  // Define CSV headers
  const headers = [
    'Date & Time',
    'Full Name',
    'Contact',
    'Address',
    'Organization/Bank',
    'Income Level',
    'Visit Type',
    'Purpose/Remarks',
  ];

  // Convert records to CSV rows
  const rows = records.map((entry) => [
    formatTimestamp(entry.record.timestamp),
    entry.record.fullName,
    entry.record.email,
    entry.record.address,
    entry.record.jobInfo,
    entry.record.incomeLevel,
    entry.record.visitType,
    entry.record.reasonForVisit,
  ]);

  // Escape CSV values (handle commas, quotes, newlines)
  const escapeCSV = (value: string): string => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  // Build CSV content
  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map((row) => row.map(escapeCSV).join(',')),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `MSP_Visitor_Records_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
