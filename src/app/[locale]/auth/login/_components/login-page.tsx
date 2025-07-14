"use client";
import React from "react";
import { Dialog } from "@/components/ui/dialog";
import LoginDialog from "./login-dialog";

export default function LoginPage() {
  return (
    <div
      className="relative h-screen bg-cover bg-main-black"
      style={{ backgroundImage: "url('/assets/RUSHHUB.png')" }}
    >
      {/* Always-open Dialog */}
      <Dialog open={true}>
        <LoginDialog />
      </Dialog>
    </div>
  );
}
