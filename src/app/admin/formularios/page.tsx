'use client';
import * as React from 'react';
import { AdminHeader } from '../components';
import Link from 'next/link';
import { useFormularioService } from '../../../services/formulario';

export default function FormulariosPage () {

    const formulariosSrv = useFormularioService();
    const [ formularios, setFormularios ] = React.useState<any[]>([]);
    // ===========================================================
    const buscarFormularios = async () => {
        setFormularios(await formulariosSrv.buscarFormularios())
    }
    // ----------
    React.useEffect(() => {
        buscarFormularios();
    }, []);
    // ===========================================================
    return (
      <main>
            <AdminHeader titulo='Formulários' />
                

            <div className="card-header pb-0">
              <h6>Telas</h6>
            </div>
            <div className="card-body px-0 pt-0 pb-2">
              <div className="table-responsive p-0">
                <table className="table align-items-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Formulário</th>
                      <th className="text-secondary opacity-7"></th>
                    </tr>
                  </thead>
                  <tbody>
                    { formularios.map((formulario) => (
                        <tr>
                            <td>
                                <div className="d-flex px-2 py-1">
                                    <div className="d-flex flex-column justify-content-center">
                                        <h6 className="mb-0 text-sm">Tela #{formulario}</h6>
                                    </div>
                                </div>
                            </td>
                        <td className="align-middle">
                            <Link href={`/admin/formularios/editar/${formulario}`} className="text-secondary font-weight-bold text-xs" data-toggle="tooltip" data-original-title="Edit user">
                            Abrir Formulário
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
