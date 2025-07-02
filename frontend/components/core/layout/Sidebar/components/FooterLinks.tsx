import React from 'react';

interface FooterLinksProps {
    className?: string;
}

const FooterLinks: React.FC<FooterLinksProps> = ({ className = '' }) => {
    return (
        <div className={`mt-auto p-4 pt-6 border-t border-white/10 ${className}`}>
            <div className="text-xs text-gray-400 flex flex-wrap gap-x-4 gap-y-1 mb-4">
                <a href="#" className="hover:underline">Legal</a>
                <a href="#" className="hover:underline">Seguridad y Centro de Privacidad</a>
                <a href="#" className="hover:underline">Política de Privacidad</a>
                <a href="#" className="hover:underline">Cookies</a>
                <a href="#" className="hover:underline">Sobre los anuncios</a>
                <a href="#" className="hover:underline">Accesibilidad</a>
            </div>
            <button className="flex items-center gap-2 border border-gray-400 rounded-full px-4 py-2 text-white text-sm hover:bg-white/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25M12 18.75V21M4.219 4.219l1.591 1.591M18.19 18.189l1.59 1.591M21 12h-2.25M5.25 12H3M4.219 19.781l1.591-1.591M18.189 5.811l1.591-1.591" />
                </svg>
                <span>Español de Latinoamérica</span>
            </button>
        </div>
    );
};

export default React.memo(FooterLinks);
