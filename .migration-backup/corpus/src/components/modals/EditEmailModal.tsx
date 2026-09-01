"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { updateEmail } from "@/lib/auth";
import { useStrings } from "@/i18n";

interface EditEmailModalProps {
  onClose: () => void;
}

export function EditEmailModal({ onClose }: EditEmailModalProps) {
  const currentUser = useAppStore((s) => s.currentUser);
  const [newEmail, setNewEmail] = useState(currentUser?.email || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const t = useStrings();

  const handleSave = async () => {
    if (!newEmail.trim()) {
      setError("Email bo'sh bo'lishi mumkin emas");
      return;
    }

    if (!newEmail.includes("@")) {
      setError("Email manzili noto'g'ri");
      return;
    }

    if (newEmail === currentUser?.email) {
      setError("Yangi email bilan bir xil");
      return;
    }

    setLoading(true);
    const result = await updateEmail(newEmail);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || "Xatolik yuz berdi");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50">
      <div className="w-full animate-in slide-in-from-bottom-5 rounded-t-2xl bg-surface p-5">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold">Email manzilini o'zgartirish</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-surface2"
            aria-label="Yopish"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <div className="rounded-xl bg-success/10 p-4 mb-4 text-success">
            <p className="font-medium">Email o'zgartirildi!</p>
            <p className="text-sm mt-1">Yangi email manzilini tasdiqlash uchun pochtangizdagi linkni bosing.</p>
          </div>
        ) : (
          <>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
                setError("");
              }}
              placeholder="Yangi email manzili"
              className="w-full rounded-xl border border-line bg-surface2 px-4 py-3 mb-4"
            />

            {error && <div className="mb-4 text-sm text-danger">{error}</div>}
          </>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-line px-4 py-3 font-medium transition hover:bg-surface2"
          >
            {success ? "Yopish" : "Bekor qilish"}
          </button>
          {!success && (
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 rounded-xl bg-primary px-4 py-3 font-medium text-white transition hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
