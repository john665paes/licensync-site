'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { AdminHeader } from '../../components';
import { useUsuarioService } from '../../../../services/usuario';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/config/firebase';
import { useSearchParams, useRouter } from 'next/navigation';

// Schema de Validação (Mantido)
const CadastroSchema = Yup.object().shape({
  empresa: Yup.string().required('Nome da empresa é obrigatório'),
  email: Yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  telefone1: Yup.string().required('Telefone obrigatório'),
  cnpj: Yup.string().required('CNPJ obrigatório'),
  nomeContato: Yup.string().required('Nome do contato é obrigatório'),
  endereco: Yup.string().required('Endereço obrigatório'),
  cep: Yup.string().required('CEP obrigatório'),
  numero: Yup.string().required('Número obrigatório'),
  bairro: Yup.string().required('Bairro obrigatório'),
  uf: Yup.string().length(2, 'UF deve ter 2 caracteres').required('UF obrigatório'),
});

function FormularioEdicaoCliente() {
  const usuariosSrv = useUsuarioService();
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('id');

  const [usuario, setUsuario] = useState<any>(null);
  const [mensagem, setMensagem] = useState<{ tipo: 'success' | 'danger', texto: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const buscarUsuario = async () => {
      try {
        if (!userId) return;
        const usuarioCarregado = await usuariosSrv.buscar(userId);
        setUsuario({ ...usuarioCarregado, uid: userId });
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    buscarUsuario();
  }, [userId, usuariosSrv]);

  const handleSalvar = async (dados: any) => {
    setMensagem(null);
    try {
      // 1. Upload da Licença se houver novo arquivo
      if (file) {
        const filePath = `arquivos/${dados.uid}/${file.name}`;
        const storageRef = ref(storage, filePath);
        const snapshot = await uploadBytesResumable(storageRef, file);
        dados.licenca = await getDownloadURL(snapshot.ref);
      }

      // 2. Atualiza dados no Firestore
      const retorno = await usuariosSrv.atualizarCliente(dados);

      if (retorno.sucesso) {
        setMensagem({ tipo: 'success', texto: 'Dados atualizados com sucesso! Redirecionando...' });
        setFile(null);
        
        // Redireciona para a página anterior após 2 segundos
        setTimeout(() => {
          router.back();
        }, 2000);
        
        // Rola a página para o topo para que o alerta de sucesso seja visto
        window.scrollTo({ top: 0, behavior: 'smooth' });

      } else {
        setMensagem({ tipo: 'danger', texto: 'Erro ao atualizar dados.' });
      }
    } catch (error) {
      setMensagem({ tipo: 'danger', texto: 'Erro ao processar alteração.' });
    }
  };

  if (loading) return <p className="p-4">Carregando dados do cliente...</p>;

  return (
    <div className="card shadow-lg border-0 mt-4" style={{ borderRadius: '15px' }}>
      <div className="card-header bg-white border-0 pt-4 px-4">
        <h6 className="font-weight-bolder text-success">Editar Informações</h6>
      </div>

      {mensagem && (
        <div className={`mx-4 alert alert-${mensagem.tipo} text-white shadow`}>
          {mensagem.texto}
        </div>
      )}

      {usuario && (
        <Formik
          initialValues={{
            uid: usuario.uid || '',
            empresa: usuario.empresa || '',
            email: usuario.email || '',
            telefone1: usuario.telefone1 || '',
            telefone2: usuario.telefone2 || '',
            cnpj: usuario.cnpj || '',
            nomeContato: usuario.nomeContato || '',
            endereco: usuario.endereco || '',
            cep: usuario.cep || '',
            numero: usuario.numero || '',
            bairro: usuario.bairro || '',
            uf: usuario.uf || '',
            complemento: usuario.complemento || '',
            observacoes: usuario.observacoes || '',
            licenca: usuario.licenca || '',
          }}
          validationSchema={CadastroSchema}
          enableReinitialize
          onSubmit={handleSalvar}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="p-4">
              <div className="row">
                {/* Dados Principais */}
                <div className="col-md-6 mb-3">
                  <label className="form-control-label">Nome da Empresa</label>
                  <Field className={`form-control ${errors.empresa && touched.empresa ? 'is-invalid' : ''}`} name="empresa" />
                  <ErrorMessage name="empresa" component="div" className="invalid-feedback" />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-control-label">E-mail</label>
                  <Field className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`} name="email" type="email" />
                  <ErrorMessage name="email" component="div" className="invalid-feedback" />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-control-label">CNPJ</label>
                  <Field className={`form-control ${errors.cnpj && touched.cnpj ? 'is-invalid' : ''}`} name="cnpj" />
                  <ErrorMessage name="cnpj" component="div" className="invalid-feedback" />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-control-label">Nome do Contato</label>
                  <Field className={`form-control ${errors.nomeContato && touched.nomeContato ? 'is-invalid' : ''}`} name="nomeContato" />
                  <ErrorMessage name="nomeContato" component="div" className="invalid-feedback" />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-control-label">Telefone Principal</label>
                  <Field className={`form-control ${errors.telefone1 && touched.telefone1 ? 'is-invalid' : ''}`} name="telefone1" />
                  <ErrorMessage name="telefone1" component="div" className="invalid-feedback" />
                </div>

                <div className="col-md-4 mb-3">
                    <label className="form-control-label">Telefone 2 (Opcional)</label>
                    <Field className="form-control" name="telefone2" />
                </div>

                <hr className="my-4" />
                <h6 className="text-uppercase text-muted ls-1 mb-4">Endereço</h6>

                <div className="col-md-3 mb-3">
                  <label className="form-control-label">CEP</label>
                  <Field className={`form-control ${errors.cep && touched.cep ? 'is-invalid' : ''}`} name="cep" />
                  <ErrorMessage name="cep" component="div" className="invalid-feedback" />
                </div>

                <div className="col-md-7 mb-3">
                  <label className="form-control-label">Rua/Avenida</label>
                  <Field className={`form-control ${errors.endereco && touched.endereco ? 'is-invalid' : ''}`} name="endereco" />
                  <ErrorMessage name="endereco" component="div" className="invalid-feedback" />
                </div>

                <div className="col-md-2 mb-3">
                  <label className="form-control-label">Número</label>
                  <Field className={`form-control ${errors.numero && touched.numero ? 'is-invalid' : ''}`} name="numero" />
                  <ErrorMessage name="numero" component="div" className="invalid-feedback" />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-control-label">Bairro</label>
                  <Field className={`form-control ${errors.bairro && touched.bairro ? 'is-invalid' : ''}`} name="bairro" />
                  <ErrorMessage name="bairro" component="div" className="invalid-feedback" />
                </div>

                <div className="col-md-2 mb-3">
                  <label className="form-control-label">UF</label>
                  <Field className={`form-control ${errors.uf && touched.uf ? 'is-invalid' : ''}`} name="uf" maxLength={2} />
                  <ErrorMessage name="uf" component="div" className="invalid-feedback" />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-control-label">Complemento</label>
                  <Field className="form-control" name="complemento" />
                </div>

                <hr className="my-4" />
                <h6 className="text-uppercase text-muted ls-1 mb-4">Documentação e Notas</h6>

                <div className="col-md-6 mb-3">
                  <label className="form-control-label">Anexar Nova Licença (PDF)</label>
                  <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} className="form-control" />
                </div>

                <div className="col-md-6 d-flex align-items-center">
                  {usuario.licenca && (
                    <a href={usuario.licenca} target="_blank" rel="noopener noreferrer" className="btn btn-outline-info w-100 mt-2">
                      Visualizar Licença Atual
                    </a>
                  )}
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-control-label">Observações</label>
                  <Field as="textarea" className="form-control" name="observacoes" rows={3} />
                </div>

                <div className="col-md-12 mt-4">
                  <button className="btn btn-success btn-lg w-100 shadow" type="submit" disabled={isSubmitting} style={{ borderRadius: '25px', backgroundColor: '#10B981' }}>
                    {isSubmitting ? 'Salvando Alterações...' : 'Salvar Alterações'}
                  </button>
                  <button type="button" className="btn btn-link w-100 text-muted mt-2 text-decoration-none" onClick={() => router.back()}>
                    Voltar sem salvar
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}

export default function UsuarioEditarPage() {
  return (
    <main className="container-fluid py-4">
      <AdminHeader titulo="Editar Cliente" />
      <Suspense fallback={<div className="p-4 text-center">Carregando formulário...</div>}>
        <FormularioEdicaoCliente />
      </Suspense>
    </main>
  );
}