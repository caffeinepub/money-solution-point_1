import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatTimestamp } from '../utils/formatTimestamp';
import type { EntryIdVisitorRecord } from '../backend';
import { Users } from 'lucide-react';

interface VisitorTableProps {
  records: EntryIdVisitorRecord[];
  isLoading: boolean;
}

export default function VisitorTable({ records, isLoading }: VisitorTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-6 mb-4">
          <Users className="w-12 h-12 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          No visitor records yet
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm">
          Start tracking visitors by filling out the form on the left. All records will appear here.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] rounded-md border border-slate-200 dark:border-slate-800">
      <Table>
        <TableHeader className="sticky top-0 bg-slate-50 dark:bg-slate-900 z-10">
          <TableRow>
            <TableHead className="font-semibold">Date & Time</TableHead>
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Contact</TableHead>
            <TableHead className="font-semibold">Organization</TableHead>
            <TableHead className="font-semibold">Visit Type</TableHead>
            <TableHead className="font-semibold">Income Level</TableHead>
            <TableHead className="font-semibold">Purpose</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((entry) => (
            <TableRow key={entry.id.toString()} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
              <TableCell className="font-medium text-xs whitespace-nowrap">
                {formatTimestamp(entry.record.timestamp)}
              </TableCell>
              <TableCell className="font-medium">{entry.record.fullName}</TableCell>
              <TableCell className="text-sm">{entry.record.email}</TableCell>
              <TableCell className="text-sm">{entry.record.jobInfo}</TableCell>
              <TableCell>
                <Badge variant="outline" className="whitespace-nowrap">
                  {entry.record.visitType}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    entry.record.incomeLevel === 'High' || entry.record.incomeLevel === 'Very High'
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {entry.record.incomeLevel}
                </Badge>
              </TableCell>
              <TableCell className="text-sm max-w-xs truncate">
                {entry.record.reasonForVisit}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
