"use client";

import { LogOut } from "lucide-react";
import { useRef } from "react";
import { signOut } from "@/app/actions/auth";

declare global {
  interface Window {
    Swal?: {
      fire: (options: {
        title: string;
        text: string;
        icon: "warning";
        showCancelButton: boolean;
        confirmButtonText: string;
        cancelButtonText: string;
        confirmButtonColor: string;
        cancelButtonColor: string;
      }) => Promise<{ isConfirmed: boolean }>;
    };
  }
}

export function LogoutButton() {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleLogoutClick() {
    if (!formRef.current) return;

    if (typeof window === "undefined" || !window.Swal) {
      formRef.current.requestSubmit();
      return;
    }

    const result = await window.Swal.fire({
      title: "Keluar",
      text: "Apakah Anda yakin ingin keluar dari akun ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, keluar",
      cancelButtonText: "Batal",
      confirmButtonColor: "#0f766e",
      cancelButtonColor: "#64748b",
    });

    if (result.isConfirmed) {
      formRef.current.requestSubmit();
    }
  }

  return (
    <form ref={formRef} action={signOut}>
      <button
        type="button"
        onClick={handleLogoutClick}
        className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:border-red-300 hover:bg-red-100"
      >
        <LogOut size={15} aria-hidden="true" />
        Keluar
      </button>
    </form>
  );
}
