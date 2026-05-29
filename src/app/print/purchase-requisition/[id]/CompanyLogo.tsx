"use client";

import { useState } from "react";

export default function CompanyLogo({ src, alt, className, style }: { src: string; alt: string; className?: string; style?: React.CSSProperties }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return <span className={className} style={{ fontWeight: 'bold', fontSize: '14px', ...style }}>COMPANY LOGO</span>;
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      style={style} 
      onError={() => setError(true)} 
    />
  );
}
