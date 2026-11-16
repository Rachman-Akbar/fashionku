import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/shared/components/ui/Input";
import { cn } from "@/shared/utils/utils";

export function PasswordInput({ className, disabled, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        disabled={disabled}
        type={visible ? "text" : "password"}
        className={cn(className, "pr-12")}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        disabled={disabled}
        aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
        title={visible ? "Sembunyikan password" : "Tampilkan password"}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 transition-colors hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {visible ? (
          <EyeOff size={18} aria-hidden="true" />
        ) : (
          <Eye size={18} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
