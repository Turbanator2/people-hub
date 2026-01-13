import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { EmployeeGrid } from '@/components/employees/EmployeeGrid';
import { EmployeeFilters } from '@/components/employees/EmployeeFilters';
import { EmployeeFormDialog } from '@/components/employees/EmployeeFormDialog';
import { useEmployees } from '@/hooks/useEmployees';
import { Department } from '@/types/employee';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<Department | 'all'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: employees = [], isLoading } = useEmployees(debouncedSearch, departmentFilter);

  const stats = useMemo(() => {
    const active = employees.filter(e => e.is_active).length;
    const departments = new Set(employees.map(e => e.department)).size;
    return { total: employees.length, active, departments };
  }, [employees]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Employee Directory</h1>
            <p className="text-muted-foreground mt-1">
              Manage and explore your team members
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border bg-card p-6 shadow-card"
            >
              <p className="text-sm font-medium text-muted-foreground">Total Employees gay</p>
              <p className="text-3xl font-bold mt-1">{stats.total}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border bg-card p-6 shadow-card"
            >
              <p className="text-sm font-medium text-muted-foreground">Active</p>
              <p className="text-3xl font-bold mt-1 text-success">{stats.active}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border bg-card p-6 shadow-card"
            >
              <p className="text-sm font-medium text-muted-foreground">Departments</p>
              <p className="text-3xl font-bold mt-1">{stats.departments}</p>
            </motion.div>
          </div>

          <EmployeeFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            departmentFilter={departmentFilter}
            onDepartmentChange={setDepartmentFilter}
            onAddEmployee={() => setIsFormOpen(true)}
          />

          <EmployeeGrid employees={employees} isLoading={isLoading} />
        </motion.div>
      </main>

      <EmployeeFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />
    </div>
  );
}
