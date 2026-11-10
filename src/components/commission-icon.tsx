import { cn } from "cn";

type CommissionIconProps = {
  className?: string;
};

export function CommissionIcon({ className }: CommissionIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-[18px]", className)} fill="none" aria-hidden="true">
      <path
        d="M9.7 3.4c-4.2 0-7.5 3.2-7.5 7.1 0 3.8 2.6 7 6 7h1.3c.8 0 1.4.6 1.4 1.4 0 .9.8 1.5 1.7 1.5 4.4 0 7.9-3.6 7.9-8 0-5-4.7-9-10.8-9Z"
        fill="currentColor"
        opacity="0.26"
      />
      <circle cx="6.7" cy="9.2" r="1.2" fill="currentColor" opacity="0.58" />
      <circle cx="10" cy="7.6" r="1.15" fill="currentColor" opacity="0.58" />
      <circle cx="13.1" cy="9.2" r="1.15" fill="currentColor" opacity="0.58" />
      <path
        d="M15.4 3.5a1 1 0 0 1 1.9.6l-2.8 8.9a1 1 0 0 1-1.2.7l-.4-.1a1 1 0 0 1-.7-1.2l3.2-8.9Z"
        fill="currentColor"
        opacity="0.5"
      />
      <path
        d="M12.1 15.9a2.3 2.3 0 0 1 3.3 0l.4.4-2.9 2.9-.3-.4a2.2 2.2 0 0 1-.5-2.9Z"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}
