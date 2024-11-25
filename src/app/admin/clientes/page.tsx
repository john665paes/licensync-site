'use client';
import * as React from 'react';
import { AdminHeader } from '../components';
import Link from 'next/link';
import { useUsuarioService } from '@/services/usuario';

export default function FormulariosPage() {
  const usuariosSrv = useUsuarioService();
  const [usuarios, setUsuarios] = React.useState<any[]>([]);

  // ===========================================================
  const buscarUsuarios = React.useCallback(async () => {
    const resultado = await usuariosSrv.buscarUsuariosCliente();
    console.log('Usuários carregados:', resultado); // Verificar conteúdo
    setUsuarios(resultado || []); // Garantir que é um array
  }, [usuariosSrv]);

  React.useEffect(() => {
    buscarUsuarios();
  }, [buscarUsuarios]);
  // ===========================================================

  return (
    <main>
      <AdminHeader titulo="Clientes" />

      <div className="card-header pb-0">
        <h6>Clientes</h6>
      </div>
      <div className="card-body px-0 pt-0 pb-2">
        <div className="table-responsive p-0">
          <table className="table align-items-center mb-0">
            <thead>
              <tr>
                <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                  Empresa
                </th>
                <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                  E-mail
                </th>
                <th className="text-secondary opacity-7">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario, index) => (
                <tr key={usuario.id || index}>
                  <td>
                    <div className="d-flex px-2 py-1">
                      <div className="d-flex flex-column justify-content-center">
                        <h6 className="mb-0 text-sm">{usuario.empresa || 'Sem empresa'}</h6>
                        <p className="text-xs text-secondary mb-0">{usuario.email || 'Sem e-mail'}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="text-xs text-secondary mb-0">{usuario.email || 'Sem e-mail'}</p>
                  </td>
                  <td className="align-middle">
                    <div className="d-flex justify-content-start">
                      {/* Link de Editar */}
                      <Link
                        href={`/admin/clientes/editar/${usuario.id}`}
                        className="btn btn-sm btn-outline-primary me-3"
                        data-toggle="tooltip"
                        data-original-title="Editar usuário"
                      >
                        <i className="fas fa-pencil-alt me-2"></i> Editar
                      </Link>

                      {/* Botão de Adicionar Condicionante */}
                      <Link
                        href={`/admin/clientes/addCondicionante/${usuario.id}`}
                        className="btn btn-sm btn-outline-primary me-3"
                        data-toggle="tooltip"
                        data-original-title="Adicionar Condicionante"
                      >
                        <i className="fas fa-pencil-alt me-2"></i> Adicionar Condicionante
                      </Link>
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
