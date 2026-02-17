import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatTimestamp } from '../utils/formatTimestamp';
import { useUpdateVisitorRecord } from '../hooks/useQueries';
import type { EntryIdVisitorRecord } from '../backend';
import { Users, Pencil } from 'lucide-react';
import { toast } from 'sonner';

interface VisitorTableProps {
  records: EntryIdVisitorRecord[];
  isLoading: boolean;
  isAdmin: boolean;
}

export default function VisitorTable({ records, isLoading, isAdmin }: VisitorTableProps) {
  const [editingRecord, setEditingRecord] = useState<EntryIdVisitorRecord | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    jobInfo: '',
    incomeLevel: '',
    reasonForVisit: '',
    visitType: '',
  });

  const updateMutation = useUpdateVisitorRecord();

  const handleEdit = (record: EntryIdVisitorRecord) => {
    setEditingRecord(record);
    setFormData({
      fullName: record.record.fullName,
      email: record.record.email,
      address: record.record.address,
      jobInfo: record.record.jobInfo,
      incomeLevel: record.record.incomeLevel,
      reasonForVisit: record.record.reasonForVisit,
      visitType: record.record.visitType,
    });
  };

  const handleSave = async () => {
    if (!editingRecord) return;

    try {
      await updateMutation.mutateAsync({
        id: editingRecord.id,
        ...formData,
      });
      toast.success('Record updated successfully');
      setEditingRecord(null);
    } catch (error) {
      toast.error('Failed to update record');
      console.error('Update error:', error);
    }
  };

  const handleCancel = () => {
    setEditingRecord(null);
    setFormData({
      fullName: '',
      email: '',
      address: '',
      jobInfo: '',
      incomeLevel: '',
      reasonForVisit: '',
      visitType: '',
    });
  };

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
    <>
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
              {isAdmin && <TableHead className="font-semibold">Actions</TableHead>}
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
                {isAdmin && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(entry)}
                      className="gap-2"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <Dialog open={!!editingRecord} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Visitor Record</DialogTitle>
            <DialogDescription>
              Update the visitor information below. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-fullName">Full Name</Label>
              <Input
                id="edit-fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Contact (Email/Phone)</Label>
              <Input
                id="edit-email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter contact information"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter address"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-jobInfo">Organization/Bank</Label>
              <Input
                id="edit-jobInfo"
                value={formData.jobInfo}
                onChange={(e) => setFormData({ ...formData, jobInfo: e.target.value })}
                placeholder="Enter organization or bank name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-incomeLevel">Income Level</Label>
              <Select
                value={formData.incomeLevel}
                onValueChange={(value) => setFormData({ ...formData, incomeLevel: value })}
              >
                <SelectTrigger id="edit-incomeLevel">
                  <SelectValue placeholder="Select income level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Very Low">Very Low</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Very High">Very High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-visitType">Visit Type</Label>
              <Select
                value={formData.visitType}
                onValueChange={(value) => setFormData({ ...formData, visitType: value })}
              >
                <SelectTrigger id="edit-visitType">
                  <SelectValue placeholder="Select visit type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New Client">New Client</SelectItem>
                  <SelectItem value="Existing Client">Existing Client</SelectItem>
                  <SelectItem value="Follow-up">Follow-up</SelectItem>
                  <SelectItem value="Consultation">Consultation</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-reasonForVisit">Purpose/Remarks</Label>
              <Textarea
                id="edit-reasonForVisit"
                value={formData.reasonForVisit}
                onChange={(e) => setFormData({ ...formData, reasonForVisit: e.target.value })}
                placeholder="Enter purpose of visit or remarks"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel} disabled={updateMutation.isPending}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
