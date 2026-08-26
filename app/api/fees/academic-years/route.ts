import { NextResponse } from 'next/server';
import { DashboardService } from '@/features/fees/services/dashboard.service';

const dashboardService = new DashboardService();

export async function GET() {
  try {
    const academicYears = await dashboardService.getAcademicYearsList();
    return NextResponse.json({ success: true, data: academicYears }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}