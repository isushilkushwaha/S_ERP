// // frontend/admissions/components/admission-detail-view.tsx

// "use client";

// import React, { useState, useMemo } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import {
//   ArrowLeft,
//   User,
//   GraduationCap,
//   MapPin,
//   Clock,
//   CheckCircle2,
//   XCircle,
//   DollarSign,
//   Tag,
//   CalendarDays,
//   AlertCircle,
//   Receipt,
//   ShieldCheck,
//   Building2,
//   Bus,
//   Edit,
//   Printer,
//   MoreVertical,
//   Phone,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";

// export interface FeeLedgerItem {
//   id: string;
//   assignedAmount?: number | string;
//   amount?: number | string;
//   paidAmount?: number | string;
//   discountAmount?: number | string;
//   isRequired?: boolean;
//   feeComponent?: {
//     name?: string | null;
//     code?: string | null;
//   } | null;
//   installments?: Array<{
//     id: string;
//     name: string;
//     dueDate: string | Date;
//     assignedAmount: number | string;
//     paidAmount?: number | string;
//   }>;
// }

// export interface EnrollmentDiscountItem {
//   id: string;
//   originalAmount: number | string;
//   appliedAmount: number | string;
//   finalAmount: number | string;
//   remarks?: string | null;
//   discountType: {
//     name: string;
//     code: string;
//   };
// }

// export interface InstallmentPlanItemSummary {
//   id: string;
//   name: string;
//   dueDate?: string | Date | null;
//   assignedAmount?: number | string;
//   value?: number | string;
// }

// export interface AdmissionDetailEnrollment {
//   id: string;
//   admissionNumber: string;
//   rollNumber: number;
//   admissionDate: string | Date;
//   admissionType: string;
//   medium: string;
//   status: string;
//   isHostelRequired: boolean;
//   isTransportRequired: boolean;
//   createdAt: string | Date;
//   remarks?: string | null;
//   student: {
//     id: string;
//     studentCode: string;
//     firstName: string;
//     lastName: string;
//     gender?: string | null;
//     dateOfBirth?: string | Date | null;
//     bloodGroup?: string | null;
//     category?: string | null;
//     religion?: string | null;
//     fatherName?: string | null;
//     fatherMobile?: string | null;
//     motherName?: string | null;
//     motherMobile?: string | null;
//     photo?: string | null;
//     avatarUrl?: string | null;
//     email?: string | null;
//     mobile?: string | null;
//     addressLine1?: string | null;
//     addressLine2?: string | null;
//     city?: string | null;
//     state?: string | null;
//     postalCode?: string | null;
//   };
//   academicYear: { name: string };
//   class: { name: string };
//   section?: { name: string } | null;
//   feeLedgers?: FeeLedgerItem[];
//   feeStructure?: {
//     id: string;
//     notes?: string | null;
//   } | null;
//   enrollmentDiscounts?: EnrollmentDiscountItem[];
//   installmentPlan?: {
//     id: string;
//     name: string;
//     items?: InstallmentPlanItemSummary[];
//   } | null;
// }

// interface AdmissionDetailViewProps {
//   enrollment: AdmissionDetailEnrollment;
// }

// export function AdmissionDetailView({ enrollment }: AdmissionDetailViewProps) {
//   const [activeTab, setActiveTab] = useState<string>("personal");
//   const [hasImageError, setHasImageError] = useState(false);

//   const student = enrollment.student;
//   const fullName = `${student.firstName} ${student.lastName}`.trim();
//   const initials = `${student.firstName[0] || ""}${student.lastName[0] || ""}`.toUpperCase();

//   // Normalize student photo path cleanly
//   const studentPhoto = useMemo(() => {
//     const rawPhoto = student.photo || student.avatarUrl;
//     if (!rawPhoto) return null;
//     if (rawPhoto.startsWith("http://") || rawPhoto.startsWith("https://") || rawPhoto.startsWith("/")) {
//       return rawPhoto;
//     }
//     return `/${rawPhoto}`;
//   }, [student.photo, student.avatarUrl]);

//   const getStatusBadge = (status: string) => {
//     switch (status?.toUpperCase()) {
//       case "ACTIVE":
//         return (
//           <Badge variant="outline" className="text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border-emerald-200 rounded-md px-2.5 py-0.5">
//             ✓ Active Student
//           </Badge>
//         );
//       case "PENDING":
//         return (
//           <Badge variant="outline" className="text-[10px] font-mono font-semibold bg-amber-50 text-amber-700 border-amber-200 rounded-md px-2.5 py-0.5">
//             ○ Pending Review
//           </Badge>
//         );
//       default:
//         return (
//           <Badge variant="outline" className="text-[10px] font-mono font-semibold bg-zinc-100 text-zinc-600 border-zinc-200 rounded-md px-2.5 py-0.5">
//             {status || "Inactive"}
//           </Badge>
//         );
//     }
//   };

//   const feeLedgers = enrollment.feeLedgers || [];
//   const discounts = enrollment.enrollmentDiscounts || [];
//   const installmentPlan = enrollment.installmentPlan;

//   const allInstallments = useMemo(() => {
//     const planItems = installmentPlan?.items || [];
//     if (planItems.length > 0) return planItems;

//     const ledgerInsts = feeLedgers.flatMap((l) => l.installments || []);
//     if (ledgerInsts.length > 0) return ledgerInsts;

//     return [];
//   }, [installmentPlan, feeLedgers]);

//   const totalAssignedAmount = useMemo(() => {
//     return feeLedgers.reduce((sum, item) => {
//       const val = Number(item.assignedAmount ?? item.amount ?? 0);
//       return sum + (isNaN(val) ? 0 : val);
//     }, 0);
//   }, [feeLedgers]);

//   const totalDiscountAmount = useMemo(() => {
//     return discounts.reduce((sum, d) => {
//       const val = Number(d.appliedAmount ?? 0);
//       return sum + (isNaN(val) ? 0 : val);
//     }, 0);
//   }, [discounts]);

//   const netPayable = Math.max(0, totalAssignedAmount - totalDiscountAmount);

//   const totalInstallmentScheduled = useMemo(() => {
//     return allInstallments.reduce((sum, inst: any) => {
//       const val = Number(inst.assignedAmount ?? inst.value ?? 0);
//       return sum + (isNaN(val) ? 0 : val);
//     }, 0);
//   }, [allInstallments]);

