import { ViewStudentPage } from "@/frontend/students/pages/view-student-page";

interface PageProps {
  params: Promise<{
    studentId: string;
  }>;
}

export default async function Page({
  params,
}: PageProps) {
  const { studentId } = await params;

  return <ViewStudentPage studentId={studentId} />;
}