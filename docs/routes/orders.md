# Orders Route Documentation

## Route Path

`/[locale]/(dashboard)/orders`

## Overview

The orders route allows users to view, create, submit payments for, and cancel orders. It displays a table of orders with their barcode prefixes, photo counts, and phone numbers. Users can create new orders with photos, submit payments for orders, and cancel existing orders.

---

## Components Used

### Main Components

1. **`page.tsx`** (Server Component)

   - Entry point for the orders route
   - Handles server-side data fetching
   - Fetches orders, photographers, and shifts

2. **`order-page.tsx`** (Client Component)

   - Main UI component that displays the orders interface
   - Handles breadcrumb navigation
   - Renders the order table component

3. **`order-table.tsx`** (Client Component)

   - Displays orders in a table format
   - Handles order actions (pay, cancel)
   - Manages dialog states
   - Shows empty state when no orders exist

### Dialog Components

4. **`create-dialog.tsx`**

   - Dialog for creating new orders
   - Contains form with barcode prefix, phone number, employee selection, and photo upload
   - Uses ImageUploader component for folder selection
   - Validates form data before submission

5. **`pay-dialog.tsx`**

   - Dialog for submitting payment for an order
   - Contains form with shift selection and payment amount
   - Validates payment data before submission

---

## Flow

### 1. Page Load Flow

```
User navigates to /orders
    ↓
page.tsx (Server Component) receives request
    ↓
Gets authentication token
    ↓
Calls GetAllOrders(token)
    ↓
Calls GetAllPhotographers(1, 1000)
    ↓
Calls GetShifts()
    ↓
Fetches data from APIs
    ↓
Passes data to OrderPage component
    ↓
OrderPage renders OrderTable with orders, employees, and shifts
    ↓
OrderTable displays orders in table or empty state
```

### 2. Create Order Flow

```
User clicks Create button (+ icon)
    ↓
CreateOrderDialog opens
    ↓
User selects folder containing images
    ↓
ImageUploader extracts barcode prefix (last 5 chars of folder name)
    ↓
Barcode prefix is auto-filled in form
    ↓
User enters phone number
    ↓
User selects employee from dropdown
    ↓
User selects photos (from folder)
    ↓
User clicks Submit button
    ↓
Form validates (barcode prefix, phone number, employee, photos)
    ↓
Creates FormData with barcode_prefix, phone_number, employee_id, photos[]
    ↓
Calls CreateOrder() server action
    ↓
Server action makes POST request to API
    ↓
On success: Shows success toast, closes dialog, refreshes page
    ↓
UI updates with new order
```

### 3. Pay Order Flow

```
User clicks Pay button on an order
    ↓
PayDialog opens with order barcode and ID
    ↓
User selects shift from dropdown
    ↓
User enters payment amount
    ↓
User clicks Pay Now button
    ↓
Form validates (shift, amount)
    ↓
submitOrder() from useSubmitOrder hook is called
    ↓
Hook calls SubmitOrderAction() server action
    ↓
Server action makes POST request to API
    ↓
On success: Shows success toast, closes dialog
    ↓
revalidatePath("/orders") refreshes page data
    ↓
UI updates
```

### 4. Cancel Order Flow

```
User clicks Cancel button on an order
    ↓
AlertDialog opens with confirmation
    ↓
User confirms cancellation
    ↓
confirmCancel() is called
    ↓
Calls CancelOrderAction(barcode_prefix) server action
    ↓
Server action makes POST request to API
    ↓
On success: Shows success toast, closes dialog
    ↓
On error: Shows error toast
    ↓
revalidatePath("/orders") refreshes page data
    ↓
UI updates (order removed from list)
```

---

## Actions

### Server Actions

#### 1. `CreateOrder(formData: FormData)`

**Location:** `_action/create-order.tsx`

**Purpose:** Creates a new order with photos

**Parameters:**

- `formData` (FormData): Contains:
  - `barcode_prefix`: 5-character barcode prefix
  - `phone_number`: Customer phone number
  - `employee_id`: Selected employee ID
  - `photos[]`: Array of photo files

**Process:**

1. Gets authentication token
2. Makes POST request to `/branch-manager/orders/upload-and-create`
3. Sends FormData in request body
4. Revalidates `/orders` path to refresh data
5. Returns API response

**API Endpoint:**

- **Method:** POST
- **URL:** `${NEXT_PUBLIC_API}/branch-manager/orders/upload-and-create`
- **Headers:**
  - `Authorization: Bearer {token}`
- **Body:** FormData with barcode_prefix, phone_number, employee_id, photos[]

#### 2. `SubmitOrderAction(id, data)`

**Location:** `_action/submit-order.ts`

**Purpose:** Submits payment for an order

**Parameters:**

- `id` (number | string): Order ID
- `data`: Object containing:
  - `shift_id` (number): Selected shift ID
  - `pay_amount` (number): Payment amount

**Process:**

1. Gets authentication token
2. Makes POST request to `/branch-manager/orders_submit/{id}`
3. Sends JSON body with shift_id and pay_amount
4. Revalidates `/orders` path to refresh data
5. Returns API response

**API Endpoint:**

