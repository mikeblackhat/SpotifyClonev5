import Link from "next/link";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

interface SidebarItemProps {
  icon: IconType;
  label: string;
  active: boolean;
  href: string;
  customClass?: string;
  activeClass?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  active,
  href,
  customClass = "",
  activeClass = ""
}) => {
  return (
    <Link
      href={href}
      className={twMerge(
        `flex flex-row h-auto items-center text-md font-medium cursor-pointer transition py-1 ${customClass}`,
        active ? `${activeClass}` : "text-neutral-400 hover:text-white"
      )}
    >
      <Icon size={22} className="mr-3" />
      <span className="truncate w-full">{label}</span>
    </Link>
  );
}
export default SidebarItem;