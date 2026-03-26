'use client';
import * as React from 'react';
import { AdminHeader } from '../components';
import Link from 'next/link';
import { useUsuarioService } from '../../../services/usuario';

export default function UsuariosPage() {
  const usuariosSrv = useUsuarioService();
  const [usuarios, setUsuarios] = React.useState<any[]>([]);

  // Funcao para carregar a lista (centralizada para reutilizacao)
  const carregarUsuarios = React.useCallback(async () => {
    const lista = await usuariosSrv.buscarUsuariosCliente();
    setUsuarios(lista || []);
  }, [usuariosSrv]);

  // Efeito inicial
  React.useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  // ----------
  const handleResetarSenha = async (usuario: any) => {
    const retorno = await usuariosSrv.recuperarSenha(usuario.email);
    if (retorno.sucesso)
      alert('Email de redefinição enviado com sucesso!');
    else
      alert('Não foi possível encontrar esta conta.');
  }

  // ----------
  // CORRECAO: Agora recebe apenas o ID, igual na pagina de clientes
  const handleDeletarConta = async (id: string, nome: string) => {
    if (confirm(`Deseja realmente excluir a conta de ${nome}?`)) {
      const retorno = await usuariosSrv.excluirUsuario(id);
      
      if (retorno.sucesso) {
        alert('Conta deletada com sucesso!');
        await carregarUsuarios(); // Atualiza a lista na tela
      } else {
        alert('Erro ao tentar deletar a conta.');
      }
    }
  }

  return (
    <main>
      <AdminHeader titulo='Lista de Usuários'>
        <Link className='btn btn-primary' href="/admin/usuarios/editarAdm">Novo usuário administrador</Link>&nbsp;
        <Link className='btn btn-primary' href="/admin/usuarios/editarCliente">Novo usuário cliente</Link>
      </AdminHeader>

      <div className="card-header pb-0 px-4 pt-4">
        <h6 className="fw-bold" style={{ color: '#2d8b4e' }}>Usuários Cadastrados</h6>
      </div>

      <div className="card-body px-0 pt-0 pb-2">
        <div className="table-responsive p-0">
          <table className="table align-items-center mb-0">
            <thead>
              <tr>
                <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 px-4">Usuário / Empresa</th>
                <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td className="px-4 py-3">
                    <div className="d-flex flex-column">
                      <h6 className="mb-0 text-sm fw-bold">{usuario.nome || usuario.empresa}</h6>
                      <p className="text-xs text-secondary mb-0">{usuario.email}</p>
                    </div>
                  </td>
                  <td className="align-middle text-center">
                    <div className="d-flex justify-content-center gap-3">
                      
                      {/* RESETAR SENHA */}
                      <span 
                        className="text-primary font-weight-bold text-xs" 
                        style={{ cursor: 'pointer' }} 
                        onClick={() => handleResetarSenha(usuario)}
                      >
                        <i className="fas fa-key me-1"></i> Resetar senha
                      </span>

                      {/* EXCLUIR CONTA - Passando ID e Nome separadamente */}
                      <span 
                        className="text-danger font-weight-bold text-xs" 
                        style={{ cursor: 'pointer' }} 
                        onClick={() => handleDeletarConta(usuario.id, usuario.nome || usuario.empresa)}
                      >
                        <i className="fas fa-trash me-1"></i> Excluir conta
                      </span>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}