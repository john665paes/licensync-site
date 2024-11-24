'use client';
import * as React from 'react';
import { AdminHeader } from '../components';
import Link from 'next/link';
import { useUsuarioService } from '@/services/usuario';

export default function FormulariosPage() {
  const usuariosSrv = useUsuarioService();
  const [usuarios, setUsuarios] = React.useState<any[]>([]);

  // ===========================================================
  const buscarUsuarios = async () => {
    const resultado = await usuariosSrv.buscarUsuariosCliente();
    console.log("Usuários carregados:", resultado); // Verificar conteúdo
    setUsuarios(resultado || []); // Garantir que é um array
  };

  React.useEffect(() => {
    buscarUsuarios();
  }, []);
  // ===========================================================
  return (
    <main>
      <AdminHeader titulo="Editar" />

      <div className="card-header pb-0">
        <h6>Clientes</h6>
      </div>
      <div className="card-body px-0 pt-0 pb-2">
        <div className="table-responsive p-0">
          <table className="table align-items-center mb-0">
            <thead>
              <tr>
                <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                  Lista
                </th>
                <th className="text-secondary opacity-7"></th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario, index) => (
                <tr key={usuario.id || index}>
                  <td>
                    <div className="d-flex px-2 py-1">
                      <div className="d-flex flex-column justify-content-center">
                        <h6 className="mb-0 text-sm">{usuario.empresa || ''}</h6>
                        <p className="text-xs text-secondary mb-0">Email: {usuario.email || ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="align-middle">
                    <Link
                      href={`/admin/clientes/editar/${usuario.id}`}
                      className="text-secondary font-weight-bold text-xs"
                      data-toggle="tooltip"
                      data-original-title="Edit user"
                    >
                      Editar
                    </Link>
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
