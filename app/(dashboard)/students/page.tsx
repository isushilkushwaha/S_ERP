import { StudentTable } from "@/frontend/students/components/table";
import { StudentsPageHeader } from "@/frontend/students/components/table/students-page-header";

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      {/* Sticky Top Header */}
      <StudentsPageHeader />

      {/* Main Student Data Table */}
      <StudentTable />
    </div>
  );
}