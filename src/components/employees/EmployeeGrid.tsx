import { Employee } from '@/types/employee';
import { EmployeeCard } from './EmployeeCard';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

interface EmployeeGridProps {
  employees: Employee[];
  isLoading: boolean;
}

export function EmployeeGrid({ employees, isLoading }: EmployeeGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-[200px] rounded-xl bg-muted/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No employees found</h3>
        <p className="text-muted-foreground mt-1">
          Try adjusting your search or filters, or add a new employee.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {employees.map((employee, index) => (
        <EmployeeCard key={employee.id} employee={employee} index={index} />
      ))}
    </div>
  );
}
