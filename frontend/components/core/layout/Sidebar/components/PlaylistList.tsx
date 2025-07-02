import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiMusic } from 'react-icons/bi';
import { Playlist } from '../types';

interface PlaylistListProps {
    playlists: Playlist[];
    searchQuery: string;
    isCollapsed: boolean;
    onPlaylistClick?: (playlist: Playlist) => void;
}

const PlaylistList: React.FC<PlaylistListProps> = ({
    playlists,
    searchQuery,
    isCollapsed,
    onPlaylistClick
}) => {
    if (isCollapsed) return null;

    const filteredPlaylists = playlists.filter(playlist =>
        playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-4">
            <AnimatePresence>
                {filteredPlaylists.map((playlist, index) => (
                    <motion.div
                        key={playlist.id}
                        className="group flex items-center p-2 rounded-md hover:bg-white/10 cursor-pointer"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onPlaylistClick?.(playlist)}
                    >
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded flex-shrink-0 flex items-center justify-center">
                            <BiMusic className="text-white text-xl" />
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <h4 className="text-sm font-medium text-white truncate">
                                {playlist.name}
                            </h4>
                            <p className="text-xs text-gray-400 truncate">
                                Playlist • {playlist.songCount || 0} canciones
                            </p>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default React.memo(PlaylistList);
