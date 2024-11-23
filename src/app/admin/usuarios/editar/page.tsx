"use client";
import * as React from 'react';
import { AdminHeader } from '../../components';
import { useUsuarioService } from '../../../../services/usuario';
import { Field, Form, Formik } from 'formik';

export default function UsuarioEditarPage ({params}: any) {

    const usuariosSrv = useUsuarioService();
    const [ mensagem , setMensagem ] = React.useState<null|boolean>(null)
    // ======================================================================
    const handleSalvar = async (usuario:any) => {
      setMensagem(null);
      const retorno = await usuariosSrv.cadastrar(usuario);
      setMensagem(retorno.sucesso)
    }
    // ======================================================================
    return (
      <main>
            <AdminHeader titulo={('Cadastrar Usuário')}/>
            <h6>Formulário</h6>    

            { mensagem != null && mensagem == false && <p className="alert alert-danger">Não foi possível cadastrar usuário</p>}
            { mensagem != null && mensagem == true && <p className="alert alert-success">Cadastrado com sucesso</p>}

          <Formik
            initialValues={{  nome: '', email: '', senha: ''}}
            enableReinitialize
            onSubmit={handleSalvar}
          >
            {({isSubmitting}) => (
              <Form>
            <div className="card-body">  
              {/* NOME */}
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form-control-label">Nome</label>
                    <Field className="form-control" type="text" name="nome" />
                  </div>
                </div>

                {/* EMAIL */}
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-control-label">Email</label>
                    <Field className="form-control" type="email"  name="email"/>
                  </div>
                </div>

                {/* SENHA */}
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-control-label">Senha</label>
                    <Field className="form-control" type="password" name="senha"/>
                  </div>
                </div>

                {/* BOTÃO */}
                <div className="col-md-12">
                  <div className="form-group">
                    <button className='btn btn-primary w-100' type="submit" disabled={isSubmitting}>Salvar</button>
                  </div>
                </div>
              </div>
            </div>
            </Form>)}   
          </Formik>
      </main>
    );
}
