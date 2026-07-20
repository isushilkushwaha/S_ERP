"use client";

import Link from "next/link";
import { GraduationCap, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function EnrollmentTableEmpty() {
  return (
    <Card>
      <CardContent className="flex h-96 flex-col items-center justify-center space-y-5">
        <GraduationCap className="h-14 w-14 text-muted-foreground" />

        <div className="space-y-2 text-center">
          <h2 className="text-lg font-semibold">
            No Student Enrollments Found
          </h2>

          <p className="max-w-sm text-sm text-muted-foreground">
            No students have been enrolled yet. Create the first enrollment to
            assign a student to an academic year, class, and section.
          </p>
        </div>

        {/* <Button asChild>
          <Link href="/student-enrollments/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Enrollment
          </Link>
        </Button> */}

     <Link href="/student-enrollments/create">
  <Button>
    <Plus className="mr-2 h-4 w-4" />
    Create Enrollment
  </Button>
</Link> 


      </CardContent>
    </Card>
  );
}