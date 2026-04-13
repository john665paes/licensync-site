'use client';
import { useUsuarioContext } from '../../../context/usuario-context';
import * as React from 'react';
import { useUsuarioService } from '../../../services/usuario';
import { useRouter } from 'next/navigation'; // Importar para navegação

export default function DashboardPage() {
  const { usuario, carregado } = useUsuarioContext();
  const [textoSaudacao, setTextoSaudacao] = React.useState("");
  const usuariosSrv = useUsuarioService();
  const router = useRouter();
  const [clientes, setClientes] = React.useState<any[]>([]);
  const [carregando, setCarregando] = React.useState(true);

  // Calcula a saudação apenas no lado do cliente
  React.useEffect(() => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) setTextoSaudacao("Bom-dia!");
    else if (hora >= 12 && hora < 18) setTextoSaudacao("Boa-tarde!");
    else setTextoSaudacao("Boa-noite!");
  }, []);

  // Busca os clientes no banco de dados
  const buscarClientes = React.useCallback(async () => {
    try {
      const lista = await usuariosSrv.buscarUsuariosCliente();
      setClientes(lista || []);
    } catch (error) {
      console.error("Erro ao buscar clientes", error);
    } finally {
      setCarregando(false);
    }
  }, [usuariosSrv]);

  React.useEffect(() => {
    buscarClientes();
  }, [buscarClientes]);

  const resumo = [
    { titulo: 'Condicionantes vencendo', qtd: '5 Condicionantes', cor: '#dc3545' },
    { titulo: 'Documentos pendentes', qtd: '9 Documentos', cor: '#ffc107' },
    { titulo: 'Relatórios Aprovados', qtd: 'Visualizar', cor: '#28a745' },
  ];

  // Se o contexto ainda não carregou o localStorage, mostra um loading rápido
  if (!carregado) return null;

  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '20px' }}>
      
      {/* DEBUG: Se o nome não aparecer, remova o comentário da linha abaixo para ver o que tem no objeto */}
      {/* <pre>{JSON.stringify(usuario, null, 2)}</pre> */}

      <div className="d-flex align-items-center mb-4 p-3 shadow-sm"
        style={{ backgroundColor: '#2d8b4e', borderRadius: '15px', color: '#fff' }}>

        {/* AVATAR COM A INICIAL DO NOME */}
        <div className="rounded-circle bg-light d-flex align-items-center justify-content-center shadow-sm"
          style={{ width: '55px', height: '55px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.2)' }}>
          <span style={{ color: '#000000', fontWeight: 'bold', fontSize: '1.2rem' }}>
            {usuario?.nome ? usuario.nome.charAt(0).toUpperCase() : 'A'}
          </span>
        </div>

        <div className="ms-3">
          <p className="mb-0 small" style={{ opacity: 0.9, letterSpacing: '0.5px' }}>
            {textoSaudacao}
          </p>

          <h5 className="mb-0 fw-bold" style={{ fontSize: '1.1rem', color: '#fff' }}>
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
          <button 
            className="btn d-flex align-items-center"
            onClick={() => router.push('/admin/usuarios/editarCliente')} // Rota de cadastro
            style={{ backgroundColor: '#2d8b4e', color: '#fff', borderRadius: '20px' }}
          >
            <span className="me-2">+</span> Cadastrar
          </button>
        </div>

        <div className="card-body px-0 pt-0">
          {carregando ? (
             <p className="p-4 text-center">Carregando clientes...</p>
          ) : clientes.length === 0 ? (
             <p className="p-4 text-center">Nenhum cliente cadastrado.</p>
          ) : (
            clientes.map((cliente) => (
              <div 
                key={cliente.id} 
                className="d-flex align-items-center justify-content-between p-3 border-bottom px-4 item-cliente"
                onClick={() => router.push(`/admin/clientes/editar?id=${cliente.id}`)} // Torna o item clicável
                style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div className="d-flex align-items-center">
                  {/* Ícone da Empresa */}
                  <div className="rounded-circle d-flex align-items-center justify-content-center" 
                       style={{ backgroundColor: '#e8f5e9', width: '45px', height: '45px' }}>
                    <span style={{ fontSize: '20px' }}>🏢</span>
                  </div>

                  <div className="ms-3">
                    {/* Nome da Empresa em Negrito */}
                    <p className="mb-0 fw-bold text-dark" style={{ fontSize: '1rem' }}>
                      {cliente.empresa || "Nome não definido"}
                    </p>
                    
                    {/* Responsável e Telefone (Campos do seu banco) */}
                    <p className="mb-0 text-muted small">
                      <span className="fw-medium">Resp:</span> {cliente.nome || 'Não informado'} | 
                      <span className="fw-medium ms-1">Tel:</span> {cliente.telefone || 'N/A'}
                    </p>
                    
                    {/* Data ou E-mail como informação secundária */}
                    <p className="mb-0 text-muted" style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                      {cliente.email}
                    </p>
                  </div>
                </div>

                {/* Ícone de seta para indicar que é clicável */}
                <span style={{ color: '#ccc', fontSize: '1.2rem' }}>&rsaquo;</span>
              </div>
          )))}
        </div>
      </div>
    </main>
  );
}