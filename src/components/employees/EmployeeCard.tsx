import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Employee, Department } from '@/types/employee';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmployeeCardProps {
  employee: Employee;
  index: number;
}

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

export function EmployeeCard({ employee, index }: EmployeeCardProps) {
  const initials = `${employee.first_name[0]}${employee.last_name[0]}`.toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link to={`/employee/${employee.id}`}>
        <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-14 w-14 ring-2 ring-primary/10 ring-offset-2">
                <AvatarImage src={employee.avatar_url || undefined} alt={`${employee.first_name} ${employee.last_name}`} />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {employee.first_name} {employee.last_name}
                  </h3>
                  {!employee.is_active && (
                    <Badge variant="secondary" className="shrink-0">Inactive</Badge>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mt-0.5">{employee.job_title}</p>
                
                <Badge 
                  variant={departmentVariantMap[employee.department]} 
                  className="mt-2"
                >
                  {employee.department}
                </Badge>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate">{employee.email}</span>
              </div>
              
              {employee.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{employee.phone}</span>
                </div>
              )}
              
              {employee.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>{employee.location}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
