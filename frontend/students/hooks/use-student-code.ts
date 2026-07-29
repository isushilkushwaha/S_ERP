// "use client";

// import { useQuery } from "@tanstack/react-query";

// import { getNextStudentCode } from "../api/student-code.api";

// export function useStudentCode() {
//   return useQuery({
//     queryKey: ["next-student-code"],
//     queryFn: getNextStudentCode,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//     gcTime: 10 * 60 * 1000, // 10 minutes
//     retry: 1,
//   });
// }

"use client";

import { useQuery } from "@tanstack/react-query";

import { getNextStudentCode } from "../api/student-code.api";

export function useStudentCode() {
  return useQuery({
    queryKey: ["next-student-code"],
    queryFn: async () => {
      try {
        const result = await getNextStudentCode();
        console.log("Student Code API:", result);
        return result;
      } catch (error) {
        console.error("Student Code Error:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
}