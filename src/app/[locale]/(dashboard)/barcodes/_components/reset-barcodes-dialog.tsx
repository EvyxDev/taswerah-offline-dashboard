"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ResetBarcodesDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: (credentials: { email: string; password: string }) => void;
  pending?: boolean;
  disabled?: boolean;
  children: React.ReactNode; // trigger
};

export default function ResetBarcodesDialog({
  title,
  description,
  confirmLabel,
  onConfirm,
  pending,
  disabled,
  children,
}: ResetBarcodesDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleConfirm = () => {
    onConfirm({ email, password });
    setOpen(false);
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <span onClick={() => !disabled && setOpen(true)}>{children}</span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[420px] text-center font-homenaje rtl:font-almarai">
          <DialogHeader>
            <DialogTitle className="text-2xl">{title}</DialogTitle>
            <DialogDescription className="text-gray-500">
              {description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-left">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          </div>
          <DialogFooter className="flex items-center justify-center gap-3 sm:justify-center">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="font-homenaje rtl:font-almarai"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={pending || !email || !password}
              className="bg-red-600 hover:bg-red-700 text-white font-homenaje rtl:font-almarai"
            >
              {pending ? "Processing..." : confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
