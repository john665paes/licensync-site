'use client';
import { Field, Form, Formik, ErrorMessage } from "formik";
import Link from "next/link";
import Image from "next/image";
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
    email: Yup.string().email("E-mail não válido").required("Informe o E-mail"),
    senha: Yup.string().min(3, "A senha precisa ter 3 caracteres").required("Informe sua senha"),
  });

  const onSubmit = async ({ email, senha }: any) => {
    try {
      const { sucesso, usuario } = await usuarioSrv.logar(email, senha);
      if (sucesso) {
        setUsuario(usuario);
        router.push('/admin/dashboard');
      } else {
        setErro(true);
      }
    } catch (err) {
      setErro(true);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#fff' }}>

      {/* PARTE SUPERIOR BRANCA - LOGO */}
      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center py-5">

        <Image
          src="/login.png" // Caminho direto da pasta public
          alt="LicenSync Logo"
          width={200}
          height={150}
          priority // Adicione isso para carregar o logo mais rápido
          style={{ objectFit: 'contain' }}
        />


        <p className="mt-3 text-center px-4" style={{ color: '#2d8b4e', fontWeight: 'bold', fontSize: '2rem' }}>
          Gestão de Condicionantes Ambientais
        </p>
      </div>

      {/* PARTE INFERIOR CINZA COM BORDA VERDE */}
      <div className="py-5 px-4" style={{
        backgroundColor: '#f2eeee',
        borderTopLeftRadius: '30px',
        borderTopRightRadius: '30px',
        borderTop: '4px solid #2d8b4e',
        minHeight: '60vh'
      }}>
        <div className="mx-auto" style={{ maxWidth: '400px' }}>
          <h2 className="mb-4" style={{ color: '#2d8b4e', fontWeight: 'bold' }}>Faça seu login</h2>

          <Formik
            initialValues={{ email: '', senha: '' }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                {/* INPUT EMAIL */}
                <div className="mb-3">
                  <Field
                    type="email"
                    name="email"
                    className="form-control border-0 shadow-sm"
                    placeholder="Digite seu email"
                    style={{ padding: '15px', borderRadius: '12px' }}
                  />
                  <ErrorMessage name="email" component="div" className="text-danger small mt-1 ms-2" />
                </div>

                {/* INPUT SENHA */}
                <div className="mb-3">
                  <Field
                    type="password"
                    name="senha"
                    className="form-control border-0 shadow-sm"
                    placeholder="Insira sua senha"
                    style={{ padding: '15px', borderRadius: '12px' }}
                  />
                  <ErrorMessage name="senha" component="div" className="text-danger small mt-1 ms-2" />
                </div>

                {erro && (
                  <div className="text-danger text-center mb-3 fw-bold">
                    Email ou senha incorreto
                  </div>
                )}

                {/* BOTÃO ENTRAR */}
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn w-100 shadow-none mt-2"
                    style={{
                      backgroundColor: '#2d8b4e',
                      color: '#fff',
                      borderRadius: '30px',
                      padding: '15px',
                      fontWeight: 'bold',
                      fontSize: '18px'
                    }}
                  >
                    {isSubmitting ? 'Carregando...' : 'Entrar'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          {/* ESQUECI MINHA SENHA */}
          <div className="text-center mt-4 font-bold text-lg">
            <Link href="/recuperar-senha" style={{ color: '#2d8b4e', textDecoration: 'none' }}>
              Esqueci minha senha
            </Link>
            <span className="mx-2" style={{ color: '#2d8b4e', fontWeight: 'bold' }}>|</span>
            <Link href="/recuperar-senha" style={{ color: '#2d8b4e', textDecoration: 'none' }}>
              Ainda não tenho Cadastro
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}