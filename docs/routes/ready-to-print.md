# Ready to Print Route Documentation

## Route Path

`/[locale]/(dashboard)/ready-to-print`

## Overview

The ready to print route displays a list of barcodes that are ready to be printed. Users can click on a folder to open a dialog where they can confirm printing or cancel the order. The route shows folders for each barcode that has photos ready for printing.

---

## Components Used

### Main Components

1. **`page.tsx`** (Server Component)

   - Entry point for the ready to print route
   - Handles server-side data fetching
   - Fetches ready to print barcodes data

2. **`ready-to-print-page.tsx`** (Client Component)

   - Main UI component that displays the ready to print barcodes
   - Handles breadcrumb navigation
   - Displays folders for each barcode
   - Manages dialog state for print confirmation
   - Shows empty state when no barcodes are ready

### Dialog Components

3. **`ready-to-print-dialog.tsx`**

   - Dialog for confirming print action or canceling order
   - Displays confirmation message with plane icon
   - Provides two actions: Print Photos and Cancel Order
   - Handles print and cancel operations

---

## Flow

### 1. Page Load Flow

```
User navigates to /ready-to-print
    ↓
page.tsx (Server Component) receives request
    ↓
Gets authentication token
    ↓
Calls GetReadyToPrintCodes(token)
    ↓
Fetches ready to print barcodes from API
    ↓
Passes data to ReadyToPrintPage component
    ↓
ReadyToPrintPage renders folders for each barcode
```

### 2. Print Confirmation Flow

```
User clicks on a folder
    ↓
handleFolderClick(barcode) is called
    ↓
Sets selectedCodePrefix and opens dialog
    ↓
ReadyToPrintDialog opens with barcode
    ↓
User clicks Print Photos button
    ↓
handleConfirm() is called
    ↓
Calls SendPhotosAction(barcode, "print") server action
    ↓
Server action makes GET request to API
    ↓
On success: Shows success toast, closes dialog
    ↓
On error: Shows error toast
    ↓
revalidatePath("/ready-to-print") refreshes page data
    ↓
UI updates (barcode removed from list)
```

### 3. Cancel Order Flow

```
User clicks on a folder
    ↓
ReadyToPrintDialog opens
    ↓
User clicks Cancel Order button
    ↓
handleCancelOrder() is called
    ↓
Calls CancelOrderAction(barcode) server action
    ↓
Server action makes POST request to API
    ↓
On success: Shows success toast, closes dialog
    ↓
On error: Shows error toast
    ↓
revalidatePath("/ready-to-print") refreshes page data
    ↓
UI updates (barcode removed from list)
```

---

## Actions

### Server Actions

#### 1. `SendPhotosAction(orderId, sendType)`

**Location:** `_actoin/send-photos.ts`

**Purpose:** Sends or prints photos for an order

**Parameters:**

- `orderId` (string | number): Order ID or barcode prefix
- `sendType` ("send" | "print" | "print_and_send"): Type of operation

**Process:**

1. Gets authentication token
2. Makes GET request to `/branch-manager/orders/{orderId}/photos?send_type={sendType}`
3. Revalidates `/ready-to-print` path to refresh data
4. Returns API response

**API Endpoint:**

- **Method:** GET
- **URL:** `${API}/branch-manager/orders/{orderId}/photos?send_type={sendType}`
- **Headers:**
  - `Authorization: Bearer {token}`
- **Cache:** `no-store` (always fetches fresh data)

#### 2. `PrintConfirmation(id, method)`

**Location:** `_actoin/print-confirmation.ts`

**Purpose:** Confirms print method for an invoice

**Parameters:**

- `id` (string): Invoice ID
- `method` (string): Print method

**Process:**

1. Gets authentication token
2. Makes POST request to `/branch-manager/invoices/{id}`
3. Sends JSON body with invoice_method
4. Returns API response

**API Endpoint:**

- **Method:** POST
- **URL:** `${API}/branch-manager/invoices/{id}`
- **Headers:**
  - `Content-Type: application/x-www-form-urlencoded`
  - `Authorization: Bearer {token}`
- **Body:** `{ invoice_method: string }`

---

## Hooks

### 1. `useComfirmPrint()`

**Location:** `_hooks/use-comfirm-print.ts`

**Purpose:** Hook for confirming print operations

**Returns:**

- Mutation function and loading states for print confirmation

### 2. `useGetInvoice()`

**Location:** `_hooks/use-get-invoice.ts`

**Purpose:** Hook for fetching invoice data

**Returns:**

- Query function and data for invoice fetching

---

## GET Requests

### `GetReadyToPrintCodes(token: string)`

**Location:** `src/lib/api/Invoice.api.ts`

**Purpose:** Fetches barcodes that are ready to be printed

**Parameters:**

- `token` (string): Authentication token

**API Request:**

- **Method:** GET
- **URL:** `${API}/branch-manager/photos/ready-to-print`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}`

**Response Structure:**

- `barcodes`: Array of barcode strings that are ready to print

---

## What is Done in This Route

### 1. **Data Display**

- Displays folders for each barcode that is ready to print
- Each folder is clickable and opens print confirmation dialog
- Shows empty state when no barcodes are ready
- Folders are displayed in a flex wrap layout

### 2. **Print Confirmation**

- Provides dialog interface to confirm printing
- Displays confirmation message with visual icon
- Shows barcode in dialog context
- Handles print operation via API
- Shows success/error toast notifications
- Automatically refreshes data after successful print

### 3. **Order Cancellation**

- Provides ability to cancel order from print dialog
- Uses same cancel functionality as orders route
- Shows success/error toast notifications
- Automatically refreshes data after successful cancellation

### 4. **Error Handling**

- Handles API errors gracefully
- Shows user-friendly error messages via toast notifications
- Displays empty state when no data is available

---

## File Structure

```
ready-to-print/
├── page.tsx                          # Server component - entry point
├── _components/
│   ├── ready-to-print-page.tsx      # Main page component
│   └── ready-to-print-dialog.tsx   # Print confirmation dialog
├── _actoin/
│   ├── send-photos.ts               # Send/print photos server action
│   └── print-confirmation.ts        # Print confirmation server action
└── _hooks/
    ├── use-comfirm-print.ts         # Print confirmation hook
    └── use-get-invoice.ts           # Invoice fetching hook
```

