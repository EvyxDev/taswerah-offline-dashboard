# Barcodes Route Documentation

## Route Path

`/[locale]/(dashboard)/barcodes`

## Overview

The barcodes route allows users to view, generate, and reset barcodes. It displays a paginated list of barcodes with filtering capabilities and provides actions to generate new barcodes or reset existing ones.

---

## Components Used

### Main Components

1. **`page.tsx`** (Server Component)

   - Entry point for the barcodes route
   - Handles server-side data fetching
   - Processes URL search parameters (page, limit, filter)

2. **`barcodes-page.tsx`** (Client Component)
   - Main UI component that displays the barcodes table
   - Handles user interactions and state management
   - Manages pagination and filtering

### Dialog Components

3. **`generate-barcodes-dialog.tsx`**

   - Dialog for generating new barcodes
   - Contains form to input quantity
   - Triggers barcode generation action

4. **`reset-barcodes-dialog.tsx`**
   - Dialog for resetting barcodes
   - Requires email and password authentication
   - Triggers barcode reset action

---

## Flow

### 1. Page Load Flow

```
User navigates to /barcodes
    ↓
page.tsx (Server Component) receives request
    ↓
Extracts searchParams (page, limit, filter)
    ↓
Calls GetUserBarcodes(page, limit, filter)
    ↓
Fetches data from API
    ↓
Passes data to BarcodesPage component
    ↓
BarcodesPage renders UI with barcodes data
```

### 2. Filter Flow

```
User selects filter (All/Unused)
    ↓
handleFilterChange() is called
    ↓
Updates URL search params (page=1, filter=yes/all)
    ↓
Router navigates to new URL
    ↓
page.tsx re-executes with new searchParams
    ↓
Fetches filtered data
    ↓
UI updates with filtered results
```

### 3. Pagination Flow

```
User clicks page number
    ↓
handlePageChange(newPage) is called
    ↓
Updates URL search params (page, limit, filter)
    ↓
Router navigates to new URL
    ↓
page.tsx re-executes with new searchParams
    ↓
Fetches data for new page
    ↓
UI updates with new page data
```

### 4. Generate Barcodes Flow

```
User clicks Generate button (+ icon)
    ↓
GenerateBarcodesDialog opens
    ↓
User enters quantity
    ↓
User clicks Generate button in dialog
    ↓
onSubmit() calls generate() from useGenerateBarcodes hook
    ↓
Hook calls generateBarcodes() server action
    ↓
Server action makes POST request to API
    ↓
On success: Shows success toast, closes dialog
    ↓
revalidatePath("/barcodes") refreshes page data
    ↓
UI updates with new barcodes
```

### 5. Reset Barcodes Flow

```
User clicks Reset button (RotateCw icon)
    ↓
ResetBarcodesDialog opens
    ↓
User enters email and password
    ↓
User clicks confirm button
    ↓
handleReset() calls Reset() from useResetBarcodes hook
    ↓
Hook calls resetBarcodes() server action
    ↓
Server action makes POST request to API
    ↓
On success: Shows success toast
    ↓
On error: Shows error toast
    ↓
revalidatePath("/barcodes") refreshes page data
    ↓
UI updates with reset barcodes
```

---

## Actions

### Server Actions

#### 1. `generateBarcodes(quantity: number)`

**Location:** `_actions/generate-barcodes.ts`

**Purpose:** Generates new barcodes in bulk

**Parameters:**

- `quantity` (number): Number of barcodes to generate

**Process:**

1. Gets authentication token
2. Makes POST request to `/branch-manager/users/generate-barcodes`
3. Sends `{ quantity }` in request body
4. Revalidates `/barcodes` path to refresh data
5. Returns API response

**API Endpoint:**

