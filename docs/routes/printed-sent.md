# Printed Sent Route Documentation

## Route Path

`/[locale]/(dashboard)/printed-sent`

## Overview

The printed sent route displays a list of barcodes that have been printed. Users can view folders for each printed barcode and navigate to individual folder pages to see the photos. The route also includes a date filter dropdown.

---

## Components Used

### Main Components

1. **`page.tsx`** (Server Component)

   - Entry point for the printed sent route
   - Handles server-side data fetching
   - Fetches printed barcodes data

2. **`printed-page.tsx`** (Client Component)

   - Main UI component that displays the printed barcodes
   - Handles breadcrumb navigation
   - Displays folders for each printed barcode
   - Manages date filter dropdown
   - Shows empty state when no printed barcodes exist

3. **`folder/[folderId]/page.tsx`** (Server Component)

   - Dynamic route for individual folder pages
   - Fetches photos for a specific barcode
   - Displays folder page component

4. **`folder/[folderId]/_components/folder-pagr.tsx`** (Client Component)

   - Displays photos for a specific barcode folder
   - Shows photos in the folder

---

## Flow

### 1. Page Load Flow

```
User navigates to /printed-sent
    ↓
page.tsx (Server Component) receives request
    ↓
Gets authentication token
    ↓
Calls GetOrdersBySendType(token, "print")
    ↓
Fetches printed barcodes from API
    ↓
Passes data to PrintedPage component
    ↓
PrintedPage renders folders for each barcode
```

### 2. Folder Navigation Flow

```
User clicks on a folder
    ↓
Navigates to /printed-sent/folder/{barcode}
    ↓
folder/[folderId]/page.tsx receives request
    ↓
Gets authentication token
    ↓
Calls getPhotosByBarcode(token, folderId)
    ↓
Fetches photos for the barcode
    ↓
Passes data to FolderPage component
    ↓
FolderPage displays photos
```

### 3. Date Filter Flow

```
User clicks date filter dropdown
    ↓
Dropdown menu opens with date options
    ↓
User selects a date option
    ↓
handleDateChange(date) is called
    ↓
Updates selectedDate state
    ↓
UI updates with selected date label
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

### 1. `GetOrdersBySendType(token, type)`

**Location:** `src/lib/api/barcodes.ts`

**Purpose:** Fetches orders by send type (print or send)

**Parameters:**

- `token` (string): Authentication token
- `type` ("print" | "send"): Type of send operation

**API Request:**

- **Method:** GET
- **URL:** `${NEXT_PUBLIC_API}/branch-manager/orders/by-send-type?type={type}`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}`
- **Cache:** `no-store` (always fetches fresh data)

**Response Structure:**

- `barcodes`: Array of barcode strings

### 2. `getPhotosByBarcode(token, barcode)`

**Location:** `src/lib/api/barcodes.ts`

**Purpose:** Fetches photos for a specific barcode

**Parameters:**

- `token` (string): Authentication token
- `barcode` (string): Barcode prefix to fetch photos for

**API Request:**

- **Method:** GET
- **URL:** `${API}/branch-manager/photos/printed/{barcode}`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}`

**Response Structure:**

- Array of photo objects

---

## What is Done in This Route

### 1. **Data Display**

- Displays folders for each printed barcode
- Each folder is clickable and navigates to folder detail page
- Shows empty state when no printed barcodes exist
- Folders are displayed in a flex wrap layout

### 2. **Date Filtering**

- Provides dropdown filter with predefined date options
- Shows selected date in filter button
- Date filter is currently for display only (does not filter data)
- Uses date options from constants

### 3. **Folder Navigation**

- Clicking a folder navigates to `/printed-sent/folder/{barcode}`
- Folder detail page displays photos for that barcode
- Uses Next.js dynamic routing

### 4. **Error Handling**

- Handles API errors gracefully
- Shows empty state when no data is available

---

## File Structure

```
printed-sent/
├── page.tsx                          # Server component - entry point
├── _components/
│   └── printed-page.tsx            # Main page component
└── folder/
    └── [folderId]/
        ├── page.tsx                 # Folder detail server component
        └── _components/
            └── folder-pagr.tsx      # Folder detail client component
```

