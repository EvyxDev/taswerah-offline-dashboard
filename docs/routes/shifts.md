# Shifts Route Documentation

## Route Path

`/[locale]/(dashboard)/shifts`

## Overview

The shifts route allows users to view, create, update, and delete shifts. It displays a table of all shifts with their names, start times, and end times. Users can manage shifts through a form dialog.

---

## Components Used

### Main Components

1. **`page.tsx`** (Server Component)

   - Entry point for the shifts route
   - Handles server-side data fetching
   - Fetches shifts data
   - Uses Suspense for loading state

2. **`shift-page.tsx`** (Client Component)

   - Main UI component that displays the shifts interface
   - Handles breadcrumb navigation
   - Renders the shifts table component

3. **`shifts-table.tsx`** (Client Component)

   - Displays shifts in a table format
   - Shows shift name, from time, and to time
   - Manages create, edit, and delete operations
   - Handles dialog state for form

4. **`shift-header.tsx`** (Client Component)

   - Displays header with shift count badge
   - Provides create button
   - Shows total number of shifts

5. **`shift-actions-cell.tsx`** (Client Component)

   - Displays action buttons for each shift row
   - Provides edit and delete buttons
   - Handles action button clicks

6. **`shift-form-dialog.tsx`**

   - Dialog for creating or editing shifts
   - Contains form with name, from time, and to time fields
   - Validates form data before submission
   - Supports both create and edit modes

7. **`employee-skeleton.tsx`** (Client Component)

   - Loading skeleton component
   - Used in Suspense fallback

---

## Flow

### 1. Page Load Flow

```
User navigates to /shifts
    ↓
page.tsx (Server Component) receives request
    ↓
Calls GetShifts()
    ↓
Fetches shifts data from API
    ↓
Wraps ShiftPage in Suspense with skeleton fallback
    ↓
Passes data to ShiftPage component
    ↓
ShiftPage renders ShiftsTable with shifts
    ↓
ShiftsTable displays shifts in table
```

### 2. Create Shift Flow

```
User clicks Create button
    ↓
openCreate() is called
    ↓
Sets editingShift to null and opens dialog
    ↓
ShiftFormDialog opens in create mode
    ↓
User enters shift name, from time, and to time
    ↓
User clicks Save button
    ↓
Form validates (name required, times in HH:mm format)
    ↓
onSubmit() calls addShift() from useCreateShift hook
    ↓
Hook calls createShift() server action
    ↓
Server action calls CreateShift() API function
    ↓
API makes POST request
    ↓
On success: Shows success toast, closes dialog, refreshes page
    ↓
UI updates with new shift
```

### 3. Edit Shift Flow

```
User clicks Edit button on a shift
    ↓
openEdit(shift) is called
    ↓
Sets editingShift and opens dialog
    ↓
ShiftFormDialog opens in edit mode with shift data
    ↓
User modifies shift name, from time, or to time
    ↓
User clicks Save button
    ↓
Form validates
    ↓
onSubmit() calls updateShift() from useUpdateShift hook
    ↓
Hook calls updateShift() server action
    ↓
Server action calls UpdateShift() API function
    ↓
API makes PUT request
    ↓
On success: Shows success toast, closes dialog, refreshes page
    ↓
UI updates with modified shift
```

### 4. Delete Shift Flow

```
User clicks Delete button on a shift
    ↓
onDelete(shift.id) is called
    ↓
Calls deleteShift() from useDeleteShift hook
    ↓
Hook calls deleteShift() server action
    ↓
Server action calls DeleteShift() API function
    ↓
API makes DELETE request
    ↓
On success: Shows success toast, refreshes page
    ↓
UI updates (shift removed from list)
```

---

## Actions

### Server Actions

#### 1. `createShift(data)`

**Location:** `_actions/create-shift.ts`

**Purpose:** Creates a new shift

**Parameters:**

- `data` (TCreateShiftBody): Object containing:
  - `name`: Shift name
  - `from`: Start time (HH:mm format)
  - `to`: End time (HH:mm format)

**Process:**

1. Calls CreateShift() API function
2. Revalidates `/shifts` path to refresh data
3. Returns API response

**API Endpoint:**

- **Method:** POST
- **URL:** `${NEXT_PUBLIC_API}/branch-manager/shifts`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}`
- **Body:** `{ name: string, from: string, to: string }`

#### 2. `updateShift(id, data)`

**Location:** `_actions/update-shift.ts`

**Purpose:** Updates an existing shift

**Parameters:**

- `id` (number | string): Shift ID
- `data` (TUpdateShiftBody): Object containing:
  - `name`: Shift name
  - `from`: Start time (HH:mm format)
  - `to`: End time (HH:mm format)

**Process:**

1. Calls UpdateShift() API function
2. Revalidates `/shifts` path to refresh data
3. Returns API response

**API Endpoint:**

- **Method:** PUT
- **URL:** `${NEXT_PUBLIC_API}/branch-manager/shifts/{id}`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}`
- **Body:** `{ name: string, from: string, to: string }`

