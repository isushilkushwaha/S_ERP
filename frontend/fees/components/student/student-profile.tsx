'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

export function StudentProfile({ student }: { student: any }) {
  if (!student) return null;
  return (
    <Card className="bg-muted/40">
      <CardContent className="flex items-center gap-4 p-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={student.photo} alt={student.studentName} />
          <AvatarFallback>{student.studentName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm w-full">
          <div>
            <span className="text-muted-foreground block">Student Name</span>
            <span className="font-semibold">{student.studentName}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Admission No</span>
            <span className="font-semibold">{student.admissionNumber}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Class / Section</span>
            <span className="font-semibold">{student.className} - {student.sectionName}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Father's Name</span>
            <span className="font-semibold">{student.fatherName}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}