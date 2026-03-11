interface SectionIntroLabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionIntroLabel({ children, className = "" }: SectionIntroLabelProps) {
  return (
    <span className={`section-intro-label ${className}`}>
      {children}
    </span>
  );
}
