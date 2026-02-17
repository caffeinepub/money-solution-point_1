import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { KeyRound, Info } from 'lucide-react';

interface ChangeAdminPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

export default function ChangeAdminPasswordDialog({
  open,
  onOpenChange,
  onSubmit,
}: ChangeAdminPasswordDialogProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }

    if (newPassword.trim().length === 0) {
      setError('New password cannot be empty');
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await onSubmit(currentPassword.trim(), newPassword.trim());
      
      if (success) {
        // Reset form and close dialog on success
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onOpenChange(false);
      } else {
        setError('Incorrect current password');
      }
    } catch (error) {
      console.error('Change password error:', error);
      setError('Failed to change password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
    }
    onOpenChange(newOpen);
  };

  const handleInputChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const isFormValid = currentPassword.trim() && newPassword.trim() && confirmPassword.trim();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
              <KeyRound className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <DialogTitle>Change Admin Password</DialogTitle>
          </div>
          <DialogDescription>
            Update your admin password. The new password will be required for all future Admin unlocks.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <Alert className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-sm text-slate-700 dark:text-slate-300">
                After updating, you will need to use your new password to unlock Admin privileges.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={handleInputChange(setCurrentPassword)}
                placeholder="Enter current password"
                autoFocus
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={handleInputChange(setNewPassword)}
                placeholder="Enter new password"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={handleInputChange(setConfirmPassword)}
                placeholder="Confirm new password"
                disabled={isSubmitting}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !isFormValid}>
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
