# Student Management Module

> Version: 1.0
> Project: School Management System (MVP)
> Module: Student Management
> enrollmentStatus: Design Phase

---

# 1. Objective

The Student Management Module is the foundation of the entire School ERP.

Every student should have **one permanent identity** throughout their school life.

This module stores all student information and provides a centralized source of data for:

- Fee Management
- Attendance
- Examination
- SMS Notifications
- Reports
- Certificates

The same student information should never be duplicated in different modules.

---

# 2. Business Requirements

The school has:

- Nursery to Class 12
- Hindi Medium
- English Medium
- Multiple Sections
- One Academic Year every session

Students can:

- Take new admission
- Be promoted every year
- Change section
- Change medium
- Leave school
- Rejoin later

The ERP must preserve the complete academic history.

---

# 3. Problem Statement

Many beginner systems store class information directly inside the Student table.

Example:

Student

- Name
- Class
- Section

Next year:

Class changes from 5 to 6.

History is lost.

This design is incorrect.

---

# 4. Solution

Separate

Student Information

from

Academic Information.

Student information never changes.

Academic information changes every year.

Therefore create separate tables.

---

# 5. Database Design

## Tables

1. Students
2. Academic Years
3. Classes
4. Sections
5. Student Enrollments
6. Student Documents

---

# 6. Table Purpose

## 6.1 Students

Purpose

Stores permanent student information.

Never stores class or section.

Example

- Student Code
- Admission Number
- Name
- DOB
- Gender
- Father Name
- Mother Name
- Mobile
- Address
- Aadhaar
- Photo
- Admission Date

This table never changes after promotion.

---

## 6.2 Academic Years

Purpose

Stores school sessions.

Example

2025-26

2026-27

2027-28

Only one academic year is active.

---

## 6.3 Classes

Purpose

Stores school classes.

Example

Nursery

LKG

UKG

1

2

...

12

Used throughout ERP.

---

## 6.4 Sections

Purpose

Stores available sections.

Example

A

B

C

D

---

## 6.5 Student Enrollments

Purpose

Stores yearly academic records.

Contains

- Student
- Academic Year
- Class
- Section
- Roll Number
- Medium
- Status

Every promotion creates a new enrollment.

Student table remains unchanged.

---

## 6.6 Student Documents

Purpose

Stores uploaded documents.

Example

Birth Certificate

Transfer Certificate

Aadhaar

Photo

Income Certificate

Caste Certificate

---

# 7. Database Relationships

Student

1

↓

Many

Student Enrollment

Many

↓

1

Academic Year

Many

↓

1

Class

Many

↓

1

Section

Student

1

↓

Many

Student Documents

---

# 8. Student Life Cycle

Admission

↓

Student Record Created

↓

Enrollment Created

↓

Fees

↓

Attendance

↓

Examination

↓

Promotion

↓

New Enrollment

↓

Certificate

↓

Pass Out / Transfer

---

# 9. Example

Student

Student ID

STD00001

Name

Rahul Kumar

DOB

10-05-2015

Enrollment

Academic Year

2025-26

Class

1

Section

A

Roll

15

Next Year

Create New Enrollment

Academic Year

2026-27

Class

2

Section

A

Roll

12

Student information remains unchanged.

---

# 10. Why Enrollment Table?

Without Enrollment

Student

↓

Class = 5

Next Year

Update

↓

Class = 6

History lost.

With Enrollment

Student

↓

Enrollment

2025

Class 5

↓

Enrollment

2026

Class 6

History preserved forever.

---

# 11. Module Dependencies

Fee Module

↓

Uses Student Enrollment

Attendance

↓

Uses Student Enrollment

Examination

↓

Uses Student Enrollment

SMS

↓

Uses Student Enrollment

Certificates

↓

Uses Student Enrollment

Reports

↓

Uses Student Enrollment

---

# 12. CRUD Operations

Create Student

Update Student

View Student

Search Student

Soft Delete Student

Import Students

Export Students

Upload Documents

---

# 13. Search Requirements

Search by

Student Code

Admission Number

Name

Father Name

Mobile

Class

Section

Academic Year

Status

---

# 14. Import Existing Students

School already has students.

Import process

Excel

↓

Students Table

↓

Student Enrollment Table

↓

Ready for ERP

---

# 15. New Admission Process

Admission Form

↓

Create Student

↓

Create Enrollment

↓

Upload Documents

↓

Generate Admission Number

↓

Ready for Fees

---

# 16. Promotion Process

Select Academic Year

↓

Select Class

↓

Promote Students

↓

Create New Enrollment

↓

Old Enrollment remains unchanged

---

# 17. Soft Delete

Students should never be permanently deleted.

Use

deletedAt

status

Inactive

This preserves historical records.

---

# 18. Security

Only Admin can

Delete

Promote

Import

Teacher can

View

Search

Attendance

Results

---

# 19. Performance

Indexes

Student Code

Admission Number

Academic Year

Class

Section

Mobile

Status

Foreign Keys

Student ID

Academic Year ID

Class ID

Section ID

---

# 20. Future Scope

Parent Portal

Student Portal

Transport

Hostel

Library

Online Admission

ID Card

Biometric Attendance

Mobile App

---

# 21. Development Roadmap

Step 1

Design Database

✅

Step 2

Prisma Schema

⬜

Step 3

Database Migration

⬜

Step 4

Seed Data

⬜

Step 5

Validation

⬜

Step 6

API

⬜

Step 7

Student List

⬜

Step 8

Admission Form

⬜

Step 9

Edit Student

⬜

Step 10

Import Excel

⬜

Step 11

Testing

⬜

Step 12

Integration with Fees

⬜

---

# 22. Key Design Principles

- One permanent student record.
- One enrollment per academic year.
- Never overwrite academic history.
- Use foreign keys instead of duplicate data.
- All modules use the same Student ID.
- Build for long-term scalability while keeping the MVP simple.

---

# 23. Next Module

After completing the Student Module, the next implementation step is:

- Prisma Schema
- Database Migration
- Seed Data
- Student CRUD API
- Student Management UI



✅ Prisma Models
✅ Database Migration
✅ Seed Data
✅ Zod Validation
✅ Repository Layer
✅ Service Layer
✅ Error Handling
✅ GET /api/students
✅ GET /api/students/:id
✅ POST /api/students
✅ PATCH /api/students/:id
✅ DELETE /api/students/:id
✅ Postman Testing