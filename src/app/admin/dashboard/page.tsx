'use client';
import * as React from 'react';
import { useUsuarioContext } from '../../../context/usuario-context';

export default function DashboardPage() {
  const { usuario, carregado } = useUsuarioContext();
  const [textoSaudacao, setTextoSaudacao] = React.useState("");

  // Calcula a saudação apenas no lado do cliente
  React.useEffect(() => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) setTextoSaudacao("Bom-dia!");
    else if (hora >= 12 && hora < 18) setTextoSaudacao("Boa-tarde!");
    else setTextoSaudacao("Boa-noite!");
  }, []);

  const resumo = [
    { titulo: 'Condicionantes vencendo', qtd: '5 Condicionantes', cor: '#dc3545' },
    { titulo: 'Documentos pendentes', qtd: '9 Documentos', cor: '#ffc107' },
    { titulo: 'Relatórios Aprovados', qtd: 'Visualizar', cor: '#28a745' },
  ];

  // Se o contexto ainda não carregou o localStorage, mostra um loading rápido
  if (!carregado) return null;

  return (
    <main style={{ backgroundColor: '#a1b5a3', minHeight: '100vh', padding: '20px' }}>
      
      {/* DEBUG: Se o nome não aparecer, remova o comentário da linha abaixo para ver o que tem no objeto */}
      {/* <pre>{JSON.stringify(usuario, null, 2)}</pre> */}

      <div className="d-flex align-items-center mb-4 p-3 shadow-sm"
        style={{ backgroundColor: '#034024', borderRadius: '15px', color: '#fff' }}>

        {/* AVATAR COM A INICIAL DO NOME */}
        <div className="rounded-circle bg-light d-flex align-items-center justify-content-center shadow-sm"
          style={{ width: '55px', height: '55px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.2)' }}>
          <span style={{ color: '#034024', fontWeight: 'bold', fontSize: '1.2rem' }}>
            {usuario?.nome ? usuario.nome.charAt(0).toUpperCase() : 'A'}
          </span>
        </div>

        <div className="ms-3">
          <p className="mb-0 small" style={{ opacity: 0.9, letterSpacing: '0.5px' }}>
            {textoSaudacao}
          </p>

          <h5 className="mb-0 fw-bold" style={{ fontSize: '1.1rem' }}>
            {usuario?.nome || 'Administrador'}
          </h5>
        </div>
      </div>

      {/* CARDS DE RESUMO */}
      <div className="row g-3 mb-4">
        {resumo.map((item, index) => (
          <div className="col-12 col-md-4" key={index}>
            <div className="card border-0 shadow-sm"
              style={{ borderRadius: '15px', borderLeft: `6px solid ${item.cor}` }}>
              <div className="card-body d-flex align-items-center">
                <div className="ms-2">
                  <p className="mb-0 text-muted small">{item.titulo}</p>
                  <p className="mb-0 fw-bold">{item.qtd}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LISTA DE CLIENTES */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '20px' }}>
        <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0" style={{ color: '#2d8b4e' }}>Meus Clientes</h5>
          <button className="btn d-flex align-items-center"
            style={{ backgroundColor: '#2d8b4e', color: '#fff', borderRadius: '20px' }}>
            <span className="me-2">+</span> Cadastrar
          </button>
        </div>

        <div className="card-body px-0">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="d-flex align-items-center justify-content-between p-3 border-bottom-light px-4 item-cliente"
              style={{ cursor: 'pointer' }}>
              <div className="d-flex align-items-center">
                <div style={{ color: '#2d8b4e', fontSize: '24px' }}>🏢</div>
                <div className="ms-3">
                  <p className="mb-0 fw-bold text-dark">Carros Elétricos do Brasil</p>
                  <p className="mb-0 text-muted small">Atualizado em 05/01/2026</p>
                </div>
              </div>
              <span style={{ color: '#ccc' }}>&gt;</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}