//   const remainingBalance = Math.max(0, netPayable - totalInstallmentScheduled);
//   const isScheduleBalanced = Math.abs(netPayable - totalInstallmentScheduled) < 0.01;

//   const fullAddress = [
//     student.addressLine1,
//     student.addressLine2,
//     student.city,
//     student.state,
//     student.postalCode,
//   ].filter(Boolean).join(", ");

//   return (
//     <div className="w-full min-h-[calc(100vh-4rem)] p-4 md:p-6 bg-zinc-50/60 dark:bg-zinc-950/50 space-y-6 max-w-5xl mx-auto text-zinc-900 dark:text-zinc-100">
      
//       {/* 01. PROFILE HEADER */}
//       <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 p-5 space-y-4 shadow-2xs">
//         <div className="flex items-center justify-between">
//           <Link href="/admissions">
//             <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 gap-1.5">
//               <ArrowLeft className="h-3.5 w-3.5" /> Back to Admissions
//             </Button>
//           </Link>
//           <div className="flex items-center gap-1.5">
//             <Button variant="outline" size="sm" className="h-8 text-xs font-medium border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 gap-1">
//               <Edit className="h-3.5 w-3.5 text-zinc-500" /> Edit
//             </Button>
//             <Button variant="outline" size="sm" className="h-8 text-xs font-medium border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 gap-1">
//               <Printer className="h-3.5 w-3.5 text-zinc-500" /> Print
//             </Button>
//             <Button variant="outline" size="icon" className="h-8 w-8 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
//               <MoreVertical className="h-3.5 w-3.5 text-zinc-500" />
//             </Button>
//           </div>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between pt-2">
//           <div className="flex items-center gap-4">
//             <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center relative shadow-2xs">
//               {studentPhoto && !hasImageError ? (
//                 <Image
//                   src={studentPhoto}
//                   alt={fullName}
//                   fill
//                   sizes="80px"
//                   className="object-cover"
//                   onError={() => setHasImageError(true)}
//                   unoptimized
//                 />
//               ) : (
//                 <span className="text-sm font-bold text-zinc-400">{initials}</span>
//               )}
//             </div>
//             <div className="space-y-1">
//               <div className="flex flex-wrap items-center gap-2">
//                 <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
//                   {fullName}
//                 </h1>
//                 {getStatusBadge(enrollment.status)}
//               </div>
//               <p className="text-xs text-zinc-500 font-mono">
//                 Student Code: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{student.studentCode}</span> • Admission No: <span className="font-semibold text-emerald-600">{enrollment.admissionNumber}</span>
//               </p>
//               <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 pt-0.5">
//                 {enrollment.class.name} {enrollment.section ? `• Section ${enrollment.section.name}` : ""} • Session {enrollment.academicYear.name}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 02. PROFILE NAVIGATION TABS */}
//       <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800 rounded-xl px-2 py-1.5 flex items-center gap-1 overflow-x-auto text-xs font-medium shadow-2xs">
//         {[
//           { id: "personal", label: "Personal" },
//           { id: "academic", label: "Academic" },
//           { id: "fees", label: "Fees" },
//           { id: "discount", label: "Discount" },
//           { id: "installments", label: "Installments & Components" },
//         ].map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
//               activeTab === tab.id
//                 ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
//                 : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
//             }`}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* CONDITIONAL SECTION RENDERER */}
//       <div className="space-y-6">

//         {/* 01. PERSONAL INFORMATION */}
//         {activeTab === "personal" && (
//           <section className="space-y-3">
//             <div className="flex items-center justify-between pb-1">
//               <div>
//                 <span className="text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-wider block">01</span>
//                 <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Personal Information</h2>
//                 <p className="text-[11px] text-zinc-500">Student and parent identification for school administration</p>
//               </div>
//             </div>

//             <Card className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 shadow-none bg-white dark:bg-zinc-900">
//               <CardContent className="p-5 space-y-4">
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
//                   <div>
//                     <span className="text-zinc-400 text-[11px] block">Full Name</span>
//                     <span className="font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 block">{fullName}</span>
//                   </div>
//                   <div>
//                     <span className="text-zinc-400 text-[11px] block">Gender</span>
//                     <span className="font-medium text-zinc-800 dark:text-zinc-200 mt-0.5 block uppercase">{student.gender || "—"}</span>
//                   </div>
//                   <div>
//                     <span className="text-zinc-400 text-[11px] block">Date of Birth</span>
//                     <span className="font-medium text-zinc-800 dark:text-zinc-200 mt-0.5 block">
//                       {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
//                     </span>
//                   </div>
//                   <div>
//                     <span className="text-zinc-400 text-[11px] block">Category</span>
//                     <span className="font-medium text-zinc-800 dark:text-zinc-200 mt-0.5 block uppercase">{student.category || "GENERAL"}</span>
//                   </div>
//                   <div>
//                     <span className="text-zinc-400 text-[11px] block">Mobile Number</span>
//                     <span className="font-mono font-medium text-zinc-800 dark:text-zinc-200 mt-0.5 block">{student.mobile || "—"}</span>
//                   </div>
//                   <div>
//                     <span className="text-zinc-400 text-[11px] block">Email ID</span>
//                     <span className="font-medium text-zinc-800 dark:text-zinc-200 mt-0.5 block truncate">{student.email || "—"}</span>
//                   </div>
//                 </div>

//                 <Separator className="bg-zinc-100 dark:bg-zinc-800" />

//                 <div className="space-y-3 pt-1">
//                   <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Parent Information</h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <div className="p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 space-y-1 text-xs">
//                       <span className="text-[10px] font-bold uppercase text-blue-600 block">Father Name</span>
//                       <p className="font-bold text-zinc-900 dark:text-zinc-100">{student.fatherName || "—"}</p>
//                     </div>
//                     <div className="p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 space-y-1 text-xs">
//                       <span className="text-[10px] font-bold uppercase text-purple-600 block">Mother Name</span>
//                       <p className="font-bold text-zinc-900 dark:text-zinc-100">{student.motherName || "—"}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-1.5 pt-1">
//                   <span className="text-zinc-400 text-[11px] block">Full Address</span>
//                   <div className="text-xs flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
//                     <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
//                     <span>{fullAddress || "—"}</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </section>
//         )}

