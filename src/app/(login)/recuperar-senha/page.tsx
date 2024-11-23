'use client';
import { Field, Form, Formik } from "formik";
import Link from "next/link";
import { useState } from "react";
import { useUsuarioService } from "../../../services/usuario";

export default function RecuperarSenhaPage() {

    const [ alert, setAlert ] = useState<''|'sucesso'|'erro'>('');
    const usuarioSrv = useUsuarioService();
    // =================================================================
    const onSubmit = async ({email}: any) => {
        const { sucesso } = await usuarioSrv.recuperarSenha(email);
        if (sucesso)
            setAlert('sucesso')
        else
            setAlert('erro')
    }
    // ===================================================================
    return (
      <>
      <div className="page-header min-vh-100">
        <div className="container">
          <div className="row">
            <div className="mx-auto">
            <Formik
                initialValues={{email: ''}}
                onSubmit={onSubmit}
              >
                {({  }) => (
                  <div className="card card-plain">
                    <div className="card-header pb-0 text-start">
                      <h4 className="font-weight-bolder">Recuperar Senha</h4>
                      <p className="mb-0">Informe seu email para recuperar a sua senha</p>
                    </div>
                    <div className="card-body">
                      <Form>
                        <div className="mb-3">
                          <Field type="email"  name="email" className="form-control form-control-lg" placeholder="Email" required />
                        </div>
                        
                        { alert == 'sucesso' && <p className="alert alert-success">Email enviado com sucesso!</p> }
                        { alert == 'erro' && <p className="alert alert-danger">Email não encontrado!</p> }

                        <div className="text-center">
                          <button type="submit" className="btn btn-lg btn-primary btn-lg w-100 mt-4 mb-0">Enviar email</button>
                        </div>
                      </Form>

                    </div>
                    <div className="card-footer text-center pt-0 px-lg-2 px-1">
                      <p className="mb-4 text-sm mx-auto">
                        <Link href="/" className="text-primary text-gradient font-weight-bold">Voltar para o login</Link>
                      </p>
                    </div>
                  </div>
                )}
              </Formik>
            </div>
            
          </div>
        </div>
      </div>
    </>
       
  );
}
