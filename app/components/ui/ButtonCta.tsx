import { ArrowCircleRightIcon } from "@phosphor-icons/react";

interface ButtonCtaProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function ButtonCta({ href, children, className = "" }: ButtonCtaProps) {
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-2 rounded-full bg-charcoal py-0 pl-[14px] pr-[3px] font-['Instrument_Sans'] text-[20px] font-medium leading-[200%] tracking-[-0.6px] text-linen transition-all border-2 border-transparent hover:bg-transparent hover:border-charcoal hover:text-charcoal ${className}`}
    >
      {children}
      <ArrowCircleRightIcon
        className="h-8 w-8 transition-transform group-hover:translate-x-0.5"
        weight="regular"
      />
    </a>
  );
}