//         {/* 02. ACADEMIC INFORMATION */}
//         {activeTab === "academic" && (
//           <section className="space-y-3">
//             <div className="flex items-center justify-between pb-1">
//               <div>
//                 <span className="text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-wider block">02</span>
//                 <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Academic Information</h2>
//                 <p className="text-[11px] text-zinc-500">Class and enrollment allocations</p>
//               </div>
//             </div>

//             <Card className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 shadow-none bg-white dark:bg-zinc-900">
//               <CardContent className="p-5">
//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
//                   <div>
//                     <span className="text-zinc-400 text-[11px] block">Academic Year</span>
//                     <span className="font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 block">{enrollment.academicYear.name}</span>
//                   </div>
//                   <div>
//                     <span className="text-zinc-400 text-[11px] block">Class</span>
//                     <span className="font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 block">{enrollment.class.name}</span>
//                   </div>
//                   <div>
//                     <span className="text-zinc-400 text-[11px] block">Section</span>
//                     <span className="font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 block">{enrollment.section?.name || "General"}</span>
//                   </div>
//                   <div>
//                     <span className="text-zinc-400 text-[11px] block">Roll Number</span>
//                     <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 block">#{enrollment.rollNumber}</span>
//                   </div>
//                   <div>
//                     <span className="text-zinc-400 text-[11px] block">Admission Number</span>
//                     <span className="font-mono font-semibold text-emerald-600 mt-0.5 block">{enrollment.admissionNumber}</span>
//                   </div>
//                   <div>
//                     <span className="text-zinc-400 text-[11px] block">Admission Type</span>
//                     <span className="font-medium text-zinc-800 dark:text-zinc-200 mt-0.5 uppercase block">{enrollment.admissionType}</span>
//                   </div>
//                   <div>
//                     <span className="text-zinc-400 text-[11px] block">Medium</span>
//                     <span className="font-medium text-zinc-800 dark:text-zinc-200 mt-0.5 uppercase block">{enrollment.medium}</span>
//                   </div>
//                   <div>
//                     <span className="text-zinc-400 text-[11px] block">Hostel Required</span>
//                     <span className="font-medium text-zinc-800 dark:text-zinc-200 mt-0.5 block">{enrollment.isHostelRequired ? "Yes" : "No"}</span>
//                   </div>
//                   <div>
//                     <span className="text-zinc-400 text-[11px] block">Transport Required</span>
//                     <span className="font-medium text-zinc-800 dark:text-zinc-200 mt-0.5 block">{enrollment.isTransportRequired ? "Yes" : "No"}</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </section>
//         )}

//         {/* 03. FEE PROFILE */}
//         {activeTab === "fees" && (
//           <section className="space-y-3">
//             <div className="flex items-center justify-between pb-1">
//               <div>
//                 <span className="text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-wider block">03</span>
//                 <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Fee Profile</h2>
//                 <p className="text-[11px] text-zinc-500">Fees assigned to this admission</p>
//               </div>
//               {feeLedgers.length > 0 && (
//                 <div className="text-right">
//                   <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Total</span>
//                   <span className="font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100">₹{totalAssignedAmount.toLocaleString()}</span>
//                 </div>
//               )}
//             </div>

//             <Card className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 shadow-none bg-white dark:bg-zinc-900">
//               <CardContent className="p-5 space-y-4">
//                 {feeLedgers.length === 0 ? (
//                   <div className="py-6 text-center text-xs text-zinc-500 italic">No fee components assigned.</div>
//                 ) : (
//                   <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
//                     <div className="grid grid-cols-2 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
//                       <span>Fee Component</span>
//                       <span className="text-right">Amount</span>
//                     </div>
//                     <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
//                       {feeLedgers.map((item) => {
//                         const amt = Number(item.assignedAmount ?? item.amount ?? 0);
//                         return (
//                           <div key={item.id} className="grid grid-cols-2 px-4 py-2.5 items-center">
//                             <span className="font-medium text-zinc-900 dark:text-zinc-100">{item.feeComponent?.name || "Fee Component"}</span>
//                             <span className="font-mono text-right font-medium text-zinc-900 dark:text-zinc-100">₹{amt.toLocaleString()}</span>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </section>
//         )}

//         {/* 04. DISCOUNT & CONCESSION */}
//         {activeTab === "discount" && (
//           <section className="space-y-3">
//             <div className="flex items-center justify-between pb-1">
//               <div>
//                 <span className="text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-wider block">04</span>
//                 <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Discount & Concession</h2>
//                 <p className="text-[11px] text-zinc-500">Approved fee concessions</p>
//               </div>
//             </div>

//             <Card className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 shadow-none bg-white dark:bg-zinc-900">
//               <CardContent className="p-5">
//                 {discounts.length > 0 ? (
//                   <div className="space-y-3 text-xs">
//                     {discounts.map((d) => (
//                       <div key={d.id} className="space-y-2">
//                         <div className="flex items-center justify-between py-1 border-b border-zinc-100 dark:border-zinc-800 pb-2">
//                           <div>
//                             <span className="font-medium text-zinc-900 dark:text-zinc-100 block">{d.discountType?.name}</span>
//                             <span className="text-[11px] text-zinc-500">{d.remarks || "Academic concession"}</span>
//                           </div>
//                           <span className="font-mono font-semibold text-amber-600">-₹{Number(d.appliedAmount).toLocaleString()}</span>
//                         </div>
//                       </div>
//                     ))}
//                     <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
//                       <div className="flex justify-between"><span className="text-zinc-500">Original Fee</span><span className="font-mono">₹{totalAssignedAmount.toLocaleString()}</span></div>
//                       <div className="flex justify-between"><span className="text-zinc-500">Discount</span><span className="font-mono text-amber-600">-₹{totalDiscountAmount.toLocaleString()}</span></div>
//                       <div className="flex justify-between col-span-2 pt-1 border-t border-zinc-100 dark:border-zinc-800 font-bold"><span className="text-zinc-700 dark:text-zinc-300">Net Payable</span><span className="font-mono text-emerald-600">₹{netPayable.toLocaleString()}</span></div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="py-6 text-center space-y-1">
//                     <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">No Discount Applied</h3>
//                     <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">No fee concession has been applied to this admission.</p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </section>
//         )}

