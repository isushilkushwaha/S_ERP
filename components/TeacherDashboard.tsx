import { DashboardCard } from "./DashboardCard";

export function TeacherDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Teacher Dashboard
        </h1>

        <p className="text-gray-500">
          Welcome back.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Students"
          value="0"
          description="Assigned students"
        />

        <DashboardCard
          title="Attendance"
          value="0%"
          description="Today's attendance"
        />

        <DashboardCard
          title="Examinations"
          value="0"
          description="Upcoming exams"
        />

        <DashboardCard
          title="Profile"
          value="✓"
          description="Profile status"
        />
      </div>
    </div>
  );
}