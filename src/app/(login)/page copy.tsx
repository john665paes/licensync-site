'use client';
import { Field, Form, Formik, ErrorMessage } from "formik";
import Link from "next/link";
import { useUsuarioService } from "../../services/usuario";
import { useUsuarioContext } from "../../context/usuario-context";
import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

export default function LoginPage() {

  const usuarioSrv = useUsuarioService();
  const { setUsuario } = useUsuarioContext();
  const router = useRouter();
  const [erro, setErro] = useState<boolean>(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email inválido").required("O email é obrigatório"),
    senha: Yup.string().min(6, "A senha deve ter pelo menos 6 caracteres").required("A senha é obrigatória"),
  });

  const onSubmit = async ({ email, senha }: any) => {
    console.log(email, senha);
    try {
      const { sucesso, usuario } = await usuarioSrv.logar(email, senha);
      setErro(false);
      if (sucesso) {
        setUsuario(usuario);
        router.push('/admin/dashboard');
      } else {
        setErro(true);
      }
    } catch (err) {
      console.error("Erro ao tentar logar:", err);
      setErro(true);
    }
  };

  return (
    <>
      <div className="page-header min-vh-100">
        <div className="container">
          <div className="row">
            <div className="mx-auto">
              <Formik
                initialValues={{ email: '', senha: '' }}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {() => (
                  <div className="card card-plain">
                    <div className="card-header pb-0 text-start">
                      <h4 className="font-weight-bolder">Login</h4>
                      <p className="mb-0">Informe seu email e senha</p>
                    </div>
                    <div className="card-body">
                      <Form>
                        <div className="mb-3">
                          <Field type="email" name="email" className="form-control form-control-lg" placeholder="Digite seu email" />
                          <ErrorMessage name="email" component="div" className="text-danger small mt-1" />
                        </div>
                        <div className="mb-3">
                          <Field type="password" name="senha" className="form-control form-control-lg" placeholder="Digite sua senha" />
                          <ErrorMessage name="senha" component="div" className="text-danger small mt-1" />
                        </div>
                        {erro && (
                          <p className="alert alert-danger text-center mt-3">Login ou senha incorreta!</p>
                        )}
                        <div className="text-center">
                          <button type="submit" className="btn btn-lg btn-primary btn-lg w-100 mt-4 mb-0">Logar</button>
                        </div>
                      </Form>
                    </div>
                    <div className="card-footer text-center pt-0 px-lg-2 px-1">
                      <p className="mb-4 text-sm mx-auto">
                        Perdeu sua senha? 
                        <Link href="/recuperar-senha" className="text-primary text-gradient font-weight-bold">Recuperar Senha</Link>
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
