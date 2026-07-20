import { EditStudentPage } from "@/frontend/students/pages";

interface EditStudentPageProps {
  params: Promise<{
    studentId: string;
  }>;
}

export default async function Page({
  params,
}: EditStudentPageProps) {
  const { studentId } = await params;

  return (
    <EditStudentPage
      studentId={studentId}
    />
  );
}