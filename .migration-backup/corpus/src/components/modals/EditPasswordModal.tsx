"use client";

import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { updatePassword } from "@/lib/auth";
import { useStrings } from "@/i18n";

interface EditPasswordModalProps {
  onClose: () => void;
}

export function EditPasswordModal({ onClose }: EditPasswordModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const t = useStrings();

  const handleSave = async () => {
    if (!newPassword.trim()) {
      setError("Parol bo'sh bo'lishi mumkin emas");
      return;
    }

    if (newPassword.length < 6) {
      setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Parollar bir xil emas");
      return;
    }

    setLoading(true);
    const result = await updatePassword(newPassword);
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
          <h2 className="text-lg font-bold">Parolni o'zgartirish</h2>
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
            <p className="font-medium">Parol o'zgartirildi!</p>
            <p className="text-sm mt-1">Keyingi kirish uchun yangi parolni ishlating.</p>
          </div>
        ) : (
          <>
            {/* New Password */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">Yangi parol</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Kamida 6 ta belgidan iborat"
                  className="w-full rounded-xl border border-line bg-surface2 px-4 py-3 pr-10"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">Parolni tasdiqlash</label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                placeholder="Parolni qayta kiriting"
                className="w-full rounded-xl border border-line bg-surface2 px-4 py-3"
              />
            </div>

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
