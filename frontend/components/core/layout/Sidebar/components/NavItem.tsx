import React from 'react';
import { motion } from 'framer-motion';
import { NavItemProps } from '../types';

const NavItem: React.FC<NavItemProps> = ({ 
    icon, 
    text, 
    isActive, 
    collapsed, 
    onClick,
    href
}) => {
    const content = (
        <motion.div
            className={`flex items-center ${
                isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
            } ${
                collapsed ? 'justify-center w-12 h-12 rounded-full' : 'px-4 py-3 rounded-md'
            } transition-colors cursor-pointer`}
            whileHover={{ 
                scale: 1.03,
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }}
            whileTap={{ scale: 0.98 }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20
            }}
            onClick={onClick}
        >
            <motion.span 
                className="text-xl flex-shrink-0"
                layout
                transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20
                }}
            >
                {icon}
            </motion.span>
            {!collapsed && (
                <motion.span 
                    className="ml-4 text-sm font-medium whitespace-nowrap overflow-hidden"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ 
                        opacity: 1, 
                        x: 0,
                        transition: { delay: 0.1 }
                    }}
                    exit={{ opacity: 0, x: -10 }}
                >
                    {text}
                </motion.span>
            )}
        </motion.div>
    );

    if (href) {
        return (
            <a href={href} className="block">
                {content}
            </a>
        );
    }

    return content;
};

export default React.memo(NavItem);
