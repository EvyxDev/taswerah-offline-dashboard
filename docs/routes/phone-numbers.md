# Phone Numbers Route Documentation

## Route Path

`/[locale]/(dashboard)/phone-numbers`

## Overview

The phone numbers route displays a list of all phone numbers associated with the branch. Users can view phone numbers in a table format and export them to Excel.

---

## Components Used

### Main Components

1. **`page.tsx`** (Server Component)

   - Entry point for the phone numbers route
   - Handles server-side data fetching
   - Fetches phone numbers data

2. **`phone-numbers-page.tsx`** (Client Component)

   - Main UI component that displays the phone numbers interface
   - Handles breadcrumb navigation
   - Renders the phone numbers table component

3. **`phone-numbers-table.tsx`** (Client Component)

   - Displays phone numbers in a table format
   - Shows index number and phone number
   - Provides export to Excel functionality
   - Shows empty state when no phone numbers exist

---

## Flow

### 1. Page Load Flow

```
User navigates to /phone-numbers
    ↓
page.tsx (Server Component) receives request
    ↓
Calls GetPhoneNumbers()
    ↓
Fetches data from API
    ↓
Passes data to PhoneNumbersPage component
    ↓
PhoneNumbersPage renders PhoneNumbersTable with phone numbers
    ↓
PhoneNumbersTable displays phone numbers in table or empty state
```

### 2. Export to Excel Flow

```
User clicks Export Excel button
    ↓
handleExport() is called
    ↓
Calls exportPhoneNumbersToExcel(phoneNumbers)
    ↓
Generates Excel file with phone numbers
    ↓
Downloads Excel file
    ↓
Shows success toast notification
```

---

## Actions

### Server Actions

No server actions are used in this route. All data fetching is done through API functions called from server components.

---

## Hooks

No custom hooks are used in this route.

---

## GET Requests

### `GetPhoneNumbers()`

**Location:** `src/lib/api/phone-numbers.api.ts`

**Purpose:** Fetches all phone numbers for the branch

**Parameters:**

- None

**API Request:**

- **Method:** GET
- **URL:** `${API}/branch-manager/branches/phone-numbers`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}`
- **Cache:** `no-store` (always fetches fresh data)

**Response Structure:**

- `phone_numbers`: Array of phone number strings

---

## What is Done in This Route

### 1. **Data Display**

- Displays phone numbers in a table format with columns:
  - **Index**: Sequential number (1, 2, 3, ...)
  - **Phone Number**: The actual phone number
- Shows count badge with total number of phone numbers
- Displays empty state when no phone numbers exist
- Alternating row colors for better readability

### 2. **Export to Excel**

- Provides export button to download phone numbers as Excel file
- Exports all phone numbers in a structured format
- Shows success/error toast notifications
- Uses `exportPhoneNumbersToExcel` utility function

### 3. **Error Handling**

- Handles API errors gracefully
- Shows user-friendly error messages via toast notifications
- Displays empty state when no data is available

---

## File Structure

```
phone-numbers/
├── page.tsx                          # Server component - entry point
└── _components/
    ├── phone-numbers-page.tsx       # Main page component
    └── phone-numbers-table.tsx      # Phone numbers table component
```

