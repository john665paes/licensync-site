"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/config/firebase';

const UsuarioContext = createContext<{usuario:any, setUsuario: any, carregado: boolean, deslogar: any}>({usuario: '', setUsuario: null, carregado: false, deslogar: null});

export const UsuarioProvider = ({ children }: any) => {
    const [usuario, _setUsuario] = useState('');
    const [ carregado, setCarregado] = useState(false);

    // ======================================================================
    const setUsuario = (usuario:any) => {
        localStorage.setItem('usuario', JSON.stringify(usuario))
        _setUsuario(usuario);
    }
    // ---------
    const deslogar = async () => {
        localStorage.removeItem('usuario');
        auth.signOut();
    }
    // ---------
    useEffect(() => {
        const usuario = localStorage.getItem('usuario');
        if (usuario) _setUsuario(JSON.parse(usuario));
        setCarregado(true);
    }, [])
    // ======================================================================
    return (
        <UsuarioContext.Provider value={{ usuario, setUsuario, carregado, deslogar }}>
            {children}
        </UsuarioContext.Provider>
    );
};

export const useUsuarioContext = () => {
  return useContext(UsuarioContext);
};