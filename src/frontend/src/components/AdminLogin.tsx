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
import { Lock } from 'lucide-react';

interface AdminLoginProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnlock: (password: string) => Promise<boolean>;
}

export default function AdminLogin({ open, onOpenChange, onUnlock }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Trim whitespace before sending to backend
      const trimmedPassword = password.trim();
      const success = await onUnlock(trimmedPassword);
      
      if (success) {
        setPassword('');
        onOpenChange(false);
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch (error) {
      console.error('Unlock error:', error);
      setError('Failed to verify password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setPassword('');
      setError('');
    }
    onOpenChange(newOpen);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
              <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <DialogTitle>Admin Access</DialogTitle>
          </div>
          <DialogDescription>
            Enter the admin password to access visitor records, export data, and edit entries.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter admin password"
                autoFocus
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
            <Button type="submit" disabled={isSubmitting || !password.trim()}>
              {isSubmitting ? 'Verifying...' : 'Unlock Admin'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
