Based on everything you've built so far, your **Student Module Backend APIs** are as follows.

---

# Student Module Backend APIs

## 1. Student APIs

Base URL

```http
/api/students
```

| Method | Endpoint            | Purpose                                               |
| ------ | ------------------- | ----------------------------------------------------- |
| GET    | `/api/students`     | Get all students with pagination, search, and filters |
| GET    | `/api/students/:id` | Get complete details of a single student              |
| POST   | `/api/students`     | Create a new permanent student record                 |
| PATCH  | `/api/students/:id` | Update student information                            |
| DELETE | `/api/students/:id` | Delete (or soft delete) a student                     |

### Used For

* Student Registration
* Student Profile
* Search Student
* Student Directory
* Student Edit

---

# 2. Student Enrollment APIs

Base URL

```http
/api/student-enrollments
```

| Method | Endpoint                       | Purpose                              |
| ------ | ------------------------------ | ------------------------------------ |
| GET    | `/api/student-enrollments`     | List yearly enrollments              |
| GET    | `/api/student-enrollments/:id` | View a single enrollment             |
| POST   | `/api/student-enrollments`     | Enroll a student in an academic year |
| PATCH  | `/api/student-enrollments/:id` | Update enrollment                    |
| DELETE | `/api/student-enrollments/:id` | Remove enrollment                    |

### Used For

* Admission
* Promotion
* Class Transfer
* Academic History
* Roll Number Management
* Current Class Assignment

---

# 3. Student Document APIs

Base URL

```http
/api/student-documents
```

| Method | Endpoint                     | Purpose                      |
| ------ | ---------------------------- | ---------------------------- |
| GET    | `/api/student-documents`     | List student documents       |
| GET    | `/api/student-documents/:id` | Get document details         |
| POST   | `/api/student-documents`     | Upload a new document record |
| PATCH  | `/api/student-documents/:id` | Update document details      |
| DELETE | `/api/student-documents/:id` | Delete a document            |

### Used For

* Aadhaar
* Birth Certificate
* Transfer Certificate
* Income Certificate
* Caste Certificate
* Student Photo
* Other Supporting Documents

---

# 4. Academic Year API

Base URL

```http
/api/academic-years
```

| Method | Endpoint              | Purpose                 |
| ------ | --------------------- | ----------------------- |
| GET    | `/api/academic-years` | List all academic years |

### Used For

Dropdowns in:

* Student Enrollment
* Fee Module
* Attendance
* Examination
* Reports

Example

```
2025–26

2026–27

2027–28
```

---

# 5. Class API

Base URL

```http
/api/classes
```

| Method | Endpoint       | Purpose          |
| ------ | -------------- | ---------------- |
| GET    | `/api/classes` | List all classes |

### Used For

Dropdowns in:

* Student Enrollment
* Fee Module
* Attendance
* Marks Entry
* Timetable (future)

Example

```
Nursery

LKG

UKG

1

2

...

12
```

---

# 6. Section API

Base URL

```http
/api/sections
```

| Method | Endpoint                     | Purpose                            |
| ------ | ---------------------------- | ---------------------------------- |
| GET    | `/api/sections`              | List all sections                  |
| GET    | `/api/sections?classId=<id>` | List sections for a selected class |

### Used For

Dynamic dropdowns.

Example

Class 5 selected

↓

```
A

B

C
```

instead of

```
Nursery

LKG

UKG

...
```

---

# API Summary

| Module              | GET | GET By ID | POST | PATCH | DELETE |
| ------------------- | :-: | :-------: | :--: | :---: | :----: |
| Students            |  ✅  |     ✅     |   ✅  |   ✅   |    ✅   |
| Student Enrollments |  ✅  |     ✅     |   ✅  |   ✅   |    ✅   |
| Student Documents   |  ✅  |     ✅     |   ✅  |   ✅   |    ✅   |
| Academic Years      |  ✅  |     ❌     |   ❌  |   ❌   |    ❌   |
| Classes             |  ✅  |     ❌     |   ❌  |   ❌   |    ❌   |
| Sections            |  ✅  |     ❌     |   ❌  |   ❌   |    ❌   |

---

# Total APIs Built

| Resource            | Endpoints |
| ------------------- | --------: |
| Students            |         5 |
| Student Enrollments |         5 |
| Student Documents   |         5 |
| Academic Years      |         1 |
| Classes             |         1 |
| Sections            |         1 |

**Total: 18 REST API endpoints**

---

# How These APIs Work Together

```text
Student
│
├── Student CRUD
│
├── Student Enrollment
│      │
│      ├── Academic Year
│      ├── Class
│      └── Section
│
└── Student Documents
```

---

# Student Module Status

```text
Student Module Backend
│
├── Master APIs
│   ├── ✅ Academic Year
│   ├── ✅ Class
│   └── ✅ Section
│
├── Student Management
│   ├── ✅ Student CRUD
│   ├── ✅ Student Enrollment CRUD
│   └── ✅ Student Document CRUD
│
└── Shared Infrastructure
    ├── ✅ Repository Pattern
    ├── ✅ Service Layer
    ├── ✅ Zod Validation
    ├── ✅ Central Error Handling
    ├── ✅ Prisma ORM
    ├── ✅ PostgreSQL
    └── ✅ Pagination, Search & Filtering
```

This gives you a solid backend foundation for the Student module. The next backend module in your MVP roadmap is **Fee Management**, which will build on these APIs by linking fee assignments and collections to `StudentEnrollment` records rather than directly to `Student`.
