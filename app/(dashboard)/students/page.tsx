import { StudentTable } from "@/frontend/students/components/table";

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Students
        </h1>

        <p className="text-muted-foreground">
          Manage student records, search, filter, and
          perform student operations.
        </p>
      </div>

      <StudentTable />
    </div>
  );
}