//         {/* 05. PAYMENT SCHEDULE & CONSOLIDATED MILESTONES WITH COMPONENTS */}
//         {activeTab === "installments" && (
//           <section className="space-y-6">
//             <div className="space-y-3">
//               <div className="flex items-center justify-between pb-1">
//                 <div>
//                   <span className="text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-wider block">05</span>
//                   <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Payment Schedule & Milestone Components</h2>
//                   <p className="text-[11px] text-zinc-500">Installment milestones and their assigned fee component breakdown</p>
//                 </div>
//                 {installmentPlan && (
//                   <Badge variant="outline" className="text-[10px] font-mono bg-zinc-50 text-zinc-700">
//                     {installmentPlan.name}
//                   </Badge>
//                 )}
//               </div>

//               <Card className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 shadow-none bg-white dark:bg-zinc-900">
//                 <CardContent className="p-5">
//                   {feeLedgers.length > 0 ? (
//                     <div className="space-y-4">
//                       {(() => {
//                         const milestoneMap = new Map<string, { name: string; dueDate: any; totalVal: number; components: Array<{ name: string; amount: number }> }>();

//                         feeLedgers.forEach((ledger) => {
//                           const compName = ledger.feeComponent?.name || "Fee Component";
//                           (ledger.installments || []).forEach((inst: any) => {
//                             const key = inst.name;
//                             if (!milestoneMap.has(key)) {
//                               milestoneMap.set(key, {
//                                 name: inst.name,
//                                 dueDate: inst.dueDate,
//                                 totalVal: 0,
//                                 components: [],
//                               });
//                             }
//                             const entry = milestoneMap.get(key)!;
//                             const amt = Number(inst.assignedAmount || 0);
//                             entry.totalVal += amt;
//                             entry.components.push({ name: compName, amount: amt });
//                           });
//                         });

//                         const consolidatedMilestones = Array.from(milestoneMap.values());

//                         if (consolidatedMilestones.length === 0) {
//                           return <div className="py-6 text-center text-xs text-zinc-500 italic">No installment milestones recorded.</div>;
//                         }

//                         return consolidatedMilestones.map((milestone, idx) => {
//                           const dueDateStr = milestone.dueDate
//                             ? new Date(milestone.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
//                             : "As per schedule";

//                           return (
//                             <div key={idx} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 space-y-3">
//                               <div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800 pb-2">
//                                 <div>
//                                   <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
//                                     0{idx + 1} • {milestone.name}
//                                   </span>
//                                   <span className="text-[10px] font-mono text-zinc-500">Due: {dueDateStr}</span>
//                                 </div>
//                                 <span className="font-mono text-xs font-bold text-emerald-600">
//                                   Total: ₹{milestone.totalVal.toLocaleString()}
//                                 </span>
//                               </div>

