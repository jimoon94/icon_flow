"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function LogoIcon({ size = 24 }: { size?: number }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const frameColor = !mounted || resolvedTheme !== "dark" ? "#1e293b" : "#cbd5e1";

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 94 83.58" width={size} height={size}>
      <line fill="none" stroke={frameColor} strokeWidth="10.94" strokeLinecap="round" strokeMiterlimit="1.15" x1="68.8" y1="62.51" x2="84.41" y2="78.11"/>
      <path fill="none" stroke={frameColor} strokeWidth="9.21" strokeLinecap="round" strokeMiterlimit="1.15" d="M26.87,11.82c10.42-8.58,25.61-9.82,37.49-2.03,3.64,2.38,6.74,5.49,9.13,9.13"/>
      <path fill="none" stroke={frameColor} strokeWidth="9.21" strokeLinecap="round" strokeMiterlimit="1.15" d="M71.74,55.98c-9.18,11.52-25.49,15.39-39.12,8.44-5.95-3.04-10.8-7.88-13.83-13.83"/>
      <path fill="none" stroke="#4285f4" strokeWidth="6.33" strokeLinecap="round" strokeMiterlimit="1.15" d="M3.17,27.48c20.19-18.89,65.92,12.22,86.11-6.67"/>
      <path fill="none" stroke="#f9ab00" strokeWidth="6.33" strokeLinecap="round" strokeMiterlimit="1.15" d="M3.95,37.53c20.19-18.89,65.92,12.22,86.11-6.67"/>
      <path fill="none" stroke="#ea4335" strokeWidth="6.33" strokeLinecap="round" strokeMiterlimit="1.15" d="M4.72,47.57c20.19-18.89,65.92,12.22,86.11-6.67"/>
      <path fill="none" stroke="#94a3b8" strokeWidth="2.88" strokeLinecap="round" strokeMiterlimit="1.15" opacity="0.5" d="M33.96,16.13c4.83-3.38,10.86-4.55,16.6-3.21"/>
    </svg>
  );
}
