"use client";
import React, { useState } from 'react';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import { useUsuarioService } from '../../../services/usuario';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import * as Yup from "yup";
import { useUsuarioContext } from '@/context/usuario-context';

export default function CadastroPage() {
  const usuariosSrv = useUsuarioService();
  const { deslogar } = useUsuarioContext(); // Importe do seu contexto para limpar o login automático
  const router = useRouter();
  
  // Estados para visibilidade das senhas
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [exibirModal, setExibirModal] = useState(false);

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required("Nome é obrigatório"),
    sobrenome: Yup.string().required("Sobrenome é obrigatório"),
    email: Yup.string().email("Email inválido").required("Email é obrigatório"),
    empresa: Yup.string().required("Empresa é obrigatória"),
    senha: Yup.string().min(6, "Mínimo 6 caracteres").required("Senha é obrigatória"),
    confirmarSenha: Yup.string()
      .oneOf([Yup.ref('senha')], 'As senhas não conferem')
      .required("Confirmação é obrigatória"),
  });

  const handleSalvar = async (values: any) => {
  setMensagem(null);

  // 1. Unifica nome e sobrenome antes de enviar para o service
  const usuarioCompleto = {
    ...values,
    nome: `${values.nome} ${values.sobrenome}`
  };

  // 2. Tenta realizar o cadastro
  const retorno = await usuariosSrv.cadastrarAdm(usuarioCompleto);

  if (retorno.sucesso) {
    // Caso de sucesso: exibe modal, desloga e redireciona
    setExibirModal(true);
    
    // O Firebase loga automaticamente ao criar conta, então deslogamos 
    // para forçar o usuário a confirmar o login na tela inicial.
    await deslogar(); 

    setTimeout(() => {
      setExibirModal(false);
      router.push('/'); 
    }, 3000);
    
  } else {
    // Caso de erro (E-mail duplicado ou falha no Firebase)
    alert("Este e-mail já está sendo usado por outra conta ou os dados são inválidos.");
  }
};

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#fff' }}>
      
      {/* POP-UP DE SUCESSO */}
      {exibirModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div className="p-5 text-center shadow-lg" style={{
            backgroundColor: '#fff', borderRadius: '20px', borderTop: '5px solid #2d8b4e'
          }}>
            <div style={{ fontSize: '50px' }}>✅</div>
            <h3 className="fw-bold mt-3" style={{ color: '#2d8b4e' }}>Sucesso!</h3>
            <p className="text-muted">Cadastro realizado com sucesso.<br/>Redirecionando para o login...</p>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center py-4">
        <Image src="/login.png" alt="Logo" width={150} height={100} priority style={{ objectFit: 'contain' }} />
        <h4 className="mt-2 fw-bold" style={{ color: '#2d8b4e' }}>Criar nova conta</h4>
      </div>

      {/* FORMULÁRIO */}
      <div className="py-5 px-4" style={{ 
        backgroundColor: '#f2eeee', borderTopLeftRadius: '30px', borderTopRightRadius: '30px',
        borderTop: '4px solid #2d8b4e', minHeight: '75vh' 
      }}>
        <div className="mx-auto" style={{ maxWidth: '600px' }}>
          
          <Formik
            initialValues={{ nome: '', sobrenome: '', email: '', empresa: '', senha: '', confirmarSenha: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSalvar}
          >
            {({ values, errors, touched }) => (
              <Form className="row g-3">
                {/* NOME E SOBRENOME */}
                <div className="col-md-6">
                  <label className="form-label fw-bold text-success">Nome</label>
                  <Field name="nome" className="form-control border-0 shadow-sm p-3 rounded-4" />
                  <ErrorMessage name="nome" component="div" className="text-danger small" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold text-success">Sobrenome</label>
                  <Field name="sobrenome" className="form-control border-0 shadow-sm p-3 rounded-4" />
                  <ErrorMessage name="sobrenome" component="div" className="text-danger small" />
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold text-success">E-mail</label>
                  <Field name="email" type="email" className="form-control border-0 shadow-sm p-3 rounded-4" />
                  <ErrorMessage name="email" component="div" className="text-danger small" />
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold text-success">Empresa</label>
                  <Field name="empresa" className="form-control border-0 shadow-sm p-3 rounded-4" />
                  <ErrorMessage name="empresa" component="div" className="text-danger small" />
                </div>

                {/* SENHA */}
                <div className="col-md-6 position-relative">
                  <label className="form-label fw-bold text-success">Senha</label>
                  <div className="input-group">
                    <Field 
                      name="senha" 
                      type={showSenha ? "text" : "password"} 
                      className="form-control border-0 shadow-sm p-3 rounded-start-4" 
                    />
                    <span 
                      className="input-group-text border-0 bg-white shadow-sm rounded-end-4" 
                      onClick={() => setShowSenha(!showSenha)} 
                      style={{ cursor: 'pointer' }}
                    >
                      {showSenha ? '👁️‍🗨️' : '👁️'}
                    </span>
                  </div>
                  <ErrorMessage name="senha" component="div" className="text-danger small" />
                </div>

                {/* CONFIRMAR SENHA */}
                <div className="col-md-6 position-relative">
                  <label className="form-label fw-bold text-success">Confirmar Senha</label>
                  <div className="input-group">
                    <Field 
                      name="confirmarSenha" 
                      type={showConfirmar ? "text" : "password"} 
                      className="form-control border-0 shadow-sm p-3 rounded-start-4" 
                    />
                    <span 
                      className="input-group-text border-0 bg-white shadow-sm rounded-end-4" 
                      onClick={() => setShowConfirmar(!showConfirmar)} 
                      style={{ cursor: 'pointer' }}
                    >
                      {showConfirmar ? '👁️‍🗨️' : '👁️'}
                    </span>
                  </div>
                  {/* Mensagem de sucesso na comparação */}
                  {!errors.confirmarSenha && values.confirmarSenha && (
                    <div className="text-success small fw-bold mt-1">✓ As senhas conferem</div>
                  )}
                  <ErrorMessage name="confirmarSenha" component="div" className="text-danger small" />
                </div>

                <div className="col-12 text-center mt-5">
                  <button type="submit" className="btn w-100 p-3 fw-bold text-white rounded-pill shadow-none" 
                    style={{ backgroundColor: '#2d8b4e', fontSize: '18px' }}>
                    Finalizar Cadastro
                  </button>
                  <Link href="/" className="d-block mt-3 fw-bold text-success text-decoration-none">
                    Já tenho conta? Voltar ao Login
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}