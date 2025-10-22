# Empty State Component Usage

## Basic Empty State

```tsx
import EmptyState from "@/components/common/empty-state";
import { Package } from "lucide-react";

<EmptyState
  icon={<Package className="w-12 h-12 text-gray-400" />}
  title="No Orders Found"
  description="You haven't created any orders yet. Start by creating your first order."
  actionButton={{
    label: "Create Order",
    onClick: () => console.log("Create order clicked"),
  }}
/>;
```

## Table Empty State

```tsx
import TableEmptyState from "@/components/common/table-empty-state";
import { Users } from "lucide-react";

// Inside your table body
{
  data?.length > 0 ? (
    data.map((item) => (
      <TableRow key={item.id}>{/* Your table cells */}</TableRow>
    ))
  ) : (
    <TableEmptyState
      colSpan={4} // Number of columns in your table
      icon={<Users className="w-12 h-12 text-gray-400" />}
      title="No Employees Found"
      description="No employees have been added yet. Add your first employee to get started."
      actionButton={{
        label: "Add Employee",
        onClick: () => console.log("Add employee clicked"),
        variant: "outline",
      }}
    />
  );
}
```

## Props

### EmptyState Props

- `icon?: ReactNode` - Icon to display
- `title: string` - Main title text
- `description?: string` - Optional description text
- `actionButton?: { label: string, onClick: () => void, variant?: string }` - Optional action button
- `className?: string` - Additional CSS classes

### TableEmptyState Props

- `colSpan: number` - Number of table columns to span
- All EmptyState props are also supported

## Common Icons

- `<Package />` - For orders/products
- `<Users />` - For employees/users
- `<CreditCard />` - For payments
- `<Clock />` - For shifts/time
- `<QrCode />` - For barcodes
- `<Camera />` - For photos
- `<Search />` - For search results
- `<AlertCircle />` - For errors
