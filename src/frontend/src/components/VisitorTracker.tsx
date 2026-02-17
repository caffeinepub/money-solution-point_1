import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, LogOut, Download, FileSpreadsheet } from 'lucide-react';
import VisitorForm from './VisitorForm';
import VisitorTable from './VisitorTable';
import AdminLogin from './AdminLogin';
import { useAdminMode } from '../hooks/useAdminMode';
import { useGetVisitorRecords } from '../hooks/useQueries';
import { exportToCSV } from '../utils/exportToCSV';
import { exportToXLSX } from '../utils/exportToXLSX';
import { toast } from 'sonner';

export default function VisitorTracker() {
  const { isAdminMode, logout } = useAdminMode();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { data: records = [], isLoading } = useGetVisitorRecords();

  const handleExportCSV = () => {
    try {
      exportToCSV(records);
      toast.success('CSV file downloaded successfully');
    } catch (error) {
      toast.error('Failed to export CSV');
      console.error('CSV export error:', error);
    }
  };

  const handleExportXLSX = () => {
    try {
      exportToXLSX(records);
      toast.success('Excel file downloaded successfully');
    } catch (error) {
      toast.error('Failed to export Excel file');
      console.error('XLSX export error:', error);
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
            <div className="flex items-center gap-3">
              {isAdminMode ? (
                <>
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium">
                    <Lock className="w-4 h-4" />
                    <span>Admin Mode</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setShowAdminLogin(true)}
                  className="gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Admin Login</span>
                </Button>
              )}
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
                  {isAdminMode && (
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleExportCSV}
                        disabled={isLoading || records.length === 0}
                        className="gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span className="hidden sm:inline">CSV</span>
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleExportXLSX}
                        disabled={isLoading || records.length === 0}
                        className="gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Excel</span>
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <VisitorTable records={records} isLoading={isLoading} />
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

      {/* Admin Login Dialog */}
      <AdminLogin
        open={showAdminLogin}
        onOpenChange={setShowAdminLogin}
      />
    </div>
  );
}
