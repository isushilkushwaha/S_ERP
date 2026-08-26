import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Installment plan ID is required' }, { status: 400 });
    }

    const plan = await prisma.installmentPlan.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { displayOrder: 'asc' },
          include: {
            feeComponent: { select: { id: true, name: true, code: true } },
          },
        },
        academicYear: { select: { id: true, name: true, code: true } },
        class: { select: { id: true, name: true, code: true } },
      },
    });

    if (!plan) {
      return NextResponse.json({ success: false, error: 'Installment Plan not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: plan }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}