import { useEffect, useRef } from "react";

export function useRefreshOnListActivation({ isListActive, listRevision, refetch }) {
  const lastSeenActiveRef = useRef(listRevision);
  const firstRunRef = useRef(true);

  useEffect(() => {
    if (!isListActive) {
      return;
    }

    if (firstRunRef.current) {
      firstRunRef.current = false;
      lastSeenActiveRef.current = listRevision;
      return;
    }

    const changed = listRevision !== lastSeenActiveRef.current;
    lastSeenActiveRef.current = listRevision;

    if (changed) {
      refetch?.();
    }
  }, [isListActive, listRevision, refetch]);
}
