import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { EmployeeFormDialog } from '@/components/employees/EmployeeFormDialog';
import { useEmployee, useDeleteEmployee } from '@/hooks/useEmployees';
import { useAuth } from '@/hooks/useAuth';
import { Department } from '@/types/employee';
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Trash2,
  User,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const departmentVariantMap: Record<Department, 'engineering' | 'design' | 'marketing' | 'sales' | 'hr' | 'finance' | 'operations' | 'legal' | 'product'> = {
  Engineering: 'engineering',
  Design: 'design',
  Marketing: 'marketing',
  Sales: 'sales',
  HR: 'hr',
  Finance: 'finance',
  Operations: 'operations',
  Legal: 'legal',
  Product: 'product',
};

export default function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const { user, loading: authLoading } = useAuth();
  const { data: employee, isLoading } = useEmployee(id!);
  const deleteEmployee = useDeleteEmployee();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleDelete = async () => {
    if (id) {
      await deleteEmployee.mutateAsync(id);
      navigate('/');
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !employee) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold">Employee not found</h2>
            <p className="text-muted-foreground mt-2">
              The employee you're looking for doesn't exist.
            </p>
            <Button className="mt-4" onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Directory
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const initials = `${employee.first_name[0]}${employee.last_name[0]}`.toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Directory
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="lg:col-span-1">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-32 w-32 ring-4 ring-primary/10 ring-offset-4">
                    <AvatarImage
                      src={employee.avatar_url || undefined}
                      alt={`${employee.first_name} ${employee.last_name}`}
                    />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-3xl font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <h1 className="text-2xl font-bold mt-6">
                    {employee.first_name} {employee.last_name}
                  </h1>
                  
                  <p className="text-muted-foreground">{employee.job_title}</p>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <Badge variant={departmentVariantMap[employee.department]}>
                      {employee.department}
                    </Badge>
                    {!employee.is_active && (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>

                  <div className="flex gap-2 mt-6 w-full">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsEditOpen(true)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="flex-1">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Employee</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {employee.first_name}{' '}
                            {employee.last_name}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {deleteEmployee.isPending && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Details Cards */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <a
                        href={`mailto:${employee.email}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {employee.email}
                      </a>
                    </div>
                  </div>

                  {employee.phone && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <a
                          href={`tel:${employee.phone}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {employee.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {employee.location && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{employee.location}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Work Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Department</p>
                      <p className="font-medium">{employee.department}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Job Title</p>
                      <p className="font-medium">{employee.job_title}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Hire Date</p>
                      <p className="font-medium">
                        {format(new Date(employee.hire_date), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {employee.bio && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {employee.bio}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      <EmployeeFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        employee={employee}
      />
    </div>
  );
}
