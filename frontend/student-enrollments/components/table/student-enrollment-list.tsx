"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { StudentEnrollmentTable } from "./student-enrollment-table";
import { EnrollmentToolbar } from "./enrollment-toolbar";
import { enrollmentColumns } from "./enrollment-columns";

import { useEnrollments } from "../../hooks/use-enrollments";

import {
  StudentEnrollment,
  EnrollmentStatus,
} from "../../types/enrollment";

export function StudentEnrollmentList() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [limit] = useState(10);

  const [academicYearId, setAcademicYearId] =
    useState<string>();

  const [classId, setClassId] =
    useState<string>();

  const [sectionId, setSectionId] =
    useState<string>();

  const [status, setStatus] =
    useState<EnrollmentStatus>();

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useEnrollments({
    page,
    limit,
    search,
    academicYearId,
    classId,
    sectionId,
     enrollmentStatus: status,
  });

  const enrollments: StudentEnrollment[] = useMemo(
    () => data?.data ?? [],
    [data]
  );

  const columns = useMemo(
    () => enrollmentColumns,
    []
  );

  function handleResetFilters() {
    setSearch("");
    setAcademicYearId(undefined);
    setClassId(undefined);
    setSectionId(undefined);
    setStatus(undefined);
    setPage(1);
  }

  function handleCreate() {
    router.push("/student-enrollments/create");
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>
            Student Enrollments
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Manage student admissions,
            promotions and transfers.
          </p>
        </div>

        {/* <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Enrollment
        </Button> */}
      <p className="mt-4 text-sm text-muted-foreground">
  Click <strong>New Enrollment</strong> above to create the first student enrollment.
</p>

      </CardHeader>

      <CardContent>
        <EnrollmentToolbar
          search={search}
          onSearchChange={setSearch}
          academicYearId={academicYearId}
          onAcademicYearChange={setAcademicYearId}
          classId={classId}
          onClassChange={setClassId}
          sectionId={sectionId}
          onSectionChange={setSectionId}
          status={status}
          onStatusChange={setStatus}
          onResetFilters={handleResetFilters}
          onCreate={handleCreate}
        />

        {error ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
            <p className="text-sm text-destructive">
  {error instanceof Error
    ? error.message
    : "Failed to load student enrollments."}
</p>

            <Button
              variant="outline"
              className="mt-4"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        ) : (
          <StudentEnrollmentTable
            columns={columns}
            data={enrollments}
            loading={isLoading || isFetching}
          />
        )}

        {!isLoading &&
          !error &&
          enrollments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <h3 className="text-lg font-semibold">
                No Student Enrollments Found
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Create your first student enrollment.
              </p>

              <Button
                className="mt-6"
                onClick={handleCreate}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Enrollment
              </Button>
            </div>
          )}

        {data && data.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {data.page} of {data.totalPages}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() =>
                  setPage((p) => p - 1)
                }
              >
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={
                  page >= data.totalPages
                }
                onClick={() =>
                  setPage((p) => p + 1)
                }
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}