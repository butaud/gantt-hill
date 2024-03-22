import { RefObject, useMemo, useSyncExternalStore } from "react";

function subscribe(callback: (e: Event) => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

export function useDimensions<T extends HTMLElement>(
  ref: RefObject<T>,
): { width: number; height: number } {
  const dimensions = useSyncExternalStore(subscribe, () =>
    JSON.stringify({
      width: ref.current?.clientWidth ?? 0,
      height: ref.current?.clientHeight ?? 0,
    }),
  );

  return useMemo(() => JSON.parse(dimensions), [dimensions]);
}
