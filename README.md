# Taswera Offline Dashboard

A comprehensive Next.js dashboard application for managing barcodes, orders, payments, employee photos, shifts, and more. Built with modern React patterns and TypeScript.

## 🚀 Tech Stack

### Core Framework

- **Next.js 14.2.24** - React framework with App Router
- **React 18** - UI library
- **TypeScript 5** - Type safety

### State Management & Data Fetching

- **@tanstack/react-query 5.68.0** - Server state management and data fetching
- **React Hook Form 7.54.2** - Form state management
- **Zod 3.25.75** - Schema validation

### UI Components & Styling

- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Radix UI** - Headless UI components (Dialog, Select, Dropdown, etc.)
- **Lucide React** - Icon library
- **React Icons** - Additional icon sets
- **Sonner 2.0.6** - Toast notifications

### Internationalization

- **next-intl 4.0.2** - Internationalization for Next.js

### Authentication

- **NextAuth 4.24.11** - Authentication library

### Data Visualization

- **Recharts 3.0.2** - Chart library for React

### File Handling

- **@react-pdf/renderer 4.3.0** - PDF generation
- **react-pdf 10.1.0** - PDF viewer
- **xlsx 0.18.5** - Excel file generation
- **jszip 3.10.1** - ZIP file creation

### Utilities

- **date-fns 4.1.0** - Date manipulation
- **class-variance-authority** - Component variants
- **clsx & tailwind-merge** - Conditional class names

## 📁 Project Structure

```
taswerah-offline-dashboard/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── [locale]/                 # Internationalization route group
│   │   │   ├── (dashboard)/          # Dashboard route group
│   │   │   │   ├── barcodes/         # Barcodes management
│   │   │   │   ├── employee-photos/  # Employee photos management
│   │   │   │   ├── orders/           # Orders management
│   │   │   │   ├── payments/        # Payments dashboard
│   │   │   │   ├── phone-numbers/    # Phone numbers listing
│   │   │   │   ├── printed-sent/     # Printed/sent orders
│   │   │   │   ├── ready-to-print/   # Ready to print orders
│   │   │   │   ├── shifts/           # Shifts management
│   │   │   │   ├── employees/        # Employees management
│   │   │   │   ├── settings/         # Settings page
│   │   │   │   └── page.tsx          # Dashboard home
│   │   │   ├── auth/                 # Authentication routes
│   │   │   └── layout.tsx           # Root layout
│   │   └── api/                      # API routes
│   ├── components/                   # Reusable components
│   │   ├── common/                  # Common components
│   │   ├── features/                # Feature-specific components
│   │   ├── layout/                  # Layout components
│   │   ├── providers/               # Context providers
│   │   ├── skeletons/              # Loading skeletons
│   │   └── ui/                     # UI primitives (shadcn/ui)
│   ├── lib/                        # Utilities and configurations
│   │   ├── api/                    # API client functions
│   │   ├── constants/              # Constants
│   │   ├── schemes/               # Validation schemes
│   │   ├── types/                 # TypeScript types
│   │   └── utils/                 # Utility functions
│   ├── i18n/                      # Internationalization
│   │   ├── messages/              # Translation files
│   │   ├── request.ts            # i18n request handler
│   │   └── routing.ts            # i18n routing config
│   └── middleware.ts             # Next.js middleware
├── docs/                          # Documentation
│   └── routes/                    # Route documentation
│       ├── barcodes.md
│       ├── employee-photos.md
│       ├── orders.md
│       ├── payments.md
│       ├── phone-numbers.md
│       ├── printed-sent.md
│       ├── ready-to-print.md
│       └── shifts.md
├── public/                        # Static assets
└── package.json                   # Dependencies
```

## 🗂️ Route Folder Structure

Each route in the dashboard follows a consistent structure for maintainability and scalability:

```
route-name/
├── page.tsx                    # Server component - entry point
├── _components/               # Route-specific components
│   ├── route-page.tsx         # Main page component
│   ├── route-table.tsx        # Table component (if applicable)
│   └── *.tsx                  # Other components
├── _actions/                  # Server actions (Next.js 14)
│   └── *.ts                   # Server action functions
└── _hooks/                    # Custom React hooks
    └── *.ts                   # Hook functions
```

### Route Structure Explanation

1. **`page.tsx`** - Server Component that:

   - Fetches data on the server
   - Handles URL search parameters
   - Passes data to client components

2. **`_components/`** - Client Components that:

   - Handle user interactions
   - Manage local state
   - Render UI

3. **`_actions/`** - Server Actions that:

   - Perform server-side mutations
   - Handle form submissions
   - Revalidate paths after mutations

4. **`_hooks/`** - Custom Hooks that:
   - Encapsulate React Query mutations
   - Provide reusable logic
   - Handle loading and error states

## 📚 Available Routes

### 1. **Barcodes** (`/barcodes`)

- View paginated list of barcodes
- Generate new barcodes in bulk
- Reset all barcodes (with authentication)
- Filter by usage status (used/unused)

**Documentation:** [`docs/routes/barcodes.md`](docs/routes/barcodes.md)

### 2. **Employee Photos** (`/employee-photos`)

