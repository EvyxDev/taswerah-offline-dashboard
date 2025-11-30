# Payments Route Documentation

## Route Path

`/[locale]/(dashboard)/payments`

## Overview

The payments route provides a comprehensive dashboard for viewing payment statistics, client payments, and managing data synchronization. It displays monthly payment charts, photo statistics, client payment tables, and provides filtering, export, and sync functionality.

---

## Components Used

### Main Components

1. **`page.tsx`** (Server Component)

   - Entry point for the payments route
   - Handles server-side data fetching
   - Processes URL search parameters (shift_id, from_date, to_date, staff_id)
   - Fetches payments, shifts, and staff data

2. **`payment-page.tsx`** (Client Component)

   - Main UI component that displays the payments dashboard
   - Handles breadcrumb navigation
   - Renders charts, tables, and filter dialogs
   - Manages sync status display

3. **`payment-table.tsx`** (Client Component)

   - Displays clients and their payment information in a table
   - Shows client code, phone number, and total paid amount
   - Displays count badge with total number of clients

4. **`charts-sectoin.tsx`** (Client Component)

   - Displays payment charts section
   - Renders monthly payment area gradient chart

### Dialog Components

5. **`filter-dialog.tsx`**

   - Dialog for filtering payments by date range, shift, or staff
   - Enforces single filter type (dates OR staff OR shift)
   - Updates URL search parameters on apply

6. **`export-dialog.tsx`**

   - Dialog for exporting payment statistics as PDF
   - Allows date range selection
   - Generates and previews PDF document
   - Provides download functionality

7. **`receipt-dialog.tsx`**

   - Dialog for viewing client receipts
   - Displays receipt component for a specific client

8. **`sync-filter-dialog.tsx`**

   - Dialog for filtering and exporting sync jobs data
   - Allows filtering by date range, employee ID, or employee name
   - Displays sync jobs results with statistics
   - Exports filtered data to Excel

9. **`sync-status.tsx`** (Client Component)

   - Displays last synchronization time
   - Shows sync status with formatted date
   - Auto-refreshes sync data periodically

---

## Flow

### 1. Page Load Flow

```
User navigates to /payments
    ↓
page.tsx (Server Component) receives request
    ↓
Extracts searchParams (shift_id, from_date, to_date, staff_id)
    ↓
Gets authentication token
    ↓
Calls GetPaymentsByBransh(shiftId, fromDate, toDate, staffId)
    ↓
Calls GetShifts()
    ↓
Calls GetAllPhotographers(1, 1000)
    ↓
Fetches data from APIs in parallel
    ↓
Passes data to PaymentPage component
    ↓
PaymentPage renders charts, table, and filter components
```

### 2. Filter Flow

```
User clicks Filter button
    ↓
FilterDialog opens
    ↓
User selects filter type (dates, staff, or shift)
    ↓
If dates selected: Disables staff and shift selects
    ↓
If staff selected: Disables dates and shift selects
    ↓
If shift selected: Disables dates and staff selects
    ↓
User clicks Apply button
    ↓
Updates URL search parameters based on filter priority:
    - Priority 1: Dates (if selected)
    - Priority 2: Staff (if selected)
    - Priority 3: Shift (if selected)
    ↓
Router navigates to new URL
    ↓
page.tsx re-executes with new searchParams
    ↓
Fetches filtered data
    ↓
UI updates with filtered results
```

### 3. Export PDF Flow

```
User clicks Export PDF button
    ↓
ExportDialog opens
    ↓
User selects from date and/or to date
    ↓
User clicks Generate button
    ↓
Calls GetExportStats(fromDate, toDate) via useQuery
    ↓
Fetches export statistics from API
    ↓
Generates PDF document with statistics
    ↓
Displays PDF preview in dialog
    ↓
User clicks Download PDF button
    ↓
Downloads PDF file
```

### 4. Sync Filter Flow

```
User clicks Export as Excel button
    ↓
SyncFilterDialog opens
    ↓
User selects filters (dates, employee, employee name)
    ↓
User clicks Export All Data button
    ↓
Calls GetBranchManagerSyncFilter(params) via useSyncFilter hook
    ↓
Fetches filtered sync jobs data from API
    ↓
Displays sync jobs results with statistics
    ↓
User clicks Export as Excel button
    ↓
Calls exportSyncJobsToExcel() function
    ↓
Downloads Excel file with sync jobs data
```

### 5. Sync Status Flow

```
PaymentPage component mounts
    ↓
SyncStatus component renders
    ↓
useBranchManagerSync hook is called
    ↓
Calls GetBranchManagerSyncLast() via useQuery
    ↓
Fetches last sync time from API
    ↓
Displays formatted last sync time
    ↓
Auto-refreshes every 10 minutes
```

---

## Actions

### Server Actions

No server actions are used in this route. All data fetching is done through API functions called from server components or client-side hooks.

