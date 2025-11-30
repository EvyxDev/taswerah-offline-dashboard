# Employee Photos Route Documentation

## Route Path

`/[locale]/(dashboard)/employee-photos`

## Overview

The employee photos route allows users to view uploaded employee photos organized by barcode folders and import new photos. Users can select a folder containing images, assign them to employees, and upload them. The route displays folders for each barcode that has uploaded photos.

---

## Components Used

### Main Components

1. **`page.tsx`** (Server Component)

   - Entry point for the employee photos route
   - Handles server-side data fetching
   - Fetches uploaded barcodes and photographers list

2. **`Page.tsx`** (Client Component)

   - Main UI component that displays the employee photos interface
   - Shows folders for each uploaded barcode
   - Handles import dialog state
   - Displays empty state when no photos exist

### Dialog Components

3. **`import-photos-dialog.tsx`**

   - Dialog for importing and uploading employee photos
   - Contains form with employee selection and file upload
   - Handles photo upload with barcode prefix extraction
   - Validates form data before submission

4. **`file-upload-area.tsx`**

   - File upload component with drag-and-drop support
   - Processes folder selection and extracts barcode prefix
   - Displays image previews with upload status
   - Handles batch upload with progress tracking

---

## Flow

### 1. Page Load Flow

```
User navigates to /employee-photos
    ↓
page.tsx (Server Component) receives request
    ↓
Gets authentication token
    ↓
Calls GetUploadedbBarcodes(token)
    ↓
Calls GetAllPhotographers(1, 100)
    ↓
Fetches data from APIs
    ↓
Passes data to EmployeePhotosPage component
    ↓
EmployeePhotosPage renders UI with folders or empty state
```

### 2. Import Photos Flow

```
User clicks Import button
    ↓
ImportPhotosDialog opens
    ↓
User selects employees from dropdown
    ↓
User selects folder containing images
    ↓
file-upload-area extracts barcode prefix (last 5 chars of folder name)
    ↓
Images are processed and previews are generated
    ↓
If autoUpload enabled: Each photo uploads automatically
    ↓
User clicks Upload button (or auto-upload completes)
    ↓
Form validates (barcode prefix, photos, employees)
    ↓
uploadPhotosMutation.mutate() is called
    ↓
Creates FormData with photos, barcode_prefix, employee_ids
    ↓
Calls uploadPhotosAction() server action
    ↓
Server action makes POST request to API
    ↓
On success: Shows success message, closes dialog
    ↓
revalidatePath() refreshes page data
    ↓
UI updates with new folder
```

### 3. Single Photo Upload Flow (Auto-upload)

```
User selects folder with images
    ↓
file-upload-area processes files in batches
    ↓
For each file: Creates preview and queues upload
    ↓
useUploadSinglePhoto hook processes queue sequentially
    ↓
For each photo: Creates FormData and calls uploadSinglePhotoAction()
    ↓
Server action makes POST request to /temp/upload-photo
    ↓
On success: Updates file status to "success"
    ↓
On error: Updates file status to "error"
    ↓
Progress bar updates showing uploaded/failed counts
```

### 4. Approve Photos Flow

```
User clicks approve button (in dialog)
    ↓
useApprovePhotos hook is called
    ↓
Calls approvePhoto() server action
    ↓
Server action makes POST request to /temp/approve-photos
    ↓
On success: Shows success toast, closes dialog
    ↓
revalidatePath() refreshes page data
    ↓
UI updates
```

---

## Actions

### Server Actions

#### 1. `uploadPhotosAction(formData: FormData)`

**Location:** `_actions/upload-photos.ts`

**Purpose:** Uploads multiple photos with barcode prefix and employee IDs

**Parameters:**

- `formData` (FormData): Contains:
  - `photos[]`: Array of photo files
  - `barcode_prefix`: 5-character barcode prefix
  - `employee_ids[]`: Array of employee IDs

**Process:**

1. Makes POST request to `/branch-manager/photos/upload`
2. Sends FormData in request body
3. Revalidates `/` and `/employee-photos` paths
4. Returns success/error response

**API Endpoint:**

- **Method:** POST
- **URL:** `${API}/branch-manager/photos/upload`
- **Body:** FormData with photos, barcode_prefix, employee_ids[]

#### 2. `uploadSinglePhotoAction(formData: FormData)`

**Location:** `_actions/upload-single-photo.ts`

**Purpose:** Uploads a single photo to temporary storage

**Parameters:**

- `formData` (FormData): Contains:
  - `photo`: Single photo file
  - `barcode_prefix`: 5-character barcode prefix
  - `employee_id`: Employee ID (can be multiple)

**Process:**

1. Makes POST request to `/temp/upload-photo`
2. Sends FormData in request body
3. Returns success/error response

**API Endpoint:**

- **Method:** POST
- **URL:** `${NEXT_PUBLIC_API}/temp/upload-photo`
- **Body:** FormData with photo, barcode_prefix, employee_id

#### 3. `approvePhoto()`

