"use client";
import * as React from 'react';
import { AdminHeader } from '../../../components';
import { useFormularioService } from '../../../../../services/formulario';
import { Formulario1, Formulario2 } from './forms';
import { useRouter } from 'next/navigation';

export default function FormularioEditarPage ({params}: any) {

    const formulariosSrv = useFormularioService();
    const [ formulario , setFormulario ] = React.useState<any>(null)
    const [ mensagem , setMensagem ] = React.useState<null|boolean>(null)
    const router = useRouter();

    // ======================================================================
    const handleSalvar = async (formulario:any) => {
      setMensagem(null);
      console.log(formulario);
      const retorno = await formulariosSrv.editar(formulario);
      setMensagem(retorno.sucesso);

    }
    // ------------
    const handleBuscar = async () => {
      //Crie inicialmente os formulários dentro do firebase para ele ter o que buscar, mesmo que não seja os dados reais
      const form = await formulariosSrv.buscar(params.id[0]);
      console.log(form);
      setFormulario(form);


    }
    // ------------
    React.useEffect(() => {
      handleBuscar();
    }, [])
    // ======================================================================
    return (
      <main>
            <AdminHeader titulo={`Editar formulário da Tela #${params.id[0]}`}/>
            <h6>Tela #{params.id[0]}</h6>    

            { mensagem != null && mensagem == false && <p className="alert alert-danger">Não foi possível editar formulário</p>}
            { mensagem != null && mensagem == true && <p className="alert alert-success">Editado com sucesso</p>}

            { formulario && 
              <>
                { params.id && params.id[0] == "1" && <Formulario1 formulario={formulario} handleSalvar={handleSalvar} /> }
                { params.id && params.id[0] == "2" && <Formulario2 formulario={formulario} handleSalvar={handleSalvar} /> }
              </>
            }

      </main>
    );
}
