import React from 'react';
import { RiPlayListFill } from 'react-icons/ri';
import { BiPlus } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';

interface SidebarHeaderProps {
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    onCreatePlaylist?: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
    isCollapsed,
    onToggleCollapse,
    onCreatePlaylist
}) => {
    if (isCollapsed) return null;

    return (
        <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
                <RiPlayListFill className="text-gray-400 text-lg" />
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Tu biblioteca
                </h3>
            </div>
            <div className="flex items-center gap-2">
                <button 
                    className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    aria-label="Crear playlist"
                    title="Crear playlist"
                    onClick={onCreatePlaylist}
                >
                    <BiPlus className="text-lg" />
                </button>
                <button
                    onClick={onToggleCollapse}
                    className="p-1.5 -mr-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    aria-label="Minimizar menú"
                    title="Minimizar menú"
                >
                    <IoMdClose className="text-lg" />
                </button>
            </div>
        </div>
    );
};

export default React.memo(SidebarHeader);
