import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, Lock, Unlock, KeyRound } from 'lucide-react';
import VisitorForm from './VisitorForm';
import VisitorTable from './VisitorTable';
import AdminLogin from './AdminLogin';
import ChangeAdminPasswordDialog from './ChangeAdminPasswordDialog';
import { useGetVisitorRecords, useExportVisitorRecords, useChangeAdminPassword } from '../hooks/useQueries';
import { useAdminMode } from '../hooks/useAdminMode';
import { exportToCSV } from '../utils/exportToCSV';
import { exportToXLSX } from '../utils/exportToXLSX';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useQueryClient } from '@tanstack/react-query';

export default function VisitorTracker() {
  const queryClient = useQueryClient();
  const { isUnlocked, isLoading: adminLoading, unlock, lock } = useAdminMode();
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const { data: records = [], isLoading } = useGetVisitorRecords(isUnlocked);
  const { refetch: refetchExportData } = useExportVisitorRecords();
  const changePasswordMutation = useChangeAdminPassword();

  const handleExportCSV = async () => {
    if (!isUnlocked) {
      toast.error('Admin access required to export data');
      return;
    }
    
    setIsExporting(true);
    try {
      const { data: exportRecords } = await refetchExportData();
      if (!exportRecords || exportRecords.length === 0) {
        toast.error('No records available to export');
        return;
      }
      exportToCSV(exportRecords);
      toast.success('CSV file downloaded successfully');
    } catch (error) {
      toast.error('Failed to export CSV');
      console.error('CSV export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportXLSX = async () => {
    if (!isUnlocked) {
      toast.error('Admin access required to export data');
      return;
    }
    
    setIsExporting(true);
    try {
      const { data: exportRecords } = await refetchExportData();
      if (!exportRecords || exportRecords.length === 0) {
        toast.error('No records available to export');
        return;
      }
      exportToXLSX(exportRecords);
      toast.success('Excel file downloaded successfully');
    } catch (error) {
      toast.error('Failed to export Excel file');
      console.error('XLSX export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleAdminToggle = () => {
    if (isUnlocked) {
      lock();
      // Clear admin-only cached data
      queryClient.removeQueries({ queryKey: ['visitorRecords'] });
      queryClient.removeQueries({ queryKey: ['exportVisitorRecords'] });
      toast.success('Admin mode locked');
    } else {
      setShowAdminDialog(true);
    }
  };

  const handleUnlock = async (password: string): Promise<boolean> => {
    try {
      const success = await unlock(password);
      if (success) {
        toast.success('Admin access granted');
        // Trigger immediate refetch of visitor records after successful unlock
        queryClient.invalidateQueries({ queryKey: ['visitorRecords'] });
        return true;
      } else {
        toast.error('Incorrect password. Access denied.');
        return false;
      }
    } catch (error) {
      console.error('Unlock error:', error);
      toast.error('Failed to verify password. Please try again.');
      return false;
    }
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const result = await changePasswordMutation.mutateAsync({
        oldPassword: currentPassword,
        newPassword: newPassword,
      });

      if (result) {
        toast.success('Password updated successfully. Your new password will be required for future Admin unlocks.');
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                MONEY SOLUTION POINT
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Daily Banker Visitor Tracker
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isUnlocked && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowChangePasswordDialog(true)}
                  className="gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span className="hidden sm:inline">Change Password</span>
                </Button>
              )}
              <Button
                variant={isUnlocked ? 'default' : 'outline'}
                size="sm"
                onClick={handleAdminToggle}
                disabled={adminLoading}
                className="gap-2"
              >
                {isUnlocked ? (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span className="hidden sm:inline">Lock Admin</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span className="hidden sm:inline">Unlock Admin</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Visitor Entry Form */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-slate-200 dark:border-slate-800">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="text-lg font-semibold">
                  New Visitor Entry
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <VisitorForm />
              </CardContent>
            </Card>
          </div>

          {/* Visitor Records Table */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-slate-200 dark:border-slate-800">
              <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Visitor Records
                  </CardTitle>
                  {isUnlocked && (
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleExportCSV}
                        disabled={isLoading || isExporting || records.length === 0}
                        className="gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span className="hidden sm:inline">
                          {isExporting ? 'Exporting...' : 'CSV'}
                        </span>
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleExportXLSX}
                        disabled={isLoading || isExporting || records.length === 0}
                        className="gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">
                          {isExporting ? 'Exporting...' : 'Excel'}
                        </span>
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {!isUnlocked ? (
                  <Alert className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
                    <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <AlertDescription className="text-slate-700 dark:text-slate-300">
                      Visitor records are admin-only. Click "Unlock Admin" in the header to view, export, and edit records.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <VisitorTable records={records} isLoading={isLoading} isAdmin={isUnlocked} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
            <p>
              © {new Date().getFullYear()} Money Solution Point. Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'msp-tracker'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      <AdminLogin
        open={showAdminDialog}
        onOpenChange={setShowAdminDialog}
        onUnlock={handleUnlock}
      />

      <ChangeAdminPasswordDialog
        open={showChangePasswordDialog}
        onOpenChange={setShowChangePasswordDialog}
        onSubmit={handleChangePassword}
      />
    </div>
  );
}
