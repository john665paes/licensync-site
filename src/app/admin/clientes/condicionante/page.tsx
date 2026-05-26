"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { AdminHeader } from '../../components';
import { useUsuarioService } from '../../../../services/usuario';
import { useRouter, useSearchParams } from 'next/navigation';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';

function DetalhesClienteContent() {
  const usuariosSrv = useUsuarioService();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Tenta pegar o ID tanto de 'id' quanto de 'uid' para evitar erros de navegação
  const userId = searchParams.get('id') || searchParams.get('uid');

  const [cliente, setCliente] = useState<any>(null);
  const [condicionantes, setCondicionantes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Lógica de cores baseada no vencimento
  const getStatusInfo = (dataVencimento: any) => {
    if (!dataVencimento) return { cor: '#6c757d', texto: 'Sem data' };
    
    // Converte para objeto Date independente do formato (Timestamp ou String)
    const vencimento = dataVencimento.seconds 
      ? new Date(dataVencimento.seconds * 1000) 
      : new Date(dataVencimento);

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    vencimento.setHours(0, 0, 0, 0);
    
    const diffTime = vencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { cor: '#dc3545', texto: 'Vencida' }; 
    if (diffDays <= 30) return { cor: '#ffc107', texto: 'Vence em breve' }; 
    return { cor: '#28a745', texto: 'Em dia' }; 
  };

  useEffect(() => {
    const carregarTudo = async () => {
      if (!userId) {
        console.error("ID do cliente não encontrado na URL");
        setLoading(false);
        return;
      }

      try {
        console.log("Buscando dados para o ID:", userId);

        // 1. Buscar dados do Cliente
        const dadosCli = await usuariosSrv.buscar(userId);
        if (dadosCli) {
          setCliente(dadosCli);
          console.log("Cliente encontrado:", dadosCli.empresa);
        }

        // 2. Buscar Condicionantes na Subcoleção
        const condRef = collection(db, 'usuarios', userId, 'condicionantes');
        const q = query(condRef, orderBy('vencimento', 'asc'));
        const querySnapshot = await getDocs(q);
        
        const lista = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setCondicionantes(lista);
        console.log("Condicionantes carregadas:", lista.length);
      } catch (error) {
        console.error("Erro ao buscar dados do Firebase:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarTudo();
  }, [userId, usuariosSrv]);

  if (loading) return <div className="p-5 text-center text-success fw-bold">Carregando painel do cliente...</div>;

  return (
    <div className="container-fluid py-4">
      {/* CABEÇALHO COM DADOS DO CLIENTE E BOTÕES */}
      <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '20px', borderTop: '4px solid #2d8b4e' }}>
        <div className="card-body p-4">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <h3 className="fw-bold mb-1" style={{ color: '#2d8b4e' }}>
                {cliente?.empresa || 'Empresa não identificada'}
              </h3>
              <p className="text-muted mb-0" style={{ fontSize: '1rem' }}>
                <strong>Responsável:</strong> {cliente?.nomeContato || cliente?.nome || 'N/A'} 
                <span className="mx-3">|</span>
                <strong>Tel:</strong> {cliente?.telefone1 || cliente?.telefone || 'N/A'}
              </p>
            </div>
            
            <div className="col-lg-5 text-lg-end mt-3 mt-lg-0">
              <button 
                onClick={() => router.push(`/admin/clientes/editar?id=${userId}`)}
                className="btn btn-outline-success rounded-pill px-4 me-2 shadow-none"
              >
                Editar Cliente
              </button>
              <button 
                onClick={() => router.push(`/admin/clientes/addCondicionante?id=${userId}`)}
                className="btn btn-success rounded-pill px-4 shadow-none"
                style={{ backgroundColor: '#2d8b4e' }}
              >
                + Condicionante
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* LISTAGEM DE CONDICIONANTES */}
      <div className="mt-5">
        <h5 className="fw-bold mb-4" style={{ color: '#2d8b4e' }}>
          Condicionantes Ativas
        </h5>

        {condicionantes.length === 0 ? (
          <div className="p-5 text-center bg-white rounded-4 shadow-sm border">
            <p className="text-muted mb-0">Nenhuma condicionante encontrada para este cliente.</p>
          </div>
        ) : (
          <div className="row g-3">
            {condicionantes.map((item) => {
              const status = getStatusInfo(item.vencimento);
              const dataFormatada = item.vencimento?.seconds 
                ? new Date(item.vencimento.seconds * 1000).toLocaleDateString('pt-BR')
                : new Date(item.vencimento).toLocaleDateString('pt-BR');

              return (
                <div className="col-12" key={item.id}>
                  <div 
                    className="card border-0 shadow-sm" 
                    onClick={() => router.push(`/admin/clientes/condicionante?idUser=${userId}&idCond=${item.id}`)}
                    style={{ 
                      borderRadius: '15px', 
                      borderLeft: `10px solid ${status.cor}`,
                      cursor: 'pointer'
                    }}
                  >
                    <div className="card-body d-flex justify-content-between align-items-center p-3">
                      <div>
                        <h6 className="fw-bold mb-1">{item.titulo || 'Condicionante sem título'}</h6>
                        <p className="mb-0 text-muted small">
                          Vencimento: <strong>{dataFormatada}</strong>
                        </p>
                      </div>
                      <div className="d-flex align-items-center">
                        <span 
                          className="badge rounded-pill px-3 py-2" 
                          style={{ 
                            backgroundColor: status.cor, 
                            color: status.cor === '#ffc107' ? '#000' : '#fff',
                            minWidth: '100px'
                          }}
                        >
                          {status.texto}
                        </span>
                        <span className="ms-3 text-muted" style={{ fontSize: '1.5rem' }}>&rsaquo;</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function VisualizarClientePage() {
  return (
    <main style={{ backgroundColor: '#f2eeee', minHeight: '100vh' }}>
      <AdminHeader titulo="Visão Geral" />
      <Suspense fallback={<div className="p-5 text-center text-success">Carregando...</div>}>
        <DetalhesClienteContent />
      </Suspense>
    </main>
  );
}