**Location:** `_actions/approve-photo.ts`

**Purpose:** Approves all temporarily uploaded photos

**Parameters:**

- None

**Process:**

1. Makes POST request to `/temp/approve-photos`
2. Revalidates `/` and `/employee-photos` paths
3. Returns success/error response

**API Endpoint:**

- **Method:** POST
- **URL:** `${API}/temp/approve-photos`

---

## Hooks

### 1. `useUploadPhotos(options?)`

**Location:** `_hooks/use-upload-photos.ts`

**Returns:**

- `mutate`: Mutation function to upload photos
- `isPending`: Boolean indicating if upload is in progress
- `isError`: Boolean indicating if upload failed
- `isSuccess`: Boolean indicating if upload succeeded
- `error`: Error object if upload fails

**Usage:**

```typescript
const uploadPhotosMutation = useUploadPhotos({
  onSuccess: () => {
    /* handle success */
  },
  onError: (error) => {
    /* handle error */
  },
});

uploadPhotosMutation.mutate({
  photos: files,
  barcodePrefix: "12345",
  employeeIds: [1, 2, 3],
});
```

### 2. `useUploadSinglePhoto(options?)`

**Location:** `_hooks/use-upload-single-photo.ts`

**Returns:**

- `mutate`: Mutation function to upload single photo (queued)
- `clearQueue`: Function to clear upload queue
- `isLoading`: Boolean indicating if queue is processing

**Usage:**

```typescript
const { mutate, clearQueue } = useUploadSinglePhoto({
  onSuccess: () => {
    /* handle success */
  },
  onError: (error) => {
    /* handle error */
  },
});

mutate(
  {
    photo: file,
    barcodePrefix: "12345",
    employeeIds: [1, 2],
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

### 3. `useApprovePhotos(options?)`

**Location:** `_hooks/use-approve-photos.ts`

**Returns:**

- `mutate`: Mutation function to approve photos
- `isPending`: Boolean indicating if approval is in progress
- `isError`: Boolean indicating if approval failed
- `isSuccess`: Boolean indicating if approval succeeded
- `error`: Error object if approval fails

**Usage:**

```typescript
const { mutate } = useApprovePhotos({
  onClose: () => {
    /* handle close */
  },
});

mutate();
```

---

## GET Requests

### 1. `GetUploadedbBarcodes(token: string)`

**Location:** `src/lib/api/Invoice.api.ts`

**Purpose:** Fetches list of barcodes that have uploaded photos

**Parameters:**

- `token` (string): Authentication token

**API Request:**

- **Method:** GET
- **URL:** `${API}/branch-manager/staff/uploaded-barcodes`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}`

**Response Structure:**

- `barcodes`: Array of barcode strings that have uploaded photos

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

- Displays folders for each barcode that has uploaded photos
- Shows empty state when no photos have been uploaded
- Each folder represents a barcode with uploaded photos

### 2. **Photo Import**

- Provides dialog interface to import photos
- Allows selection of multiple employees/photographers
- Supports folder selection (directory input)
- Automatically extracts barcode prefix from folder name (last 5 characters)
- Validates folder name length (must be at least 5 characters)

### 3. **File Upload**

- Supports batch file upload from folder
- Processes files in batches to avoid UI blocking
- Generates image previews for selected files
- Shows upload progress with status indicators:
  - **Idle**: Not yet uploaded
  - **Uploading**: Currently uploading (yellow border)
  - **Success**: Successfully uploaded (green border)
  - **Error**: Upload failed (red border)
- Displays processing and upload progress bars
- Shows upload statistics (uploaded/total/failed)

### 4. **Auto-Upload Feature**

- Automatically uploads photos as they are selected (if enabled)
- Queues uploads sequentially to avoid overwhelming the server
- Updates file status in real-time
- Handles upload errors gracefully

### 5. **Photo Approval**

- Provides ability to approve temporarily uploaded photos
- Moves photos from temporary storage to permanent storage
- Refreshes page data after approval

### 6. **Form Validation**

- Validates barcode prefix (must be exactly 5 characters)
- Validates that at least one photo is selected
- Validates that at least one employee is selected
- Shows error messages for validation failures

### 7. **Error Handling**

- Handles API errors gracefully
- Shows user-friendly error messages
- Displays upload errors for individual files
- Shows form validation errors

---

## File Structure

```
employee-photos/
├── page.tsx                          # Server component - entry point
├── _components/
│   ├── Page.tsx                      # Main client component
│   ├── import-photos-dialog.tsx      # Import dialog
│   └── file-upload-area.tsx          # File upload component
├── _actions/
│   ├── upload-photos.ts              # Bulk upload server action
│   ├── upload-single-photo.ts        # Single upload server action
│   └── approve-photo.ts              # Approve photos server action
└── _hooks/
    ├── use-upload-photos.ts          # Bulk upload hook
    ├── use-upload-single-photo.ts    # Single upload hook
    └── use-approve-photos.ts         # Approve photos hook
```
