interface AvatarProps {
  firstName: string;
  lastName: string;
  size?: "sm" | "md" | "lg";
  avatarUrl?: string | null;
}

const sizeClasses = {
  sm: { container: "w-7 h-7",   text: "text-[10px]" },
  md: { container: "w-9 h-9",   text: "text-xs" },
  lg: { container: "w-16 h-16", text: "text-xl" },
};

export default function Avatar({ firstName, lastName, size = "md", avatarUrl }: AvatarProps) {
  const { container, text } = sizeClasses[size];
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={`${firstName} ${lastName}`}
        className={`${container} rounded-full object-cover shrink-0`}
      />
    );
  }

  return (
    <div className={`${container} rounded-full bg-[#E5E7EB] flex items-center justify-center shrink-0`}>
      <span className={`${text} font-semibold text-[#6B7280]`}>{initials}</span>
    </div>
  );
}
