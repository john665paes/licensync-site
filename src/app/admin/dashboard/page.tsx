'use client';
import * as React from 'react';
import { AdminHeader } from '../components';
import { useUsuarioContext } from '../../../context/usuario-context';

export default function DashboardPage() {
  const { usuario } = useUsuarioContext();

  // Dados mockados para visualização (depois conectamos ao Firebase)
  const resumo = [
    { titulo: 'Condicionantes vencendo', qtd: '5 Condicionantes', cor: '#dc3545' },
    { titulo: 'Documentos pendentes', qtd: '9 Documentos', cor: '#ffc107' },
    { titulo: 'Relatórios Aprovados', qtd: 'Visualizar', cor: '#28a745' },
  ];

  return (
    <main style={{ backgroundColor: '#f2eeee', minHeight: '100vh', padding: '20px' }}>
      {/* HEADER DE SAUDAÇÃO (Estilo App) */}
      <div className="d-flex align-items-center mb-4 p-3 shadow-sm" 
           style={{ backgroundColor: '#034024', borderRadius: '15px', color: '#fff' }}>
        <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" 
             style={{ width: '50px', height: '50px', overflow: 'hidden' }}>
          <span style={{ color: '#034024', fontWeight: 'bold' }}>
            {usuario?.nome?.charAt(0) || 'A'}
          </span>
        </div>
        <div className="ms-3">
          <p className="mb-0 small" style={{ opacity: 0.8 }}>Bom-dia!</p>
          <h5 className="mb-0 fw-bold">{usuario?.nome || 'Administrador'}</h5>
        </div>
      </div>

      {/* CARDS DE RESUMO (Grid de 3 colunas) */}
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