//                               <div className="space-y-1.5 pt-1">
//                                 <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Assigned Components ({milestone.components.length})</span>
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                                   {milestone.components.map((comp, cIdx) => (
//                                     <div key={cIdx} className="flex items-center justify-between p-2 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs">
//                                       <span className="font-medium text-zinc-800 dark:text-zinc-200">{comp.name}</span>
//                                       <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">₹{comp.amount.toLocaleString()}</span>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             </div>
//                           );
//                         });
//                       })()}
//                     </div>
//                   ) : (
//                     <div className="py-6 text-center space-y-1">
//                       <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">No Installment Milestones Assigned</h3>
//                       <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">This student is currently on a single installment full payment policy.</p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>

//           </section>
//         )}

//       </div>
//     </div>
//   );
// }


// frontend/admissions/components/admission-detail-view.tsx

"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  ArrowLeft,
  CalendarDays,
  Edit,
  MapPin,
  MoreVertical,
  Printer,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/* =========================================================
   TYPES
========================================================= */

export interface FeeLedgerItem {
  id: string;

  assignedAmount?: number | string | null;
  amount?: number | string | null;
  paidAmount?: number | string | null;
  discountAmount?: number | string | null;

  isRequired?: boolean | null;

  feeComponent?: {
    id?: string;
    name?: string | null;
    code?: string | null;
  } | null;
}

/**
 * Admission-time installment milestone.
 *
 * One milestone can contain multiple fee components.
 *
 * Example:
 *
 * Milestone 1
 *   Tuition Fee       ₹2000
 *   Admission Fee     ₹1000
 *   Examination Fee   ₹1000
 *   Transport Fee     ₹1000
 *
 * Total = ₹5000
 */
export interface FeeInstallmentItem {
  id: string;

  sequence: number;

  name: string;

  dueDate: string | Date;

  assignedAmount: number | string;

  paidAmount?: number | string | null;

  status?: string | null;

  components?: Array<{
    id: string;

    assignedAmount: number | string;

    ledger?: {
      id: string;

      feeComponent?: {
        id?: string;
        name?: string | null;
        code?: string | null;
      } | null;
    } | null;
  }>;
}

export interface EnrollmentDiscountItem {
  id: string;

  originalAmount: number | string;

  appliedAmount: number | string;

  finalAmount: number | string;

  remarks?: string | null;

  discountType: {
    name: string;
    code: string;
  };
}

export interface InstallmentPlanItemSummary {
  id: string;

  name: string;

  dueDate?: string | Date | null;

  assignedAmount?: number | string;

  value?: number | string;
}

export interface AdmissionDetailEnrollment {
  id: string;

  admissionNumber: string;

  rollNumber: number;

  admissionDate: string | Date;

  admissionType: string;

  medium: string;

  status: string;

  isHostelRequired: boolean;

  isTransportRequired: boolean;

  createdAt: string | Date;

  remarks?: string | null;

  student: {
    id: string;

    studentCode: string;

    firstName: string;

    middleName?: string | null;

    lastName: string;

    gender?: string | null;

    dateOfBirth?: string | Date | null;

    bloodGroup?: string | null;

    category?: string | null;

    religion?: string | null;

    fatherName?: string | null;

    fatherMobile?: string | null;

    motherName?: string | null;

    motherMobile?: string | null;

    photo?: string | null;

    avatarUrl?: string | null;

    email?: string | null;

    mobile?: string | null;

    addressLine1?: string | null;

    addressLine2?: string | null;

    city?: string | null;

    state?: string | null;

    postalCode?: string | null;
  };

  academicYear: {
    name: string;
  };

  class: {
    name: string;
  };

  section?: {
    name: string;
  } | null;

  feeLedgers?: FeeLedgerItem[];

  /**
   * NEW STRUCTURE
   *
   * Do NOT use feeLedgers[].installments.
   */
  feeInstallments?: FeeInstallmentItem[];

  feeStructure?: {
    id: string;
    notes?: string | null;
  } | null;

  enrollmentDiscounts?: EnrollmentDiscountItem[];

  installmentPlan?: {
    id: string;
    name: string;
    items?: InstallmentPlanItemSummary[];
  } | null;
}

interface AdmissionDetailViewProps {
  enrollment: AdmissionDetailEnrollment;
}

/* =========================================================
   HELPERS
========================================================= */

function formatCurrency(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);

  return `₹${Number.isFinite(amount) ? amount.toLocaleString("en-IN") : "0"}`;
}

function formatDate(
  value: string | Date | null | undefined
) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Calculates the display status of a milestone.
 *
 * Priority:
 *
 * PAID
 * PARTIAL
 * OVERDUE
 * DUE
 * UPCOMING
 */
function getInstallmentStatus(
  installment: FeeInstallmentItem
) {
  const assigned = Number(installment.assignedAmount || 0);

  const paid = Number(installment.paidAmount || 0);

  const balance = Math.max(
    0,
    assigned - paid
  );

  if (assigned > 0 && balance <= 0) {
    return "PAID";
  }

  if (paid > 0 && balance > 0) {
    return "PARTIAL";
  }

  if (!installment.dueDate) {
    return "UPCOMING";
  }

  const dueDate = new Date(installment.dueDate);

  if (Number.isNaN(dueDate.getTime())) {
    return "UPCOMING";
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  dueDate.setHours(0, 0, 0, 0);

  if (dueDate.getTime() < today.getTime()) {
    return "OVERDUE";
  }

  if (dueDate.getTime() === today.getTime()) {
    return "DUE";
  }

  return "UPCOMING";
}

function getStatusClasses(status: string) {
  switch (status.toUpperCase()) {
    case "PAID":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "PARTIAL":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "OVERDUE":
      return "bg-red-50 text-red-700 border-red-200";

    case "DUE":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "UPCOMING":
    default:
      return "bg-zinc-50 text-zinc-600 border-zinc-200";
  }
}

/* =========================================================
   COMPONENT
========================================================= */

export function AdmissionDetailView({
  enrollment,
}: AdmissionDetailViewProps) {
  const [activeTab, setActiveTab] =
    useState<string>("personal");

  const [hasImageError, setHasImageError] =
    useState(false);

  /* =======================================================
     BASIC DATA
  ======================================================= */

  const student = enrollment.student;

  const fullName = [
    student.firstName,
    student.middleName,
    student.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const initials = [
    student.firstName?.[0],
    student.lastName?.[0],
  ]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  const feeLedgers =
    enrollment.feeLedgers || [];

  const feeInstallments =
    enrollment.feeInstallments || [];

  const discounts =
    enrollment.enrollmentDiscounts || [];

  const installmentPlan =
    enrollment.installmentPlan;

  /* =======================================================
     STUDENT PHOTO
  ======================================================= */

  const studentPhoto = useMemo(() => {
    const rawPhoto =
      student.photo ||
      student.avatarUrl;

    if (!rawPhoto) {
      return null;
    }

    if (
      rawPhoto.startsWith("http://") ||
      rawPhoto.startsWith("https://") ||
      rawPhoto.startsWith("/")
    ) {
      return rawPhoto;
    }

    return `/${rawPhoto}`;
  }, [
    student.photo,
    student.avatarUrl,
  ]);

  /* =======================================================
     FEE TOTALS
  ======================================================= */

  const totalAssignedAmount = useMemo(() => {
    return feeLedgers.reduce(
      (sum, ledger) => {
        const amount = Number(
          ledger.assignedAmount ??
            ledger.amount ??
            0
        );

        return (
          sum +
          (Number.isFinite(amount)
            ? amount
            : 0)
        );
      },
      0
    );
  }, [feeLedgers]);

  const totalDiscountAmount = useMemo(() => {
    return discounts.reduce(
      (sum, discount) => {
        const amount = Number(
          discount.appliedAmount || 0
        );

        return (
          sum +
          (Number.isFinite(amount)
            ? amount
            : 0)
        );
      },
      0
    );
  }, [discounts]);

  const netPayable = Math.max(
    0,
    totalAssignedAmount -
      totalDiscountAmount
  );

  /* =======================================================
     INSTALLMENT TOTAL
  ======================================================= */

  const totalInstallmentScheduled =
    useMemo(() => {
      return feeInstallments.reduce(
        (sum, installment) => {
          const amount = Number(
            installment.assignedAmount || 0
          );

          return (
            sum +
            (Number.isFinite(amount)
              ? amount
              : 0)
          );
        },
        0
      );
    }, [feeInstallments]);

  const remainingUnscheduledAmount =
    Math.max(
      0,
      netPayable -
        totalInstallmentScheduled
    );

  const isScheduleBalanced =
    Math.abs(
      netPayable -
        totalInstallmentScheduled
    ) < 0.01;

  /* =======================================================
     ORDER INSTALLMENTS
  ======================================================= */

  const orderedInstallments =
    useMemo(() => {
      return [...feeInstallments].sort(
        (a, b) =>
          Number(a.sequence || 0) -
          Number(b.sequence || 0)
      );
    }, [feeInstallments]);

  /* =======================================================
     ADDRESS
  ======================================================= */

  const fullAddress = [
    student.addressLine1,
    student.addressLine2,
    student.city,
    student.state,
    student.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  /* =======================================================
     STATUS BADGE
  ======================================================= */

  const getStatusBadge = (
    status: string
  ) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return (
          <Badge
            variant="outline"
            className="text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border-emerald-200 rounded-md px-2.5 py-0.5"
          >
            ✓ Active Student
          </Badge>
        );

      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="text-[10px] font-mono font-semibold bg-amber-50 text-amber-700 border-amber-200 rounded-md px-2.5 py-0.5"
          >
            ○ Pending Review
          </Badge>
        );

      default:
        return (
          <Badge
            variant="outline"
            className="text-[10px] font-mono font-semibold bg-zinc-100 text-zinc-600 border-zinc-200 rounded-md px-2.5 py-0.5"
          >
            {status || "Inactive"}
          </Badge>
        );
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 md:p-6 bg-zinc-50/60 dark:bg-zinc-950/50 space-y-6 max-w-5xl mx-auto text-zinc-900 dark:text-zinc-100">

      {/* =================================================
          01. PROFILE HEADER
      ================================================= */}

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800 p-5 space-y-4 shadow-2xs">

        <div className="flex items-center justify-between">

          <Link href="/admissions">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Admissions
            </Button>
          </Link>

          <div className="flex items-center gap-1.5">

            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-medium border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 gap-1"
            >
              <Edit className="h-3.5 w-3.5 text-zinc-500" />
              Edit
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-medium border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 gap-1"
            >
              <Printer className="h-3.5 w-3.5 text-zinc-500" />
              Print
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
            >
              <MoreVertical className="h-3.5 w-3.5 text-zinc-500" />
            </Button>

          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between pt-2">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center relative shadow-2xs">

              {studentPhoto &&
              !hasImageError ? (
                <Image
                  src={studentPhoto}
                  alt={fullName}
                  fill
                  sizes="80px"
                  className="object-cover"
                  onError={() =>
                    setHasImageError(true)
                  }
                  unoptimized
                />
              ) : (
                <span className="text-sm font-bold text-zinc-400">
                  {initials}
                </span>
              )}

            </div>

            <div className="space-y-1">

              <div className="flex flex-wrap items-center gap-2">

                <h1 className="text-xl font-bold tracking-tight">
                  {fullName}
                </h1>

                {getStatusBadge(
                  enrollment.status
                )}

              </div>

              <p className="text-xs text-zinc-500 font-mono">
                Student Code:{" "}
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {student.studentCode}
                </span>

                {" • "}

                Admission No:{" "}
                <span className="font-semibold text-emerald-600">
                  {enrollment.admissionNumber}
                </span>
              </p>

              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 pt-0.5">
                {enrollment.class.name}

                {enrollment.section
                  ? ` • Section ${enrollment.section.name}`
                  : ""}

                {" • Session "}

                {enrollment.academicYear.name}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          02. NAVIGATION
      ================================================= */}

      <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800 rounded-xl px-2 py-1.5 flex items-center gap-1 overflow-x-auto text-xs font-medium shadow-2xs">

        {[
          {
            id: "personal",
            label: "Personal",
          },
          {
            id: "academic",
            label: "Academic",
          },
          {
            id: "fees",
            label: "Fees",
          },
          {
            id: "discount",
            label: "Discount",
          },
          {
            id: "installments",
            label: "Installments",
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() =>
              setActiveTab(tab.id)
            }
            className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            {tab.label}
          </button>
        ))}

      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="space-y-6">

        {/* =================================================
            PERSONAL
        ================================================= */}

        {activeTab === "personal" && (
          <section className="space-y-3">

            <div>
              <span className="text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-wider block">
                01
              </span>

              <h2 className="text-sm font-bold">
                Personal Information
              </h2>

              <p className="text-[11px] text-zinc-500">
                Student and parent information
              </p>
            </div>

            <Card className="rounded-xl border shadow-none bg-white dark:bg-zinc-900">

              <CardContent className="p-5 space-y-4">

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">

                  <div>
                    <span className="text-zinc-400 text-[11px] block">
                      Full Name
                    </span>
                    <span className="font-semibold block mt-0.5">
                      {fullName}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-400 text-[11px] block">
                      Gender
                    </span>
                    <span className="font-medium block mt-0.5 uppercase">
                      {student.gender || "—"}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-400 text-[11px] block">
                      Date of Birth
                    </span>
                    <span className="font-medium block mt-0.5">
                      {student.dateOfBirth
                        ? formatDate(
                            student.dateOfBirth
                          )
                        : "—"}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-400 text-[11px] block">
                      Category
                    </span>
                    <span className="font-medium block mt-0.5 uppercase">
                      {student.category ||
                        "GENERAL"}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-400 text-[11px] block">
                      Mobile Number
                    </span>
                    <span className="font-mono font-medium block mt-0.5">
                      {student.mobile || "—"}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-400 text-[11px] block">
                      Email ID
                    </span>
                    <span className="font-medium block mt-0.5 truncate">
                      {student.email || "—"}
                    </span>
                  </div>

                </div>

                <Separator />

                <div className="space-y-3">

                  <h3 className="text-xs font-semibold uppercase tracking-wider">
                    Parent Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    <div className="p-3.5 rounded-xl border bg-zinc-50 dark:bg-zinc-800/40 space-y-1 text-xs">

                      <span className="text-[10px] font-bold uppercase text-blue-600">
                        Father Name
                      </span>

                      <p className="font-bold">
                        {student.fatherName || "—"}
                      </p>

                      {student.fatherMobile && (
                        <p className="text-zinc-500">
                          {student.fatherMobile}
                        </p>
                      )}

                    </div>

                    <div className="p-3.5 rounded-xl border bg-zinc-50 dark:bg-zinc-800/40 space-y-1 text-xs">

                      <span className="text-[10px] font-bold uppercase text-purple-600">
                        Mother Name
                      </span>

                      <p className="font-bold">
                        {student.motherName || "—"}
                      </p>

                      {student.motherMobile && (
                        <p className="text-zinc-500">
                          {student.motherMobile}
                        </p>
                      )}

                    </div>

                  </div>

                </div>

                <div className="space-y-1.5">

                  <span className="text-zinc-400 text-[11px] block">
                    Full Address
                  </span>

                  <div className="text-xs flex items-start gap-2 text-zinc-700 dark:text-zinc-300">

                    <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />

                    <span>
                      {fullAddress || "—"}
                    </span>

                  </div>

                </div>

              </CardContent>

            </Card>

          </section>
        )}

        {/* =================================================
            ACADEMIC
        ================================================= */}

        {activeTab === "academic" && (
          <section className="space-y-3">

            <div>
              <span className="text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-wider block">
                02
              </span>

              <h2 className="text-sm font-bold">
                Academic Information
              </h2>

              <p className="text-[11px] text-zinc-500">
                Class and enrollment information
              </p>
            </div>

            <Card className="rounded-xl border shadow-none bg-white dark:bg-zinc-900">

              <CardContent className="p-5">

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">

                  <div>
                    <span className="text-zinc-400 text-[11px] block">
                      Academic Year
                    </span>
                    <span className="font-semibold block mt-0.5">
                      {enrollment.academicYear.name}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-400 text-[11px] block">
                      Class
                    </span>
                    <span className="font-semibold block mt-0.5">
                      {enrollment.class.name}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-400 text-[11px] block">
                      Section
                    </span>
                    <span className="font-semibold block mt-0.5">
                      {enrollment.section?.name ||
                        "General"}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-400 text-[11px] block">
                      Roll Number
                    </span>
                    <span className="font-mono font-semibold block mt-0.5">
                      #{enrollment.rollNumber}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-400 text-[11px] block">
                      Admission Number
                    </span>
                    <span className="font-mono font-semibold text-emerald-600 block mt-0.5">
                      {enrollment.admissionNumber}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-400 text-[11px] block">
                      Admission Type
                    </span>
                    <span className="font-medium block mt-0.5 uppercase">
                      {enrollment.admissionType}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-400 text-[11px] block">
                      Medium
                    </span>
                    <span className="font-medium block mt-0.5 uppercase">
                      {enrollment.medium}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-400 text-[11px] block">
                      Hostel Required
                    </span>
                    <span className="font-medium block mt-0.5">
                      {enrollment.isHostelRequired
                        ? "Yes"
                        : "No"}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-400 text-[11px] block">
                      Transport Required
                    </span>
                    <span className="font-medium block mt-0.5">
                      {enrollment.isTransportRequired
                        ? "Yes"
                        : "No"}
                    </span>
                  </div>

                </div>

              </CardContent>

            </Card>

          </section>
        )}

        {/* =================================================
            FEES
        ================================================= */}

        {activeTab === "fees" && (
          <section className="space-y-3">

            <div className="flex items-center justify-between">

              <div>
                <span className="text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-wider block">
                  03
                </span>

                <h2 className="text-sm font-bold">
                  Fee Profile
                </h2>

                <p className="text-[11px] text-zinc-500">
                  Fees assigned during admission
                </p>
              </div>

              <div className="text-right">

                <span className="text-[10px] text-zinc-400 uppercase font-semibold block">
                  Total
                </span>

                <span className="font-mono font-bold text-xs">
                  {formatCurrency(
                    totalAssignedAmount
                  )}
                </span>

              </div>

            </div>

            <Card className="rounded-xl border shadow-none bg-white dark:bg-zinc-900">

              <CardContent className="p-5">

                {feeLedgers.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-500">
                    No fee components assigned.
                  </div>
                ) : (
                  <div className="rounded-lg border overflow-hidden">

                    <div className="grid grid-cols-2 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2 text-[10px] font-semibold text-zinc-500 uppercase">

                      <span>
                        Fee Component
                      </span>

                      <span className="text-right">
                        Assigned
                      </span>

                    </div>

                    <div className="divide-y text-xs">

                      {feeLedgers.map(
                        (ledger) => {

                          const amount =
                            Number(
                              ledger.assignedAmount ??
                                ledger.amount ??
                                0
                            );

                          return (
                            <div
                              key={ledger.id}
                              className="grid grid-cols-2 px-4 py-3"
                            >

                              <span className="font-medium">
                                {ledger.feeComponent
                                  ?.name ||
                                  "Fee Component"}
                              </span>

                              <span className="text-right font-mono font-semibold">
                                {formatCurrency(
                                  amount
                                )}
                              </span>

                            </div>
                          );
                        }
                      )}

                    </div>

                  </div>
                )}

              </CardContent>

            </Card>

          </section>
        )}

        {/* =================================================
            DISCOUNT
        ================================================= */}

        {activeTab === "discount" && (
          <section className="space-y-3">

            <div>
              <span className="text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-wider block">
                04
              </span>

              <h2 className="text-sm font-bold">
                Discount & Concession
              </h2>

              <p className="text-[11px] text-zinc-500">
                Approved fee concessions
              </p>
            </div>

            <Card className="rounded-xl border shadow-none bg-white dark:bg-zinc-900">

              <CardContent className="p-5">

                {discounts.length === 0 ? (
                  <div className="py-8 text-center">

                    <h3 className="text-xs font-semibold">
                      No Discount Applied
                    </h3>

                    <p className="text-[11px] text-zinc-500 mt-1">
                      No fee concession has been applied.
                    </p>

                  </div>
                ) : (
                  <div className="space-y-4">

                    {discounts.map(
                      (discount) => (
                        <div
                          key={discount.id}
                          className="flex items-center justify-between border-b pb-3"
                        >

                          <div>

                            <span className="font-medium text-xs block">
                              {
                                discount
                                  .discountType
                                  ?.name
                              }
                            </span>

                            <span className="text-[11px] text-zinc-500">
                              {discount.remarks ||
                                "Academic concession"}
                            </span>

                          </div>

                          <span className="font-mono font-semibold text-amber-600 text-xs">
                            -
                            {formatCurrency(
                              discount.appliedAmount
                            )}
                          </span>

                        </div>
                      )
                    )}

                    <div className="space-y-2 text-xs">

                      <div className="flex justify-between">
                        <span className="text-zinc-500">
                          Original Fee
                        </span>

                        <span className="font-mono">
                          {formatCurrency(
                            totalAssignedAmount
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-zinc-500">
                          Discount
                        </span>

                        <span className="font-mono text-amber-600">
                          -
                          {formatCurrency(
                            totalDiscountAmount
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between border-t pt-2 font-bold">

                        <span>
                          Net Payable
                        </span>

                        <span className="font-mono text-emerald-600">
                          {formatCurrency(
                            netPayable
                          )}
                        </span>

                      </div>

                    </div>

                  </div>
                )}

              </CardContent>

            </Card>

          </section>
        )}

        {/* =================================================
            INSTALLMENTS
        ================================================= */}

        {activeTab === "installments" && (
          <section className="space-y-4">

            {/* HEADER */}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

              <div>

                <span className="text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-wider block">
                  05
                </span>

                <h2 className="text-sm font-bold">
                  Installment Schedule
                </h2>

                <p className="text-[11px] text-zinc-500">
                  Admission-time payment milestones and assigned fee components
                </p>

              </div>

              {installmentPlan && (
                <Badge
                  variant="outline"
                  className="text-[10px] font-mono"
                >
                  {installmentPlan.name}
                </Badge>
              )}

            </div>

            {/* INSTALLMENT CARD */}

            <Card className="rounded-xl border shadow-none bg-white dark:bg-zinc-900">

              <CardContent className="p-5">

                {orderedInstallments.length === 0 ? (
                  <div className="py-10 text-center">

                    <CalendarDays className="h-8 w-8 mx-auto text-zinc-300 mb-2" />

                    <h3 className="text-xs font-semibold">
                      No Installment Milestones
                    </h3>

                    <p className="text-[11px] text-zinc-500 mt-1">
                      No admission-time payment milestones were assigned.
                    </p>

                  </div>
                ) : (
                  <div className="space-y-4">

                    {orderedInstallments.map(
                      (milestone) => {

                        const assigned =
                          Number(
                            milestone.assignedAmount ||
                              0
                          );

                        const paid =
                          Number(
                            milestone.paidAmount ||
                              0
                          );

                        const balance =
                          Math.max(
                            0,
                            assigned - paid
                          );

                        const status =
                          getInstallmentStatus(
                            milestone
                          );

                        const components =
                          milestone.components ||
                          [];

                        return (
                          <div
                            key={milestone.id}
                            className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
                          >

                            {/* =========================
                                MILESTONE HEADER
                            ========================= */}

                            <div className="p-4 bg-zinc-50/70 dark:bg-zinc-800/40 border-b border-zinc-200 dark:border-zinc-800">

                              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                                <div className="flex items-start gap-3">

                                  {/* SEQUENCE */}

                                  <div className="h-9 w-9 shrink-0 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center text-xs font-bold">
                                    {milestone.sequence}
                                  </div>

                                  <div>

                                    <h3 className="text-sm font-bold">
                                      {milestone.name}
                                    </h3>

                                    <div className="flex flex-wrap items-center gap-2 mt-1">

                                      <span className="text-[11px] text-zinc-500 flex items-center gap-1">

                                        <CalendarDays className="h-3 w-3" />

                                        Due{" "}
                                        {formatDate(
                                          milestone.dueDate
                                        )}

                                      </span>

                                      <Badge
                                        variant="outline"
                                        className={`text-[9px] px-2 py-0.5 ${getStatusClasses(
                                          status
                                        )}`}
                                      >
                                        {status}
                                      </Badge>

                                    </div>

                                  </div>

                                </div>

                                {/* AMOUNTS */}

                                <div className="grid grid-cols-3 gap-5">

                                  <div className="text-right">

                                    <span className="block text-[9px] uppercase text-zinc-400">
                                      Assigned
                                    </span>

                                    <span className="text-xs font-mono font-bold">
                                      {formatCurrency(
                                        assigned
                                      )}
                                    </span>

                                  </div>

                                  <div className="text-right">

                                    <span className="block text-[9px] uppercase text-zinc-400">
                                      Paid
                                    </span>

                                    <span className="text-xs font-mono font-bold text-emerald-600">
                                      {formatCurrency(
                                        paid
                                      )}
                                    </span>

                                  </div>

                                  <div className="text-right">

                                    <span className="block text-[9px] uppercase text-zinc-400">
                                      Balance
                                    </span>

                                    <span className="text-xs font-mono font-bold text-rose-600">
                                      {formatCurrency(
                                        balance
                                      )}
                                    </span>

                                  </div>

                                </div>

                              </div>

                            </div>

                            {/* =========================
                                COMPONENTS
                            ========================= */}

                            <div className="p-4">

                              <div className="flex items-center justify-between mb-2">

                                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                                  Assigned Fee Components
                                </span>

                                <span className="text-[10px] text-zinc-400">
                                  {components.length}{" "}
                                  {components.length ===
                                  1
                                    ? "component"
                                    : "components"}
                                </span>

                              </div>

                              {components.length ===
                              0 ? (
                                <div className="rounded-lg border border-dashed p-4 text-center">

                                  <p className="text-[11px] text-zinc-500">
                                    No fee components are attached to this milestone.
                                  </p>

                                </div>
                              ) : (
                                <div className="rounded-lg border overflow-hidden">

                                  {components.map(
                                    (component) => {

                                      const componentName =
                                        component
                                          .ledger
                                          ?.feeComponent
                                          ?.name ||
                                        "Fee Component";

                                      const componentAmount =
                                        Number(
                                          component.assignedAmount ||
                                            0
                                        );

                                      return (
                                        <div
                                          key={
                                            component.id
                                          }
                                          className="flex items-center justify-between px-3 py-3 border-b last:border-b-0 bg-white dark:bg-zinc-900"
                                        >

                                          <div className="flex items-center gap-2">

                                            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />

                                            <div>

                                              <span className="text-xs font-medium block">
                                                {
                                                  componentName
                                                }
                                              </span>

                                              {component
                                                .ledger
                                                ?.feeComponent
                                                ?.code && (
                                                <span className="text-[9px] text-zinc-400 font-mono">
                                                  {
                                                    component
                                                      .ledger
                                                      .feeComponent
                                                      .code
                                                  }
                                                </span>
                                              )}

                                            </div>

                                          </div>

                                          <span className="text-xs font-mono font-semibold">
                                            {formatCurrency(
                                              componentAmount
                                            )}
                                          </span>

                                        </div>
                                      );
                                    }
                                  )}

                                </div>
                              )}

                            </div>

                          </div>
                        );
                      }
                    )}

                    {/* =============================
                        SCHEDULE SUMMARY
                    ============================= */}

                    <div className="border-t pt-4">

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                        <div>

                          <span className="text-[10px] uppercase font-semibold text-zinc-400 block">
                            Total Scheduled
                          </span>

                          <span className="text-[11px] text-zinc-500">
                            Admission-time installment assignment
                          </span>

                        </div>

                        <div className="text-right">

                          <span className="font-mono text-sm font-bold">
                            {formatCurrency(
                              totalInstallmentScheduled
                            )}
                          </span>

                          {isScheduleBalanced ? (
                            <p className="text-[10px] text-emerald-600 mt-0.5">
                              Schedule fully balanced
                            </p>
                          ) : (
                            <p className="text-[10px] text-amber-600 mt-0.5">
                              {formatCurrency(
                                remainingUnscheduledAmount
                              )}{" "}
                              not scheduled
                            </p>
                          )}

                        </div>

                      </div>

                    </div>

                  </div>
                )}

              </CardContent>

            </Card>

          </section>
        )}

      </div>
    </div>
  );
}