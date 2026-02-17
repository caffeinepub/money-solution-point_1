import type { EntryIdVisitorRecord } from '../backend';
import { formatTimestamp } from './formatTimestamp';

// Type definitions for SheetJS
interface WorkSheet {
  [key: string]: any;
  '!cols'?: Array<{ wch: number }>;
}

interface WorkBook {
  SheetNames: string[];
  Sheets: { [key: string]: WorkSheet };
}

interface XLSXUtils {
  json_to_sheet: (data: any[]) => WorkSheet;
  book_new: () => WorkBook;
  book_append_sheet: (workbook: WorkBook, worksheet: WorkSheet, name: string) => void;
}

interface XLSX {
  utils: XLSXUtils;
  writeFile: (workbook: WorkBook, filename: string, options?: { compression: boolean }) => void;
}

export function exportToXLSX(records: EntryIdVisitorRecord[]): void {
  // Dynamically import XLSX library from CDN
  const xlsxUrl = 'https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs';
  
  // Use dynamic import with type assertion
  (import(/* @vite-ignore */ xlsxUrl) as Promise<XLSX>)
    .then((XLSX) => {
      // Prepare data for Excel
      const data = records.map((entry) => ({
        'Date & Time': formatTimestamp(entry.record.timestamp),
        'Full Name': entry.record.fullName,
        'Contact': entry.record.email,
        'Address': entry.record.address,
        'Organization/Bank': entry.record.jobInfo,
        'Income Level': entry.record.incomeLevel,
        'Visit Type': entry.record.visitType,
        'Purpose/Remarks': entry.record.reasonForVisit,
      }));

      // Create worksheet from data
      const worksheet = XLSX.utils.json_to_sheet(data);

      // Set column widths
      const columnWidths = [
        { wch: 20 }, // Date & Time
        { wch: 20 }, // Full Name
        { wch: 25 }, // Contact
        { wch: 30 }, // Address
        { wch: 25 }, // Organization/Bank
        { wch: 15 }, // Income Level
        { wch: 20 }, // Visit Type
        { wch: 40 }, // Purpose/Remarks
      ];
      worksheet['!cols'] = columnWidths;

      // Create workbook and add worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Visitor Records');

      // Generate filename with current date
      const filename = `MSP_Visitor_Records_${new Date().toISOString().split('T')[0]}.xlsx`;

      // Write file
      XLSX.writeFile(workbook, filename, { compression: true });
    })
    .catch((error) => {
      console.error('Failed to load XLSX library:', error);
      throw new Error('Failed to export Excel file. Please try again.');
    });
}
