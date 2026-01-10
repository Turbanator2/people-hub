export type Department = 
  | 'Engineering' 
  | 'Design' 
  | 'Marketing' 
  | 'Sales' 
  | 'HR' 
  | 'Finance' 
  | 'Operations' 
  | 'Legal' 
  | 'Product';

export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  department: Department;
  job_title: string;
  hire_date: string;
  avatar_url: string | null;
  location: string | null;
  bio: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmployeeFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department: Department;
  job_title: string;
  hire_date: string;
  avatar_url?: string;
  location?: string;
  bio?: string;
  is_active: boolean;
}

export const DEPARTMENTS: Department[] = [
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
  'Legal',
  'Product'
];

export const DEPARTMENT_COLORS: Record<Department, string> = {
  Engineering: 'bg-blue-100 text-blue-800',
  Design: 'bg-purple-100 text-purple-800',
  Marketing: 'bg-pink-100 text-pink-800',
  Sales: 'bg-green-100 text-green-800',
  HR: 'bg-yellow-100 text-yellow-800',
  Finance: 'bg-emerald-100 text-emerald-800',
  Operations: 'bg-orange-100 text-orange-800',
  Legal: 'bg-slate-100 text-slate-800',
  Product: 'bg-indigo-100 text-indigo-800',
};
