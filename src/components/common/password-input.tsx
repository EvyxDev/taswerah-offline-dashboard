import React, { forwardRef, useState } from "react";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const PasswordInput = forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input> & { placeholder?: string }
>(({ placeholder, ...props }, ref) => {
  // State
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full ">
      {/* Input */}
      <Input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        {...props}
        ref={ref}
      />

      {/* Toggle visibility */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-2 rtl:right-auto rtl:left-2 top-1/2 -translate-y-1/2 h-auto w-auto p-0 hover:bg-transparent"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <VscEye size={16} className="sm:w-[18px] sm:h-[18px] text-gray-500" />
        ) : (
          <VscEyeClosed
            size={16}
            className="sm:w-[18px] sm:h-[18px] text-gray-500"
          />
        )}
        <span className="sr-only">
          {showPassword ? "Hide password" : "Show password"}
        </span>
      </Button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
