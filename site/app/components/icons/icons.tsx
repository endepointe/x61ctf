
export function IconShieldKeyhole(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M12 2l7 3v6.2c0 4.9-3.1 9.3-7 10.8-3.9-1.5-7-5.9-7-10.8V5l7-3z" />
      <circle cx="12" cy="10" r="2.25" fill="currentColor" />
      <rect x="11.25" y="12.5" width="1.5" height="3.5" rx="0.75" fill="currentColor" />
    </svg>
  );
}

export function IconCipherWheel(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" fill="none" />
      <circle cx="12" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const r1 = 8.7,
          r2 = 10;
        const x1 = 12 + r1 * Math.cos(a);
        const y1 = 12 + r1 * Math.sin(a);
        const x2 = 12 + r2 * Math.cos(a);
        const y2 = 12 + r2 * Math.sin(a);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1" />;
      })}
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function IconWaveProbe(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.75" fill="none" />
      <path
        d="M4.5 12h3l1.3-3.2 2.2 7 2.1-6 1.7 4.2h3.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M18.5 15.5l2.8 2.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="21.7" cy="18.7" r="1" fill="currentColor" />
    </svg>
  );
}

export function IconKeycard(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.75" fill="none" />
      <rect x="5.5" y="9" width="7.5" height="1.8" rx="0.9" fill="currentColor" />
      <rect x="5.5" y="12.2" width="4.5" height="1.8" rx="0.9" fill="currentColor" opacity="0.85" />
      <circle cx="17" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="17" cy="12" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function IconMenu(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconClose(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

