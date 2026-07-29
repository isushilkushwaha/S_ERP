"use client";

import { UseFormReturn } from "react-hook-form";

import { StudentFormValues } from "../schemas/student-form.schema";

import { ReviewCard } from "./review/review-card";
import { ReviewItem } from "./review/review-item";

interface ReviewInformationProps {
  form: UseFormReturn<StudentFormValues>;
}

export function ReviewInformation({
  form,
}: ReviewInformationProps) {
  const values = form.getValues();

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <ReviewCard title="Personal Information">
        <ReviewItem label="EMIS Number" value={values.emisNumber} />
        <ReviewItem label="APAAR ID" value={values.apaarId} />
        <ReviewItem label="PEN Number" value={values.penNumber} />

        <ReviewItem label="First Name" value={values.firstName} />
        <ReviewItem label="Middle Name" value={values.middleName} />
        <ReviewItem label="Last Name" value={values.lastName} />

        <ReviewItem label="Gender" value={values.gender} />
        <ReviewItem label="Date of Birth" value={values.dateOfBirth} />

        <ReviewItem label="Blood Group" value={values.bloodGroup} />
        <ReviewItem label="Religion" value={values.religion} />
        <ReviewItem label="Category" value={values.category} />
        <ReviewItem label="Caste" value={values.caste} />
        <ReviewItem label="Nationality" value={values.nationality} />

        <ReviewItem
          label="Aadhaar Number"
          value={values.aadhaarNumber}
        />

        <ReviewItem
          label="Birth Certificate No."
          value={values.birthCertificateNo}
        />

        <ReviewItem label="Email" value={values.email} />
        <ReviewItem label="Mobile" value={values.mobile} />

        <ReviewItem
          label="Previous School"
          value={values.previousSchool}
        />

        <ReviewItem label="Remarks" value={values.remarks} />
      </ReviewCard>

      {/* Parent Information */}
      <ReviewCard title="Parent Information">
        <ReviewItem label="Father Name" value={values.fatherName} />

        <ReviewItem
          label="Father Occupation"
          value={values.fatherOccupation}
        />

        <ReviewItem
          label="Father Mobile"
          value={values.fatherMobile}
        />

        <ReviewItem
          label="Father Email"
          value={values.fatherEmail}
        />

        <ReviewItem label="Mother Name" value={values.motherName} />

        <ReviewItem
          label="Mother Occupation"
          value={values.motherOccupation}
        />

        <ReviewItem
          label="Mother Mobile"
          value={values.motherMobile}
        />

        <ReviewItem
          label="Mother Email"
          value={values.motherEmail}
        />

        <ReviewItem
          label="Guardian Name"
          value={values.guardianName}
        />

        <ReviewItem
          label="Guardian Relation"
          value={values.guardianRelation}
        />

        <ReviewItem
          label="Guardian Mobile"
          value={values.guardianMobile}
        />

        <ReviewItem
          label="Guardian Email"
          value={values.guardianEmail}
        />
      </ReviewCard>

      {/* Address Information */}
      <ReviewCard title="Address Information">
        <ReviewItem
          label="Address Line 1"
          value={values.addressLine1}
        />

        <ReviewItem
          label="Address Line 2"
          value={values.addressLine2}
        />

        <ReviewItem label="City" value={values.city} />

        <ReviewItem
          label="District"
          value={values.district}
        />

        <ReviewItem label="State" value={values.state} />

        <ReviewItem
          label="Country"
          value={values.country}
        />

        <ReviewItem
          label="Postal Code"
          value={values.postalCode}
        />
      </ReviewCard>

      {/* Registration Note */}
      <ReviewCard title="Registration Summary">
        <div className="text-sm text-muted-foreground leading-6">
          This step registers the student's permanent profile. Academic Year,
          Admission Number, Class, Section, Roll Number, Transport, Hostel, and
          Enrollment Status will be assigned during the Student Admission
          process.
        </div>
      </ReviewCard>
    </div>
  );
}