---

## Hooks

### 1. `useBranchManagerSync()`

**Location:** `_hooks/use-branch-manager-sync.ts`

**Returns:**

- `syncData`: Last sync data with sync time and job ID
- `isLoading`: Boolean indicating if data is loading
- `error`: Error object if fetch fails
- `refetch`: Function to manually refetch data

**Usage:**

```typescript
const { syncData, isLoading, error } = useBranchManagerSync();
```

**Features:**

- Auto-refreshes every 10 minutes
- Stale time: 5 minutes
- Retries once on failure
- Does not refetch on window focus

### 2. `useSyncFilter(params)`

**Location:** `_hooks/use-sync-filter.ts`

**Returns:**

- `syncFilterData`: Filtered sync jobs data with statistics
- `isLoading`: Boolean indicating if data is loading
- `error`: Error object if fetch fails
- `refetch`: Function to manually refetch data

**Parameters:**

- `employee_id` (optional): Employee ID to filter by
- `employeeName` (optional): Employee name to search
- `from` (optional): Start date for filtering
- `to` (optional): End date for filtering

**Usage:**

```typescript
const { syncFilterData, isLoading, refetch } = useSyncFilter({
  employee_id: "123",
  employeeName: "John",
  from: "2024-01-01",
  to: "2024-01-31",
});
```

**Features:**

- Disabled by default (enabled: false)
- Must be manually triggered via refetch()
- No stale time (staleTime: 0)

---

## GET Requests

### 1. `GetPaymentsByBransh(shiftId?, fromDate?, toDate?, staffId?)`

**Location:** `src/lib/api/payments.api.ts`

**Purpose:** Fetches payment dashboard data with optional filtering

**Parameters:**

- `shiftId` (optional): Shift ID to filter by
- `fromDate` (optional): Start date for filtering
- `toDate` (optional): End date for filtering
- `staffId` (optional): Staff/employee ID to filter by

**API Request:**

- **Method:** GET
- **URL:** `${NEXT_PUBLIC_API}/branch-manager/payments/dashboard`
- **Query Parameters:**
  - `shift_id`: Optional shift ID
  - `from_date`: Optional start date
  - `to_date`: Optional end date
  - `staff_id`: Optional staff ID
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}`
- **Cache:** `no-store` (always fetches fresh data)

**Response Structure:**

- `monthly_payments`: Array of monthly payment data
- `photo_stats`: Photo statistics data
- `clients`: Array of client objects with:
  - `barcode`: Client barcode code
  - `phone_number`: Client phone number
  - `total_paid`: Total amount paid by client

### 2. `GetExportStats(params)`

**Location:** `src/lib/api/client.ts`

**Purpose:** Fetches export statistics for PDF generation

**Parameters:**

- `from_date` (optional): Start date for statistics
- `to_date` (optional): End date for statistics

**API Request:**

- **Method:** GET
- **URL:** `/api/export`
- **Query Parameters:**
  - `from_date`: Optional start date
  - `to_date`: Optional end date
- **Headers:**
  - `Content-Type: application/json`

**Response Structure:**

- Export statistics data used for PDF generation

### 3. `GetBranchManagerSyncLast()`

**Location:** `src/lib/api/client.ts`

**Purpose:** Fetches last synchronization time and job ID

**Parameters:**

- None

**API Request:**

- **Method:** GET
- **URL:** `/api/branch-manager/sync/last`
- **Headers:**
  - `Content-Type: application/json`
- **Cache:** `no-store` (always fetches fresh data)

**Response Structure:**

- `last_sync_time`: Last synchronization timestamp
- `sync_job_id`: ID of the last sync job

### 4. `GetBranchManagerSyncFilter(params)`

**Location:** `src/lib/api/client.ts`

**Purpose:** Fetches filtered sync jobs data

**Parameters:**

- `employee_id` (optional): Employee ID to filter by
- `employeeName` (optional): Employee name to search
- `from` (optional): Start date for filtering
- `to` (optional): End date for filtering

**API Request:**

- **Method:** GET
- **URL:** `/api/branch-manager/sync/filter`
- **Query Parameters:**
  - `employee_id`: Optional employee ID
  - `employeeName`: Optional employee name
  - `from`: Optional start date
  - `to`: Optional end date
- **Headers:**
  - `Content-Type: application/json`
- **Cache:** `no-store` (always fetches fresh data)

**Response Structure:**

- `sync_jobs`: Array of sync job objects with:
  - `id`: Job ID
  - `employee_id`: Employee ID
  - `employeeName`: Employee name
  - `pay_amount`: Payment amount
  - `orderprefixcode`: Order barcode prefix
  - `status`: Job status
  - `shift_name`: Shift name
  - `orderphone`: Order phone number
  - `number_of_photos`: Number of photos
  - `created_at`: Creation timestamp
  - `updated_at`: Update timestamp
- `statistics`: Statistics object with:
  - `total_photos`: Total number of photos
  - `total_money`: Total money amount

### 5. `GetShifts()`

**Location:** `src/lib/api/shifts.api.ts`

**Purpose:** Fetches all shifts

**Parameters:**

- None

**API Request:**

- **Method:** GET
- **URL:** `${NEXT_PUBLIC_API}/branch-manager/shifts`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}`
- **Cache:** `no-store` (always fetches fresh data)