#### 3. `deleteShift(id)`

**Location:** `_actions/delete-shift.ts`

**Purpose:** Deletes a shift

**Parameters:**

- `id` (number | string): Shift ID

**Process:**

1. Calls DeleteShift() API function
2. Revalidates `/shifts` path to refresh data
3. Returns API response

**API Endpoint:**

- **Method:** DELETE
- **URL:** `${NEXT_PUBLIC_API}/branch-manager/shifts/{id}`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}`

---

## Hooks

### 1. `useCreateShift()`

**Location:** `_hooks/use-create-shift.ts`

**Returns:**

- `addShift`: Mutation function to create shift
- `isAdding`: Boolean indicating if creation is in progress
- `addError`: Error object if creation fails

**Usage:**

```typescript
const { addShift, isAdding } = useCreateShift();

addShift(
  { name: "Morning", from: "09:00", to: "17:00" },
  {
    onSuccess: () => {
      /* handle success */
    },
    onError: (error) => {
      /* handle error */
    },
  }
);
```

### 2. `useUpdateShift()`

**Location:** `_hooks/use-update-shift.ts`

**Returns:**

- `updateShift`: Mutation function to update shift
- `isUpdating`: Boolean indicating if update is in progress
- `updateError`: Error object if update fails

**Usage:**

```typescript
const { updateShift, isUpdating } = useUpdateShift();

updateShift(
  {
    id: 1,
    data: { name: "Evening", from: "17:00", to: "01:00" },
  },
  {
    onSuccess: () => {
      /* handle success */
    },
    onError: (error) => {
      /* handle error */
    },
  }
);
```

### 3. `useDeleteShift()`

**Location:** `_hooks/use-delete-shift.ts`

**Returns:**

- `deleteShift`: Mutation function to delete shift
- `isDeleting`: Boolean indicating if deletion is in progress
- `deleteError`: Error object if deletion fails

**Usage:**

```typescript
const { deleteShift, isDeleting } = useDeleteShift();

deleteShift(1, {
  onSuccess: () => {
    /* handle success */
  },
  onError: (error) => {
    /* handle error */
  },
});
```

---

## GET Requests

### `GetShifts()`

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

---

## What is Done in This Route

### 1. **Data Display**

- Displays shifts in a table format with columns:
  - **Name**: Shift name
  - **From**: Start time (displayed as HH:mm)
  - **To**: End time (displayed as HH:mm)
  - **Actions**: Edit and Delete buttons
- Shows count badge with total number of shifts
- Alternating row colors for better readability

### 2. **Shift Creation**

- Provides dialog interface to create new shifts
- Form fields:
  - Name (required, max 100 characters)
  - From time (required, HH:mm format)
  - To time (required, HH:mm format)
- Validates form data before submission
- Shows loading state during creation
- Displays success/error toast notifications
- Automatically refreshes data after successful creation

### 3. **Shift Update**

- Provides dialog interface to edit existing shifts
- Pre-fills form with current shift data
- Same validation as create form
- Shows loading state during update
- Displays success/error toast notifications
- Automatically refreshes data after successful update

### 4. **Shift Deletion**

- Provides delete button for each shift
- Shows loading state during deletion
- Displays success/error toast notifications
- Automatically refreshes data after successful deletion
- Removes deleted shift from the list

### 5. **Form Validation**

- Validates shift name (required, max 100 characters)
- Validates from time (required, HH:mm format)
- Validates to time (required, HH:mm format)
- Shows error messages for validation failures
- Uses Zod schema for validation

### 6. **Error Handling**

- Handles API errors gracefully
- Shows user-friendly error messages via toast notifications
- Displays form validation errors
- Handles network errors

### 7. **Loading States**

- Uses Suspense for initial page load
- Shows skeleton component during loading
- Displays loading states for mutations (create, update, delete)
- Disables buttons during operations

---

## File Structure

```
shifts/
├── page.tsx                          # Server component - entry point
├── _components/
│   ├── shift-page.tsx               # Main page component
│   ├── shifts-table.tsx             # Shifts table component
│   ├── shift-header.tsx             # Header with create button
│   ├── shift-actions-cell.tsx       # Action buttons component
│   ├── shift-form-dialog.tsx        # Create/edit form dialog
│   └── employee-skeleton.tsx        # Loading skeleton
├── _actions/
│   ├── create-shift.ts              # Create shift server action
│   ├── update-shift.ts              # Update shift server action
│   └── delete-shift.ts              # Delete shift server action
└── _hooks/
    ├── use-create-shift.ts          # Create shift hook
    ├── use-update-shift.ts          # Update shift hook
    └── use-delete-shift.ts          # Delete shift hook
```
