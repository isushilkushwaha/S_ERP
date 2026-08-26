import { NextRequest, NextResponse } from 'next/server';
import { DashboardService } from '@/features/fees/services/dashboard.service';

const dashboardService = new DashboardService();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = {
      academicYearId: searchParams.get('academicYearId') || undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
      search: searchParams.get('search') || undefined,
      classId: searchParams.get('classId') || undefined,
      sectionId: searchParams.get('sectionId') || undefined,
      feeStatus: searchParams.get('feeStatus') || undefined,
    };

    const data = await dashboardService.getDashboardData(query);
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching fee dashboard:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}