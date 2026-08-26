import { NextRequest, NextResponse } from 'next/server';
import { StudentFeeService } from '@/features/fees/services/student-fee.service';

const studentFeeService = new StudentFeeService();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: enrollmentId } = await params;
    if (!enrollmentId) {
      return NextResponse.json({ success: false, error: 'Enrollment ID is required' }, { status: 400 });
    }

    const data = await studentFeeService.getStudentFeeProfile(enrollmentId);
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching student fee profile:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}