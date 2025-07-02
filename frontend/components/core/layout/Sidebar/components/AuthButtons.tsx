import React from 'react';

interface AuthButtonsProps {
    onSignUp: () => void;
    onLogin: () => void;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ onSignUp, onLogin }) => {
    return (
        <div className="flex flex-col gap-4 px-4">
            <button 
                onClick={onSignUp}
                className="w-full bg-white text-black font-bold py-3 rounded-full hover:scale-105 transition-transform text-sm"
            >
                Registrarte
            </button>
            <button 
                onClick={onLogin}
                className="w-full bg-transparent border-2 border-gray-400 text-white font-bold py-3 rounded-full hover:scale-105 transition-transform text-sm"
            >
                Iniciar sesión
            </button>
        </div>
    );
};

export default React.memo(AuthButtons);
