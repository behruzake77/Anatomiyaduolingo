/** Zaif telefon (Honor 9S, 2GB RAM, 4 yadro) — og'ir animatsiya/JS ni yengillashtirish. */

export function isLowEndDevice(): boolean {
  if (typeof navigator === "undefined") return false;

  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const cores = navigator.hardwareConcurrency ?? 8;
  const saveData = Boolean(
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData,
  );

  if (saveData) return true;
  if (typeof memory === "number" && memory <= 2) return true;
  if (cores <= 4 && (typeof memory !== "number" || memory <= 4)) return true;
  return false;
}

export function applyDeviceClass(): boolean {
  const low = isLowEndDevice();
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("low-end", low);
    if (low) document.documentElement.classList.add("reduce-motion");
  }
  return low;
}
