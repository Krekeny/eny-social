import { ArrowCircleRightIcon } from "@phosphor-icons/react";

interface ButtonCtaProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "ghost";
}

export default function ButtonCta({ href, children, className = "", variant = "default" }: ButtonCtaProps) {
  const base = "group inline-flex items-center gap-2 rounded-full py-0 pl-[14px] pr-[3px] font-['Instrument_Sans'] text-[20px] font-medium leading-[200%] tracking-[-0.6px] transition-all border-2";
  const variants = {
    default: "bg-charcoal border-transparent text-linen hover:bg-transparent hover:border-charcoal hover:text-charcoal",
    ghost: "bg-transparent border-charcoal text-charcoal hover:bg-charcoal hover:border-transparent hover:text-linen",
  };
  return (
    <a
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
      <ArrowCircleRightIcon
        className="h-8 w-8 transition-transform group-hover:translate-x-0.5"
        weight="regular"
      />
    </a>
  );
}
