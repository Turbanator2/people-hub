import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EmployeeForm } from './EmployeeForm';
import { Employee, EmployeeFormData } from '@/types/employee';
import { useCreateEmployee, useUpdateEmployee } from '@/hooks/useEmployees';

interface EmployeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee;
}

export function EmployeeFormDialog({ open, onOpenChange, employee }: EmployeeFormDialogProps) {
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();

  const isLoading = createEmployee.isPending || updateEmployee.isPending;

  const handleSubmit = async (data: EmployeeFormData) => {
    if (employee) {
      await updateEmployee.mutateAsync({ id: employee.id, employee: data });
    } else {
      await createEmployee.mutateAsync(data);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {employee ? 'Edit Employee' : 'Add New Employee'}
          </DialogTitle>
          <DialogDescription>
            {employee
              ? 'Update the employee information below.'
              : 'Fill in the details to add a new team member.'}
          </DialogDescription>
        </DialogHeader>
        <EmployeeForm
          employee={employee}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
