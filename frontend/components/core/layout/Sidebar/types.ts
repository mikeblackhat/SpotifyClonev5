export interface Playlist {
    id: number;
    name: string;
    songCount?: number;
}

export interface NavItemProps {
    icon: React.ReactNode;
    text: string;
    isActive: boolean;
    collapsed: boolean;
    onClick?: () => void;
    href?: string;
}

export interface SidebarContentProps {
    isCollapsed: boolean;
    isHovered: boolean;
    isAuthenticated: boolean;
    setIsCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void;
    pathname: string;
}

export const scrollbarStyles = `
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }`;
