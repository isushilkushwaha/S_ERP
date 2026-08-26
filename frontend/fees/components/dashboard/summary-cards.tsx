'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee, Users, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface SummaryCardsProps {
  summary: {
    totalStudents: number;
    totalAssignedAmount: number;
    totalCollectedAmount: number;
    totalDueAmount: number;
    todayCollection: number;
  };
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalStudents}</div>
          <p className="text-xs text-muted-foreground">Active enrollments</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Assigned</CardTitle>
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{summary.totalAssignedAmount.toLocaleString('en-IN')}</div>
          <p className="text-xs text-muted-foreground">Target revenue</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Collected</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">₹{summary.totalCollectedAmount.toLocaleString('en-IN')}</div>
          <p className="text-xs text-muted-foreground">Realized fee</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Due</CardTitle>
          <AlertCircle className="h-4 w-4 text-rose-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-600">₹{summary.totalDueAmount.toLocaleString('en-IN')}</div>
          <p className="text-xs text-muted-foreground">Outstanding balance</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Collection</CardTitle>
          <Clock className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">₹{summary.todayCollection.toLocaleString('en-IN')}</div>
          <p className="text-xs text-muted-foreground">Collected today</p>
        </CardContent>
      </Card>
    </div>
  );
}