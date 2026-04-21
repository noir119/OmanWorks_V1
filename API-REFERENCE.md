# Al Rayaan Enterprise System - API Reference

## 📚 BASE URL
```
https://zpvbunniyntzwjfwpawg.supabase.co/rest/v1
```

## 🔑 AUTHENTICATION

All requests must include headers:
```json
{
  "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

---

## 👥 EMPLOYEES ENDPOINTS

### GET /employees
Retrieve all employees

**Query Parameters:**
- `id=eq.emp-123` - Filter by ID
- `email=ilike.%@company.com` - Filter by email pattern
- `department=eq.construction` - Filter by department

**Response:**
```json
[
  {
    "id": "emp-123",
    "first_name": "Ahmed",
    "last_name": "Al-Balushi",
    "email": "ahmed@alrayaan.om",
    "phone": "+968-94-123456",
    "department": "construction",
    "position": "Project Manager",
    "joining_date": "2023-01-15",
    "salary_amount": 1500,
    "salary_type": "monthly",
    "employment_status": "active",
    "nationality": "Omani",
    "created_at": "2023-01-15T10:00:00Z"
  }
]
```

### POST /employees
Create new employee

**Request Body:**
```json
{
  "first_name": "Salim",
  "last_name": "Al-Hinai",
  "email": "salim@alrayaan.om",
  "phone": "+968-94-654321",
  "department": "manpower",
  "position": "Technician",
  "joining_date": "2024-01-20",
  "salary_amount": 800,
  "salary_type": "monthly",
  "nationality": "Omani"
}
```

### PATCH /employees?id=eq.emp-123
Update employee

**Request Body:**
```json
{
  "salary_amount": 1600,
  "employment_status": "on_leave"
}
```

### DELETE /employees?id=eq.emp-123
Delete employee (archive)

---

## 🛂 VISA ENDPOINTS

### GET /employee_visas
Retrieve visa records

**Query Parameters:**
- `employee_id=eq.emp-123` - Filter by employee
- `visa_status=eq.active` - Filter by status
- `visa_expiry_date=lt.2024-06-01` - Expiring before date

**Response:**
```json
[
  {
    "id": "visa-123",
    "employee_id": "emp-123",
    "visa_number": "OM-2024-001",
    "visa_type": "employment",
    "visa_status": "active",
    "issue_date": "2022-01-15",
    "visa_expiry_date": "2025-01-15",
    "passport_number": "A12345678",
    "passport_expiry": "2026-05-10",
    "employment_status": "active",
    "verified": true,
    "verification_date": "2024-01-15T10:00:00Z",
    "verification_method": "admin",
    "created_at": "2022-01-15T10:00:00Z"
  }
]
```

### POST /employee_visas
Create visa record

**Request Body:**
```json
{
  "employee_id": "emp-123",
  "visa_number": "OM-2024-002",
  "visa_type": "employment",
  "visa_status": "active",
  "issue_date": "2024-01-20",
  "visa_expiry_date": "2027-01-20",
  "passport_number": "A87654321",
  "passport_expiry": "2027-12-31",
  "employment_status": "active",
  "verified": true,
  "verification_method": "admin"
}
```

### GET /visa_renewals
Retrieve visa renewal records

**Response:**
```json
[
  {
    "id": "renewal-123",
    "employee_id": "emp-123",
    "visa_id": "visa-123",
    "old_visa_number": "OM-2024-001",
    "application_date": "2025-01-01",
    "status": "issued",
    "documents_submitted": ["passport", "medical"],
    "approved_date": "2025-01-05",
    "approved_by": "manager-001",
    "issued_date": "2025-01-10",
    "new_visa_number": "OM-2025-001",
    "created_at": "2025-01-01T10:00:00Z"
  }
]
```

---

## 📋 ATTENDANCE ENDPOINTS

### GET /attendance
Retrieve attendance records

**Query Parameters:**
- `employee_id=eq.emp-123` - Filter by employee
- `date=eq.2024-01-15` - Filter by specific date
- `date=gte.2024-01-01&date=lte.2024-01-31` - Date range

**Response:**
```json
[
  {
    "id": "att-123",
    "employee_id": "emp-123",
    "date": "2024-01-15",
    "check_in_time": "2024-01-15T07:30:00Z",
    "check_out_time": "2024-01-15T15:45:00Z",
    "total_hours": 8.25,
    "location_lat": "23.6100",
    "location_lng": "58.5400",
    "verification_method": "gps",
    "status": "present",
    "created_at": "2024-01-15T07:30:00Z"
  }
]
```

### POST /attendance
Create attendance record

**Request Body:**
```json
{
  "employee_id": "emp-123",
  "date": "2024-01-15",
  "check_in_time": "2024-01-15T07:30:00Z",
  "location_lat": "23.6100",
  "location_lng": "58.5400",
  "verification_method": "gps",
  "status": "present"
}
```

### PATCH /attendance?id=eq.att-123
Update attendance (e.g., clock out)

**Request Body:**
```json
{
  "check_out_time": "2024-01-15T15:45:00Z",
  "total_hours": 8.25
}
```

---

## 💰 PAYROLL ENDPOINTS

### GET /payroll
Retrieve payroll records

**Query Parameters:**
- `employee_id=eq.emp-123` - Filter by employee
- `status=eq.pending` - Filter by status

**Response:**
```json
[
  {
    "id": "payroll-123",
    "employee_id": "emp-123",
    "period_start": "2024-01-01",
    "period_end": "2024-01-31",
    "total_hours": 160,
    "gross_pay": 1500.00,
    "tax_amount": 150.00,
    "insurance_amount": 75.00,
    "total_deductions": 225.00,
    "net_pay": 1275.00,
    "status": "pending",
    "created_at": "2024-02-01T10:00:00Z"
  }
]
```

### POST /payroll
Create payroll record (Use Edge Function for automatic calculation)

---

## 📄 INVOICES ENDPOINTS

### GET /invoices
Retrieve invoices

**Query Parameters:**
- `status=eq.pending` - Filter by status
- `client_id=eq.client-123` - Filter by client
- `invoice_date=gte.2024-01-01` - Filter by date range

**Response:**
```json
[
  {
    "id": "inv-123",
    "invoice_number": "INV-202401-5678",
    "client_id": "client-123",
    "client_name": "Al-Khaleej Investments",
    "invoice_date": "2024-01-15",
    "due_date": "2024-02-14",
    "description": "Construction Services",
    "amount": 5000.00,
    "tax_amount": 250.00,
    "total_amount": 5250.00,
    "status": "pending",
    "created_at": "2024-01-15T10:00:00Z"
  }
]
```

### POST /invoices
Create invoice

**Request Body:**
```json
{
  "client_id": "client-123",
  "invoice_date": "2024-01-15",
  "due_date": "2024-02-14",
  "description": "Services rendered",
  "amount": 5000,
  "items": ["Item 1", "Item 2"]
}
```

---

## 📚 CONTRACTS ENDPOINTS

### GET /contracts
Retrieve contracts

**Query Parameters:**
- `status=eq.active` - Filter by status
- `contract_end_date=lte.2024-06-01` - Expiring soon

**Response:**
```json
[
  {
    "id": "contract-123",
    "contract_number": "CON-2023-001",
    "client_id": "client-123",
    "contract_type": "service",
    "description": "Yearly maintenance contract",
    "start_date": "2023-01-01",
    "end_date": "2024-01-01",
    "amount": 12000,
    "currency": "OMR",
    "status": "active",
    "terms": "Renewal clause: Auto-renewal unless canceled 30 days prior",
    "created_at": "2023-01-01T10:00:00Z"
  }
]
```

---

## 🏗️ PROJECTS ENDPOINTS

### GET /construction_projects
Retrieve construction projects

**Response:**
```json
[
  {
    "id": "proj-123",
    "project_name": "Al Khoudh Mall Renovation",
    "project_location": "Muscat, Oman",
    "start_date": "2024-01-15",
    "end_date": "2024-06-15",
    "budget_amount": 50000,
    "project_manager_id": "emp-123",
    "client_id": "client-123",
    "project_status": "in_progress",
    "description": "Mall renovation project",
    "created_at": "2024-01-15T10:00:00Z"
  }
]
```

---

## 📦 ASSETS ENDPOINTS

### GET /assets
Retrieve asset inventory

**Response:**
```json
[
  {
    "id": "asset-123",
    "asset_code": "EQUIP-2024-001",
    "asset_name": "Excavator CAT 320",
    "asset_type": "equipment",
    "purchase_date": "2023-01-15",
    "purchase_price": 75000,
    "current_value": 67500,
    "location": "Muscat Yard",
    "status": "in_use",
    "last_maintenance": "2024-01-10",
    "next_maintenance": "2024-04-10",
    "created_at": "2023-01-15T10:00:00Z"
  }
]
```

---

## 👥 CLIENTS ENDPOINTS

### GET /clients
Retrieve client records

**Response:**
```json
[
  {
    "id": "client-123",
    "company_name": "Al-Khaleej Investments",
    "contact_person": "Mr. Salim Al-Hinai",
    "email": "contact@alkhaleej.om",
    "phone": "+968-24-123456",
    "location": "Muscat",
    "rating": 4.5,
    "status": "active",
    "created_at": "2023-01-15T10:00:00Z"
  }
]
```

---

## 📋 SERVICE REQUESTS ENDPOINTS

### GET /service_requests
Retrieve customer service requests

**Query Parameters:**
- `status=eq.pending` - Filter by status

**Response:**
```json
[
  {
    "id": "req-123",
    "customer_name": "Ahmed Al-Balushi",
    "customer_email": "ahmed@example.com",
    "service_type": "construction",
    "service_details": "Complete building renovation",
    "budget": 50000,
    "timeline": "6 months",
    "request_date": "2024-01-15",
    "status": "pending",
    "request_number": "REQ-2024-001",
    "created_at": "2024-01-15T10:00:00Z"
  }
]
```

### POST /service_requests
Create service request

**Request Body:**
```json
{
  "customer_name": "Ahmed Al-Balushi",
  "customer_email": "ahmed@example.com",
  "service_type": "construction",
  "service_details": "Office renovation",
  "budget": 25000,
  "timeline": "3 months"
}
```

---

## 🔄 LEAVE REQUESTS ENDPOINTS

### GET /leave_requests
Retrieve leave requests

**Response:**
```json
[
  {
    "id": "leave-123",
    "employee_id": "emp-123",
    "leave_type": "annual",
    "start_date": "2024-02-01",
    "end_date": "2024-02-07",
    "number_of_days": 7,
    "reason": "Personal vacation",
    "status": "pending",
    "created_at": "2024-01-20T10:00:00Z"
  }
]
```

### POST /leave_requests
Submit leave request

**Request Body:**
```json
{
  "employee_id": "emp-123",
  "leave_type": "annual",
  "start_date": "2024-02-01",
  "end_date": "2024-02-07",
  "reason": "Personal vacation"
}
```

---

## 📊 COMMON QUERY FILTERS

### Comparison Operators
```
eq      : Equal to
neq     : Not equal to
gt      : Greater than
gte     : Greater than or equal to
lt      : Less than
lte     : Less than or equal to
like    : Pattern match
ilike   : Case-insensitive pattern match
in      : In list
```

### Example Queries
```
GET /employees?salary_amount=gt.1000&status=eq.active
GET /invoices?total_amount=gte.5000&status=neq.cancelled
GET /attendance?date=gte.2024-01-01&date=lte.2024-01-31
```

---

## 🛂 ERROR RESPONSES

### Standard Error Format
```json
{
  "code": "PGRST116",
  "message": "The resource requested does not exist",
  "details": "relation \"employees\" does not exist"
}
```

### Common Error Codes
- `401` - Unauthorized (Invalid API key)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not found
- `409` - Conflict (Duplicate entry)
- `422` - Invalid input
- `500` - Internal server error

---

## 📝 RATE LIMITS

- Standard tier: 1,000 requests per hour
- Premium tier: 10,000 requests per hour
- Batch operations: 100 records per request

---

## 🔗 USEFUL LINKS

- Supabase REST API: https://supabase.com/docs/reference/javascript/introduction
- Query Filter Examples: https://supabase.com/docs/reference/javascript/rpc
- RLS Documentation: https://supabase.com/docs/guides/auth/row-level-security

---

**Last Updated:** January 2024
**API Version:** v1