- **Method:** POST
- **URL:** `${NEXT_PUBLIC_API}/branch-manager/users/generate-barcodes`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}`
- **Body:** `{ quantity: number }`

#### 2. `resetBarcodes(credentials?: { email?: string; password?: string })`

**Location:** `_actions/reset-barcodes.ts`

**Purpose:** Resets all barcodes (requires manager credentials)

**Parameters:**

- `credentials` (optional): Object containing email and password

**Process:**

1. Gets authentication token
2. Makes POST request to `/user-interface/reset-barcodes`
3. Sends `{ manager_email, manager_password }` in request body
4. Revalidates `/barcodes` path to refresh data
5. Returns API response

**API Endpoint:**

- **Method:** POST
- **URL:** `${NEXT_PUBLIC_API}/user-interface/reset-barcodes`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}`
- **Body:** `{ manager_email: string, manager_password: string }`

---

## Hooks

### 1. `useGenerateBarcodes()`

**Location:** `_hooks/use-generate-barcodes.ts`

**Returns:**

- `generate`: Mutation function to generate barcodes
- `generating`: Boolean indicating if generation is in progress
- `generateError`: Error object if generation fails

**Usage:**

```typescript
const { generate, generating } = useGenerateBarcodes();
generate(
  { quantity: 100 },
  {
    onSuccess: () => {
      /* handle success */
    },
    onError: () => {
      /* handle error */
    },
  }
);
```

### 2. `useResetBarcodes()`

**Location:** `_hooks/use-reset-barcodes.ts`

**Returns:**

- `Reset`: Mutation function to reset barcodes
- `Reseting`: Boolean indicating if reset is in progress
- `ResetError`: Error object if reset fails

**Usage:**

```typescript
const { Reset, Reseting } = useResetBarcodes();
Reset(
  { email, password },
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

---

## GET Requests

### `GetUserBarcodes(page, perPage, filter?)`

**Location:** `src/lib/api/barcodes.ts`

**Purpose:** Fetches paginated list of user barcodes

**Parameters:**

- `page` (number, default: 1): Page number
- `perPage` (number, default: 15): Items per page
- `filter` (optional): `"yes"` for used barcodes, `"no"` for unused, `undefined` for all

**API Request:**

- **Method:** GET
- **URL:** `${NEXT_PUBLIC_API}/branch-manager/users/barcodes`
- **Query Parameters:**
  - `per_page`: Number of items per page
  - `page`: Page number
  - `filter`: Optional filter value ("yes" for used barcodes)
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}`
- **Cache:** `no-store` (always fetches fresh data)

---

## What is Done in This Route

### 1. **Data Display**

- Displays paginated list of barcodes in a table format
- Shows barcode value and usage status (Used/Unused)
- Displays count badge showing number of barcodes on current page
- Shows empty state when no barcodes exist

### 2. **Filtering**

- Allows filtering barcodes by usage status:
  - **All**: Shows all barcodes (used and unused)
  - **Unused**: Shows only unused barcodes (filter="yes")
- Filter state is maintained in URL search parameters
- Filtering resets to page 1

### 3. **Pagination**

- Implements pagination with configurable page size (default: 10)
- Page state is maintained in URL search parameters
- Shows pagination controls when barcodes exist
- Supports navigation between pages

### 4. **Barcode Generation**

- Provides dialog interface to generate new barcodes
- User can specify quantity of barcodes to generate
- Validates quantity (must be > 0)
- Shows loading state during generation
- Displays success/error toast notifications
- Automatically refreshes data after successful generation

### 5. **Barcode Reset**

- Provides dialog interface to reset all barcodes
- Requires manager email and password for security
- Shows loading state during reset operation
- Displays success/error toast notifications
- Automatically refreshes data after successful reset
- Reset button is disabled when no barcodes exist

---

## File Structure

```
barcodes/
├── page.tsx                          # Server component - entry point
├── _components/
│   ├── barcodes-page.tsx            # Main client component
│   ├── generate-barcodes-dialog.tsx # Generate dialog
│   └── reset-barcodes-dialog.tsx    # Reset dialog
├── _actions/
│   ├── generate-barcodes.ts         # Generate server action
│   └── reset-barcodes.ts            # Reset server action
└── _hooks/
    ├── use-generate-barcodes.ts      # Generate hook
    └── use-reset-barcodes.ts        # Reset hook
```