**Response Structure:**

- Array of shift objects containing:
  - `id`: Shift ID
  - `name`: Shift name
  - `from`: Start time
  - `to`: End time
  - Other shift properties

### 6. `GetAllPhotographers(page, limit)`

**Location:** `src/lib/api/staff.api.ts`

**Purpose:** Fetches paginated list of photographers/employees

**Parameters:**

- `page` (number, default: 1): Page number
- `limit` (number, default: 10): Items per page

**API Request:**

- **Method:** GET
- **URL:** `${NEXT_PUBLIC_API}/branch-manager/staff?page={page}&limit={limit}`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}`
- **Cache:** `no-store` (always fetches fresh data)

**Response Structure:**

- `current_page`: Current page number
- `data`: Array of photographer/employee objects
- `last_page`: Total number of pages
- `per_page`: Items per page
- `total`: Total number of employees
- `photographer_count`: Optional count of photographers

---

## What is Done in This Route

### 1. **Data Display**

- Displays monthly payment charts with area gradient visualization
- Shows photo statistics
- Displays clients table with:
  - Client code (barcode)
  - Phone number
  - Total paid amount
- Shows count badge with total number of clients
- Alternating row colors for better readability

### 2. **Filtering**

- Provides filter dialog with multiple filter options:
  - **Date Range**: Filter by from date and/or to date
  - **Staff**: Filter by specific employee
  - **Shift**: Filter by specific shift
- Enforces single filter type (only one filter can be active at a time)
- Filter priority:
  1. Dates (highest priority)
  2. Staff
  3. Shift (lowest priority)
- Shows warning when trying to select multiple filter types
- Updates URL search parameters on apply
- Maintains filter state in URL for bookmarking/sharing

### 3. **PDF Export**

- Provides export dialog for generating PDF reports
- Allows date range selection (from date and/or to date)
- Generates PDF with payment statistics
- Displays PDF preview in dialog
- Provides download functionality
- File naming: `export_{fromDate}_{toDate}.pdf`

### 4. **Sync Status**

- Displays last synchronization time
- Auto-refreshes sync status every 10 minutes
- Shows formatted date and time
- Handles loading and error states
- Shows sync status badge with clock icon

### 5. **Sync Jobs Export**

- Provides sync filter dialog for exporting sync jobs
- Allows filtering by:
  - Date range (from/to dates)
  - Employee ID (dropdown selection)
  - Employee name (text search)
- Displays filtered sync jobs with details:
  - Employee information
  - Order details (code, phone, amount)
  - Photo count
  - Status
  - Timestamps
- Shows statistics:
  - Total jobs count
  - Total photos
  - Total money
- Exports filtered data to Excel format
- Excel file includes all sync job details

### 6. **Error Handling**

- Handles API errors gracefully
- Shows error messages in dialogs
- Displays loading states during data fetching
- Handles empty states (no clients, no sync jobs)

### 7. **URL Parameters**

The route accepts the following URL search parameters:

- `shift_id` (string, optional): Shift ID to filter by
- `from_date` (string, optional): Start date for filtering
- `to_date` (string, optional): End date for filtering
- `staff_id` (string, optional): Staff ID to filter by

**Example URLs:**

- `/payments` - All payments
- `/payments?shift_id=1` - Payments for shift 1
- `/payments?from_date=2024-01-01&to_date=2024-01-31` - Payments for date range
- `/payments?staff_id=123` - Payments for staff member 123

---

## File Structure

```
payments/
├── page.tsx                          # Server component - entry point
├── _components/
│   ├── payment-page.tsx             # Main page component
│   ├── payment-table.tsx            # Clients table component
│   ├── charts-sectoin.tsx           # Charts section component
│   ├── payment-area-gradient.tsx    # Payment area chart
│   ├── filter-dialog.tsx            # Filter dialog
│   ├── export-dialog.tsx            # PDF export dialog
│   ├── export-document.tsx           # PDF document component
│   ├── receipt-dialog.tsx           # Receipt dialog
│   ├── taswera-receipt.tsx          # Receipt component
│   ├── sync-status.tsx              # Sync status component
│   ├── sync-filter-dialog.tsx       # Sync filter dialog
│   ├── shift-select.tsx             # Shift selector component
│   └── range-filter.tsx             # Date range filter component
└── _hooks/
    ├── use-branch-manager-sync.ts   # Sync status hook
    └── use-sync-filter.ts           # Sync filter hook
```
