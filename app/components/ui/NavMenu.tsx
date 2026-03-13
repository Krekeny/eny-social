"use client";

import NavLink from "./NavLink";
import FadeIn from "./FadeIn";

interface NavMenuItem {
  label: string;
  href: string;
}

interface NavMenuProps {
  items: NavMenuItem[];
  className?: string;
  itemClassName?: string;
  baseDelay?: number;
  stagger?: number;
}

export default function NavMenu({
  items,
  className = "",
  itemClassName = "",
  baseDelay = 0,
  stagger = 80,
}: NavMenuProps) {
  return (
    <div className={className}>
      {items.map((item, i) => (
        <FadeIn key={item.label} delay={baseDelay + i * stagger} className={itemClassName}>
          <NavLink href={item.href}>{item.label}</NavLink>
        </FadeIn>
      ))}
    </div>
  );
}
