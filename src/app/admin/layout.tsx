'use client';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react";
import { useUsuarioContext } from "../../context/usuario-context";
import Image from "next/image";

export default function AdminLayout({ children }: any) {
    const router = useRouter();
    const { usuario, carregado, deslogar } = useUsuarioContext();
    const url = usePathname();

    const handleSair = () => {
        deslogar();
        router.replace('/')
    }

    useEffect(() => {
        if (carregado && !usuario)
            router.replace('/')
    }, [carregado, usuario, router])

    // Função para definir classe de link ativo
    const getLinkClass = (path: string) => {
        const baseClass = "nav-link d-flex align-items-center py-3 ";
        const isActive = path === 'usuarios' ? url.endsWith(path) : url.includes(path);
        return baseClass + (isActive ? 'active text-white bg-success shadow-sm rounded-3' : 'text-dark');
    }

    return (
        <>
            {carregado && usuario && (
                <div className="g-sidenav-show bg-gray-100 min-vh-100">
                    {/* MENU LATERAL (SIDEBAR) */}
                    <aside className="sidenav bg-white navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-4 shadow-sm" id="sidenav-main">
                        <div className="sidenav-header text-center py-4 h-auto">
                            <Image
                                src="/login.png"
                                alt="LicenSync Logo"
                                width={160}
                                height={60}
                                priority
                                style={{ objectFit: 'contain' }}
                            />
                            <div className="mt-2">
                                <span className="text-xs text-uppercase font-weight-bolder opacity-6 text-success">Painel Admin</span>
                            </div>
                        </div>

                        <hr className="horizontal dark mt-0" />

                        <div className="collapse navbar-collapse w-auto h-auto" id="sidenav-collapse-main">
                            <ul className="navbar-nav px-3">
                                <li className="nav-item">
                                    <Link className={getLinkClass('dashboard')} href="/admin/dashboard">
                                        <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="ni ni-tv-2 text-sm opacity-10"></i>
                                        </div>
                                        <span className="nav-link-text ms-1 font-weight-bold">Dashboard</span>
                                    </Link>
                                </li>

                                <li className="nav-item mt-3">
                                    <h6 className="ps-4 ms-2 text-uppercase text-xs font-weight-bolder opacity-6">Gestão Interna</h6>
                                </li>

                                <li className="nav-item">
                                    <Link className={getLinkClass('usuarios')} href="/admin/usuarios">
                                        <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="ni ni-single-02 text-sm opacity-10"></i>
                                        </div>
                                        <span className="nav-link-text ms-1 font-weight-bold">Usuários Admin</span>
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className={getLinkClass('clientes')} href="/admin/clientes">
                                        <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="ni ni-bullet-list-67 text-sm opacity-10"></i>
                                        </div>
                                        <span className="nav-link-text ms-1 font-weight-bold">Lista de Clientes</span>
                                    </Link>
                                </li>

                                {/* SUGESTÕES DE NOVOS MENUS ABAIXO */}
                                <li className="nav-item mt-3">
                                    <h6 className="ps-4 ms-2 text-uppercase text-xs font-weight-bolder opacity-6">Relatórios</h6>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link text-dark py-3" href="#">
                                        <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="ni ni-archive-2 text-sm opacity-10"></i>
                                        </div>
                                        <span className="nav-link-text ms-1 font-weight-bold">Licenças a Vencer</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* RODAPÉ DO MENU (BOTÃO SAIR) */}
                        <div className="sidenav-footer mx-3 mt-4">
                            <button className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center" onClick={handleSair}>
                                <i className="ni ni-button-power me-2"></i> Sair do Sistema
                            </button>
                        </div>
                    </aside>

                    {/* CONTEÚDO PRINCIPAL */}
                    <main className="main-content position-relative border-radius-lg">
                        {/* NAVBAR SUPERIOR */}
                        <nav className="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl bg-transparent" id="navbarBlur" data-scroll="false">
                            <div className="container-fluid py-1 px-3 d-flex justify-content-end">
                                <div className="d-flex align-items-center bg-white shadow-sm px-3 py-2 rounded-pill">
                                    <span className="text-dark font-weight-bold me-3">
                                        Olá, <span className="text-success">{usuario.nome}</span>
                                    </span>
                                    <div className="bg-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
                                        <i className="fa fa-user text-white text-xs"></i>
                                    </div>
                                </div>
                            </div>
                        </nav>

                        {/* ÁREA DA PÁGINA */}
                        <div className="container-fluid py-4">
                            <div className="card shadow-sm border-0 border-radius-xl p-4 min-vh-80">
                                {children}
                            </div>

                            {/* FOOTER */}
                            <footer className="footer pt-5">
                                <div className="container-fluid">
                                    <div className="row align-items-center justify-content-lg-between">
                                        <div className="col-lg-6 mb-lg-0 mb-4">
                                            <div className="copyright text-center text-xs text-muted text-lg-start">
                                                © {new Date().getFullYear()}, LicenSync • Gestão Ambiental
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </footer>
                        </div>
                    </main>
                </div>
            )}
        </>
    );
}