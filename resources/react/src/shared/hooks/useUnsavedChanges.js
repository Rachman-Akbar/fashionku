import { useEffect, useRef, useCallback } from "react";
import { confirmLeaveUnsaved, confirmCancelChanges } from "@/shared/utils/sweetAlert";

export function useUnsavedChangesGuard({ isDirty, onLeave, onCancel, message }) {
  const isMounted = useRef(true);
  const cleanup = useRef(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleBeforeUnload = useCallback((event) => {
    if (!isDirty || !isMounted.current) return;
    event.preventDefault();
    event.returnValue = message || "Anda memiliki perubahan yang belum disimpan. Yakin ingin meninggalkan halaman?";
    return event.returnValue;
  }, [isDirty, message]);

  useEffect(() => {
    if (isDirty) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      cleanup.current = () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }
    return () => {
      if (cleanup.current) cleanup.current();
    };
  }, [isDirty, handleBeforeUnload]);

  const handleLeave = useCallback(async () => {
    if (!isDirty) {
      onLeave?.();
      return true;
    }
    const confirmed = await confirmLeaveUnsaved({ text: message });
    if (confirmed.isConfirmed) {
      onLeave?.();
      return true;
    }
    return false;
  }, [isDirty, onLeave, message]);

  const handleCancel = useCallback(async () => {
    if (!isDirty) {
      onCancel?.();
      return true;
    }
    const confirmed = await confirmCancelChanges({ text: message });
    if (confirmed.isConfirmed) {
      onCancel?.();
      return true;
    }
    return false;
  }, [isDirty, onCancel, message]);

  return { handleLeave, handleCancel };
}

export function useFormDirty(formData, initialData, fieldsToWatch) {
  const isDirty = useRef(false);
  
  useEffect(() => {
    if (!initialData) return;
    const watchFields = fieldsToWatch || Object.keys(initialData);
    const dirty = watchFields.some((field) => {
      const current = formData?.[field];
      const initial = initialData[field];
      return String(current || "") !== String(initial || "");
    });
    isDirty.current = dirty;
  }, [formData, initialData, fieldsToWatch]);

  return isDirty.current;
}