- **Method:** POST
- **URL:** `${NEXT_PUBLIC_API}/branch-manager/orders_submit/{id}`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}`
- **Body:** `{ shift_id: number, pay_amount: number }`

#### 3. `CancelOrderAction(barcode: string)`

**Location:** `_action/cancel-order.ts`

**Purpose:** Cancels an order by barcode prefix

**Parameters:**

- `barcode` (string): Barcode prefix of the order to cancel

**Process:**

1. Gets authentication token
2. Makes POST request to `/branch-manager/orders/{barcode}/cancel`
3. Revalidates `/orders` path to refresh data
4. Returns API response

**API Endpoint:**

- **Method:** POST
- **URL:** `${NEXT_PUBLIC_API}/branch-manager/orders/{barcode}/cancel`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}`

#### 4. `UpdateInvoiceTotal(barcode, total_amount)`

**Location:** `_action/update-Invoice-total.ts`

**Purpose:** Updates the total amount of an invoice

**Parameters:**

- `barcode` (string): Barcode prefix
- `total_amount` (number): New total amount

**Process:**

1. Gets authentication token
2. Makes POST request to `/branch-manager/invoices/update-total/{barcode}`
3. Sends JSON body with total_amount
4. Revalidates `/orders` path to refresh data
5. Returns API response

**API Endpoint:**

- **Method:** POST
- **URL:** `${NEXT_PUBLIC_API}/branch-manager/invoices/update-total/{barcode}`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}`
- **Body:** `{ total_amount: number }`

---

## Hooks

### 1. `useSubmitOrder()`

**Location:** `_hooks/use-submit-order.ts`

**Returns:**

- `submitOrder`: Mutation function to submit order payment
- `isSubmitting`: Boolean indicating if submission is in progress
- `submitError`: Error object if submission fails
- `isSuccess`: Boolean indicating if submission succeeded

**Usage:**

```typescript
const { submitOrder, isSubmitting } = useSubmitOrder();

submitOrder(
  {
    orderId: 123,
    shift_id: 1,
    pay_amount: 100.0,
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

---

## GET Requests

### 1. `GetAllOrders(token: string)`

**Location:** `src/lib/api/Invoice.api.ts`

**Purpose:** Fetches all orders

**Parameters:**

- `token` (string): Authentication token

**API Request:**

- **Method:** GET
- **URL:** `${NEXT_PUBLIC_API}/branch-manager/orders?lmit=1000`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}`

**Response Structure:**

- `data`: Array of order objects containing:
  - `id`: Order ID
  - `barcode_prefix`: 5-character barcode prefix
  - `photos_count`: Number of photos in the order
  - `phone_number`: Customer phone number
  - Other order properties

### 2. `GetAllPhotographers(page, limit)`

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

### 3. `GetShifts()`

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

- Displays orders in a table format with columns:
  - **Code**: Barcode prefix
  - **No. Photos**: Number of photos in the order
  - **Phone Number**: Customer phone number
  - **Actions**: Pay and Cancel buttons
- Shows count badge with total number of orders
- Displays empty state when no orders exist
- Alternating row colors for better readability

### 2. **Order Creation**

- Provides dialog interface to create new orders
- Supports folder selection for batch photo upload
- Automatically extracts barcode prefix from folder name (last 5 characters)
- Validates barcode prefix (must be exactly 5 characters)
- Validates phone number format
- Requires employee selection
- Requires at least one photo
- Shows loading state during order creation
- Displays success/error toast notifications

### 3. **Payment Submission**

- Provides dialog interface to submit payment for orders
- Requires shift selection
- Requires payment amount input
- Validates payment amount (must be positive number)
- Shows order barcode in dialog
- Displays loading state during submission
- Shows success/error toast notifications
- Automatically refreshes data after successful submission

### 4. **Order Cancellation**

- Provides confirmation dialog before canceling
- Shows order barcode in confirmation dialog
- Displays loading state during cancellation
- Shows success/error toast notifications
- Automatically refreshes data after successful cancellation
- Removes canceled order from the list

### 5. **Form Validation**

- Validates barcode prefix (exactly 5 characters, auto-filled from folder name)
- Validates phone number (required, valid format)
- Validates employee selection (required)
- Validates photo selection (at least one required)
- Validates shift selection (required for payment)
- Validates payment amount (required, positive number)
- Shows error messages for validation failures

### 6. **Error Handling**

- Handles API errors gracefully
- Shows user-friendly error messages via toast notifications
- Displays form validation errors
- Handles network errors

---

## File Structure

```
orders/
├── page.tsx                          # Server component - entry point
├── _components/
│   ├── order-page.tsx              # Main page component
│   ├── order-table.tsx              # Orders table component
│   ├── create-dialog.tsx            # Create order dialog
│   └── pay-dialog.tsx               # Payment dialog
├── _action/
│   ├── create-order.tsx            # Create order server action
│   ├── submit-order.ts             # Submit payment server action
│   ├── cancel-order.ts             # Cancel order server action
│   └── update-Invoice-total.ts     # Update invoice total server action
└── _hooks/
    └── use-submit-order.ts          # Submit order hook
```
