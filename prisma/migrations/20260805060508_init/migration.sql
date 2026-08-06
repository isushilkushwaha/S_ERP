-- CreateEnum
CREATE TYPE "RoleName" AS ENUM ('ADMIN', 'TEACHER');

-- CreateEnum
CREATE TYPE "AdminType" AS ENUM ('PRIMARY', 'SECONDARY');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "StudentCategory" AS ENUM ('GENERAL', 'OBC', 'SC', 'ST', 'EWS', 'MINORITY', 'OTHER');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ALUMNI', 'TRANSFERRED');

-- CreateEnum
CREATE TYPE "AdmissionType" AS ENUM ('NEW', 'PROMOTION', 'TRANSFER', 'READMISSION');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'PROMOTED', 'PASSED_OUT', 'TRANSFERRED', 'LEFT');

-- CreateEnum
CREATE TYPE "Stream" AS ENUM ('SCIENCE', 'COMMERCE', 'ARTS');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('AADHAAR', 'PHOTO', 'BIRTH_CERTIFICATE', 'TRANSFER_CERTIFICATE', 'CASTE_CERTIFICATE', 'INCOME_CERTIFICATE', 'MARKSHEET', 'OTHER');

-- CreateEnum
CREATE TYPE "AcademicYearStatus" AS ENUM ('UPCOMING', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Medium" AS ENUM ('ENGLISH', 'HINDI', 'BOTH');

-- CreateEnum
CREATE TYPE "FeeStructureStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" "RoleName" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "admin_type" "AdminType",

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "role_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "school_profiles" (
    "id" UUID NOT NULL,
    "school_name" VARCHAR(150) NOT NULL,
    "school_code" VARCHAR(30),
    "admission_prefix" VARCHAR(20) NOT NULL DEFAULT 'ADM',
    "logo_url" TEXT,
    "email" VARCHAR(150),
    "phone" VARCHAR(20),
    "alternate_phone" VARCHAR(20),
    "website" VARCHAR(255),
    "address_line_1" VARCHAR(255) NOT NULL,
    "address_line_2" VARCHAR(255),
    "city" VARCHAR(100) NOT NULL,
    "district" VARCHAR(100),
    "state" VARCHAR(100) NOT NULL,
    "country" VARCHAR(100) NOT NULL DEFAULT 'India',
    "postal_code" VARCHAR(10),
    "board" VARCHAR(100),
    "affiliation_number" VARCHAR(100),
    "principal_name" VARCHAR(150),
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "favicon_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "school_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_years" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" "AcademicYearStatus" NOT NULL DEFAULT 'UPCOMING',
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "academic_years_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_year_counters" (
    "id" TEXT NOT NULL,
    "academic_year_id" TEXT NOT NULL,
    "last_admission_sequence" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_year_counters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roll_number_counters" (
    "id" TEXT NOT NULL,
    "academic_year_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "section_id" TEXT NOT NULL,
    "last_roll_number" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roll_number_counters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "short_name" VARCHAR(20),
    "code" VARCHAR(20) NOT NULL,
    "description" VARCHAR(255),
    "medium" "Medium" NOT NULL DEFAULT 'ENGLISH',
    "display_order" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_by" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_configurations" (
    "id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "sections_enabled" BOOLEAN NOT NULL DEFAULT true,
    "default_section_capacity" INTEGER,
    "max_students_without_section" INTEGER,
    "auto_allocation_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "class_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sections" (
    "id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "display_order" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_by" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "student_code" TEXT NOT NULL,
    "emis_number" TEXT,
    "apaar_id" TEXT,
    "pen_number" TEXT,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "blood_group" TEXT,
    "religion" TEXT,
    "category" "StudentCategory",
    "caste" TEXT,
    "nationality" TEXT DEFAULT 'Indian',
    "aadhaar_number" TEXT,
    "birth_certificate_no" TEXT,
    "email" TEXT,
    "mobile" TEXT,
    "photo" TEXT,
    "previous_school" TEXT,
    "remarks" TEXT,
    "father_name" TEXT NOT NULL,
    "father_occupation" TEXT,
    "father_mobile" TEXT NOT NULL,
    "father_email" TEXT,
    "mother_name" TEXT,
    "mother_occupation" TEXT,
    "mother_mobile" TEXT,
    "mother_email" TEXT,
    "guardian_name" TEXT,
    "guardian_relation" TEXT,
    "guardian_mobile" TEXT,
    "guardian_email" TEXT,
    "address_line_1" TEXT NOT NULL,
    "address_line_2" TEXT,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "postal_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "registration_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_enrollments" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "academic_year_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "section_id" TEXT NOT NULL,
    "admission_number" TEXT NOT NULL,
    "roll_number" INTEGER NOT NULL,
    "medium" "Medium" NOT NULL DEFAULT 'ENGLISH',
    "stream" "Stream",
    "house" TEXT,
    "board_registration_number" TEXT,
    "admission_type" "AdmissionType" NOT NULL,
    "admission_date" TIMESTAMP(3) NOT NULL,
    "is_hostel_required" BOOLEAN NOT NULL DEFAULT false,
    "is_transport_required" BOOLEAN NOT NULL DEFAULT false,
    "status" "StudentStatus" NOT NULL DEFAULT 'ACTIVE',
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_documents" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "document_type" "DocumentType" NOT NULL,
    "document_number" TEXT,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "mime_type" TEXT,
    "file_size" INTEGER,
    "issue_date" TIMESTAMP(3),
    "expiry_date" TIMESTAMP(3),
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_structures" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "academic_year_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "effective_from" TIMESTAMP(3) NOT NULL,
    "status" "FeeStructureStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" VARCHAR(500),
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_by" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "fee_structures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_structure_items" (
    "id" TEXT NOT NULL,
    "fee_structure_id" TEXT NOT NULL,
    "fee_component_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fee_structure_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_components" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(30) NOT NULL,
    "description" VARCHAR(255),
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_by" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "fee_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_fee_ledgers" (
    "id" TEXT NOT NULL,
    "enrollment_id" TEXT NOT NULL,
    "fee_component_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "due_date" TIMESTAMP(3),
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_fee_ledgers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_role_id_idx" ON "users"("role_id");

-- CreateIndex
CREATE INDEX "accounts_user_id_idx" ON "accounts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "school_profiles_school_code_key" ON "school_profiles"("school_code");

-- CreateIndex
CREATE UNIQUE INDEX "academic_years_code_key" ON "academic_years"("code");

-- CreateIndex
CREATE INDEX "academic_years_status_idx" ON "academic_years"("status");

-- CreateIndex
CREATE INDEX "academic_years_deleted_at_idx" ON "academic_years"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "academic_year_counters_academic_year_id_key" ON "academic_year_counters"("academic_year_id");

-- CreateIndex
CREATE INDEX "roll_number_counters_academic_year_id_class_id_section_id_idx" ON "roll_number_counters"("academic_year_id", "class_id", "section_id");

-- CreateIndex
CREATE UNIQUE INDEX "roll_number_counters_academic_year_id_class_id_section_id_key" ON "roll_number_counters"("academic_year_id", "class_id", "section_id");

-- CreateIndex
CREATE INDEX "classes_tenant_id_status_display_order_idx" ON "classes"("tenant_id", "status", "display_order");

-- CreateIndex
CREATE UNIQUE INDEX "classes_tenant_id_name_deleted_at_key" ON "classes"("tenant_id", "name", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "classes_tenant_id_code_deleted_at_key" ON "classes"("tenant_id", "code", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "classes_tenant_id_display_order_deleted_at_key" ON "classes"("tenant_id", "display_order", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "class_configurations_class_id_key" ON "class_configurations"("class_id");

-- CreateIndex
CREATE INDEX "sections_class_id_status_display_order_idx" ON "sections"("class_id", "status", "display_order");

-- CreateIndex
CREATE UNIQUE INDEX "sections_class_id_name_deleted_at_key" ON "sections"("class_id", "name", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "sections_class_id_display_order_deleted_at_key" ON "sections"("class_id", "display_order", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "students_student_code_key" ON "students"("student_code");

-- CreateIndex
CREATE UNIQUE INDEX "students_aadhaar_number_key" ON "students"("aadhaar_number");

-- CreateIndex
CREATE INDEX "students_student_code_idx" ON "students"("student_code");

-- CreateIndex
CREATE INDEX "students_aadhaar_number_idx" ON "students"("aadhaar_number");

-- CreateIndex
CREATE INDEX "student_enrollments_student_id_idx" ON "student_enrollments"("student_id");

-- CreateIndex
CREATE INDEX "student_enrollments_academic_year_id_idx" ON "student_enrollments"("academic_year_id");

-- CreateIndex
CREATE INDEX "student_enrollments_class_id_idx" ON "student_enrollments"("class_id");

-- CreateIndex
CREATE INDEX "student_enrollments_section_id_idx" ON "student_enrollments"("section_id");

-- CreateIndex
CREATE INDEX "student_enrollments_status_idx" ON "student_enrollments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "student_enrollments_student_id_academic_year_id_key" ON "student_enrollments"("student_id", "academic_year_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_enrollments_admission_number_key" ON "student_enrollments"("admission_number");

-- CreateIndex
CREATE UNIQUE INDEX "student_enrollments_academic_year_id_class_id_section_id_ro_key" ON "student_enrollments"("academic_year_id", "class_id", "section_id", "roll_number");

-- CreateIndex
CREATE INDEX "fee_structures_tenant_id_idx" ON "fee_structures"("tenant_id");

-- CreateIndex
CREATE INDEX "fee_structures_academic_year_id_idx" ON "fee_structures"("academic_year_id");

-- CreateIndex
CREATE INDEX "fee_structures_class_id_idx" ON "fee_structures"("class_id");

-- CreateIndex
CREATE UNIQUE INDEX "fee_structures_tenant_id_academic_year_id_class_id_deleted__key" ON "fee_structures"("tenant_id", "academic_year_id", "class_id", "deleted_at");

-- CreateIndex
CREATE INDEX "fee_structure_items_fee_structure_id_idx" ON "fee_structure_items"("fee_structure_id");

-- CreateIndex
CREATE INDEX "fee_structure_items_fee_component_id_idx" ON "fee_structure_items"("fee_component_id");

-- CreateIndex
CREATE UNIQUE INDEX "fee_structure_items_fee_structure_id_fee_component_id_key" ON "fee_structure_items"("fee_structure_id", "fee_component_id");

-- CreateIndex
CREATE INDEX "fee_components_tenant_id_status_idx" ON "fee_components"("tenant_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "fee_components_tenant_id_code_deleted_at_key" ON "fee_components"("tenant_id", "code", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "fee_components_tenant_id_name_deleted_at_key" ON "fee_components"("tenant_id", "name", "deleted_at");

-- CreateIndex
CREATE INDEX "student_fee_ledgers_enrollment_id_idx" ON "student_fee_ledgers"("enrollment_id");

-- CreateIndex
CREATE INDEX "student_fee_ledgers_is_paid_idx" ON "student_fee_ledgers"("is_paid");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_year_counters" ADD CONSTRAINT "academic_year_counters_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roll_number_counters" ADD CONSTRAINT "roll_number_counters_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roll_number_counters" ADD CONSTRAINT "roll_number_counters_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roll_number_counters" ADD CONSTRAINT "roll_number_counters_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_configurations" ADD CONSTRAINT "class_configurations_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrollments" ADD CONSTRAINT "student_enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_documents" ADD CONSTRAINT "student_documents_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_structures" ADD CONSTRAINT "fee_structures_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_structures" ADD CONSTRAINT "fee_structures_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_structure_items" ADD CONSTRAINT "fee_structure_items_fee_structure_id_fkey" FOREIGN KEY ("fee_structure_id") REFERENCES "fee_structures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_structure_items" ADD CONSTRAINT "fee_structure_items_fee_component_id_fkey" FOREIGN KEY ("fee_component_id") REFERENCES "fee_components"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_fee_ledgers" ADD CONSTRAINT "student_fee_ledgers_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "student_enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_fee_ledgers" ADD CONSTRAINT "student_fee_ledgers_fee_component_id_fkey" FOREIGN KEY ("fee_component_id") REFERENCES "fee_components"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
