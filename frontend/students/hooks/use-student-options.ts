// import { useMemo } from "react";
// import { useStudents } from "../api/students.query";

// export interface StudentOption {
//   id: string;
//   admissionNumber: string;
//   studentCode?: string | null;
//   fullName: string;
// }

// interface UseStudentOptionsProps {
//   search?: string;
//   enabled?: boolean;
// }

// export function useStudentOptions({
//   search,
//   enabled = true,
// }: UseStudentOptionsProps = {}) {
//   const query = useStudents(
//     {
//       page: 1,
//       limit: 100,
//       search,
//     },
//     {
//       enabled,
//     }
//   );

//   const options = useMemo<StudentOption[]>(() => {
//     if (!query.data?.data) return [];

//     return query.data.data.map((student) => ({
//       id: student.id,
//       admissionNumber: student.admissionNumber,
//       studentCode: student.studentCode,
//       fullName: student.fullName,
//     }));
//   }, [query.data]);

//   return {
//     ...query,

//     options,
//   };
// }