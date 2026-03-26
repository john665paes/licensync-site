"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/config/firebase';

const UsuarioContext = createContext<{usuario:any, setUsuario: any, carregado: boolean, deslogar: any}>({
    usuario: null, 
    setUsuario: null, 
    carregado: false, 
    deslogar: null
});

export const UsuarioProvider = ({ children }: any) => {
    // Alterado de '' para null para facilitar verificações
    const [usuario, _setUsuario] = useState<any>(null); 
    const [carregado, setCarregado] = useState(false);

    const setUsuario = (dados: any) => {
        if (dados) {
            localStorage.setItem('usuario', JSON.stringify(dados));
        }
        _setUsuario(dados);
    }

    const deslogar = async () => {
        localStorage.removeItem('usuario');
        _setUsuario(null);
        await auth.signOut();
    }

    useEffect(() => {
        const usuarioLocal = localStorage.getItem('usuario');
        if (usuarioLocal) {
            try {
                _setUsuario(JSON.parse(usuarioLocal));
            } catch (e) {
                console.error("Erro ao ler usuário do localStorage", e);
            }
        }
        setCarregado(true);
    }, [])

    return (
        <UsuarioContext.Provider value={{ usuario, setUsuario, carregado, deslogar }}>
            {children}
        </UsuarioContext.Provider>
    );
};

export const useUsuarioContext = () => useContext(UsuarioContext);