- View uploaded employee photos organized by barcode folders
- Import photos from folder with automatic barcode extraction
- Batch upload photos with progress tracking
- Approve temporarily uploaded photos

**Documentation:** [`docs/routes/employee-photos.md`](docs/routes/employee-photos.md)

### 3. **Orders** (`/orders`)

- View all orders with barcode, photo count, and phone number
- Create new orders with photo upload
- Submit payments for orders
- Cancel orders

**Documentation:** [`docs/routes/orders.md`](docs/routes/orders.md)

### 4. **Payments** (`/payments`)

- View payment dashboard with charts and statistics
- Filter payments by date range, shift, or staff
- Export payment statistics as PDF
- View sync status and export sync jobs as Excel
- Display client payment table

**Documentation:** [`docs/routes/payments.md`](docs/routes/payments.md)

### 5. **Phone Numbers** (`/phone-numbers`)

- View list of all phone numbers
- Export phone numbers to Excel

**Documentation:** [`docs/routes/phone-numbers.md`](docs/routes/phone-numbers.md)

### 6. **Printed Sent** (`/printed-sent`)

- View folders for printed barcodes
- Navigate to folder detail pages
- Filter by date (UI only)

**Documentation:** [`docs/routes/printed-sent.md`](docs/routes/printed-sent.md)

### 7. **Ready to Print** (`/ready-to-print`)

- View folders for barcodes ready to print
- Confirm print action
- Cancel orders from print dialog

**Documentation:** [`docs/routes/ready-to-print.md`](docs/routes/ready-to-print.md)

### 8. **Shifts** (`/shifts`)

- View all shifts in a table
- Create new shifts
- Update existing shifts
- Delete shifts

**Documentation:** [`docs/routes/shifts.md`](docs/routes/shifts.md)

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- Yarn package manager

### Installation

1. **Install Yarn globally** (if not already installed):

```bash
npm i -g yarn
```

2. **Delete package-lock.json** (if it exists):

```bash
rm package-lock.json
```

3. **Install dependencies**:

```bash
yarn install
```

4. **Set up environment variables**:
   Create a `.env.local` file with:

```env
NEXT_PUBLIC_API=your_api_url
API=your_api_url
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

5. **Run the development server**:

```bash
yarn dev
```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Code Organization Guidelines

Please ensure that code in **hooks** and **components** is consistently organized in the following order:

1. **Translation** – Import and define any translation-related logic
2. **Navigation** – Define any navigation-related logic or hooks
3. **State** – Declare local or global state variables
4. **Context** – Use context providers and consumers
5. **Hooks** – Call custom and built-in React hooks
6. **Ref** – Declare and manage `ref` objects
7. **Queries** – Handle data fetching queries (e.g., using React Query)
8. **Mutation** – Handle data mutation logic (e.g., using React Query)
9. **Form & Validation** – Set up form state and validation (e.g., using `react-hook-form`, `zod`)
10. **Variables** – Define any constants or variables (flexible based on context)
11. **Functions** – Define utility functions or component-specific functions
12. **Effects** – Use `useEffect` or similar side-effect hooks at the end

Following this order helps maintain code consistency, improves readability, and makes it easier to debug and scale the project.

## 🔐 Authentication

The application uses NextAuth.js for authentication. Authentication is handled through:

- Session management
- Token-based API authentication
- Protected routes via middleware

## 🌐 Internationalization

The application supports multiple languages using `next-intl`:

- English (en)
- Arabic (ar)

Translation files are located in `src/i18n/messages/`.

## 📊 Data Fetching Patterns

### Server Components

- Used for initial data fetching
- Run on the server
- No client-side JavaScript needed

### Client Components

- Used for interactive UI
- Use React Query for data fetching
- Handle mutations and real-time updates

### Server Actions

- Used for form submissions
- Run on the server
- Automatically revalidate paths after mutations

## 🎨 UI Components

The project uses a combination of:

- **shadcn/ui** - Pre-built accessible components
- **Radix UI** - Headless UI primitives
- **Custom components** - Route-specific components

All UI components are located in `src/components/ui/` and follow the shadcn/ui pattern.

## 📦 Build & Deployment

### Build for production:

```bash
yarn build
```

### Start production server:

```bash
yarn start
```

The application is configured for standalone output, making it suitable for containerized deployments.

## 📖 Documentation

Detailed documentation for each route is available in the `docs/routes/` directory:

- [Barcodes Route](docs/routes/barcodes.md)
- [Employee Photos Route](docs/routes/employee-photos.md)
- [Orders Route](docs/routes/orders.md)
- [Payments Route](docs/routes/payments.md)
- [Phone Numbers Route](docs/routes/phone-numbers.md)
- [Printed Sent Route](docs/routes/printed-sent.md)
- [Ready to Print Route](docs/routes/ready-to-print.md)
- [Shifts Route](docs/routes/shifts.md)

Each documentation file includes:

- Route path and overview
- Components used
- Flow diagrams
- Actions and hooks
- API endpoints
- Functionality breakdown
- File structure

## 🔧 Development Tools

- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Tailwind CSS** - Styling
- **PostCSS** - CSS processing

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

Please follow the code organization guidelines and maintain consistency with the existing codebase structure.
