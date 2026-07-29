-- CreateTable
CREATE TABLE "school_profiles" (
    "id" UUID NOT NULL,
    "schoolName" VARCHAR(150) NOT NULL,
    "schoolCode" VARCHAR(30),
    "logoUrl" TEXT,
    "email" VARCHAR(150),
    "phone" VARCHAR(20),
    "alternatePhone" VARCHAR(20),
    "website" VARCHAR(255),
    "addressLine1" VARCHAR(255) NOT NULL,
    "addressLine2" VARCHAR(255),
    "city" VARCHAR(100) NOT NULL,
    "district" VARCHAR(100),
    "state" VARCHAR(100) NOT NULL,
    "country" VARCHAR(100) NOT NULL DEFAULT 'India',
    "postalCode" VARCHAR(10),
    "board" VARCHAR(100),
    "affiliationNumber" VARCHAR(100),
    "principalName" VARCHAR(150),
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "school_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "school_profiles_schoolCode_key" ON "school_profiles"("schoolCode");
