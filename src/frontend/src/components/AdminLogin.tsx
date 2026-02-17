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
import { useAdminLogin } from '../hooks/useQueries';
import { useAdminMode } from '../hooks/useAdminMode';
import { toast } from 'sonner';
import { Loader2, Lock } from 'lucide-react';

interface AdminLoginProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AdminLogin({ open, onOpenChange }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const adminLoginMutation = useAdminLogin();
  const { login } = useAdminMode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      toast.error('Please enter the admin password');
      return;
    }

    try {
      const success = await adminLoginMutation.mutateAsync(password);
      if (success) {
        login();
        toast.success('Admin login successful');
        onOpenChange(false);
        setPassword('');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed: Incorrect password');
      setPassword('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Admin Login
          </DialogTitle>
          <DialogDescription>
            Enter the admin password to access export and management features.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setPassword('');
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={adminLoginMutation.isPending}>
              {adminLoginMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
