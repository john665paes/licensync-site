"use client";
import * as React from 'react';
import { AdminHeader } from '../../components';
import { useUsuarioService } from '../../../../services/usuario';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';

// Schema de Validação idêntico ao App
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

export default function UsuarioEditarPage() {
  const usuariosSrv = useUsuarioService();
  const router = useRouter();
  const [mensagem, setMensagem] = React.useState<{ tipo: 'success' | 'danger', texto: string } | null>(null);

  const handleSalvar = async (values: any) => {
    setMensagem(null);
    try {
      // No seu App, a senha padrão é o CNPJ para clientes, vamos manter a lógica
      const dadosParaEnviar = {
        ...values,
        senha: values.cnpj.replace(/\D/g, ''), // Senha apenas números do CNPJ
      };

      const retorno = await usuariosSrv.cadastrarCliente(dadosParaEnviar);
      
      if (retorno.sucesso) {
        setMensagem({ tipo: 'success', texto: 'Cliente cadastrado com sucesso!' });
        // Opcional: redirecionar após 2 segundos
        setTimeout(() => router.push('/admin/dashboard'), 2000);
      } else {
        setMensagem({ tipo: 'danger', texto: 'Erro ao cadastrar: Verifique se o e-mail já existe.' });
      }
    } catch (error) {
      setMensagem({ tipo: 'danger', texto: 'Erro de comunicação com o servidor.' });
    }
  };

  return (
    <main className="container-fluid py-4">
      <AdminHeader titulo={'Cadastrar Novo Cliente'} />
      
      <div className="card shadow-lg border-0 mt-4" style={{ borderRadius: '15px' }}>
        <div className="card-header bg-white border-0 pt-4 px-4">
          <h6 className="font-weight-bolder text-success">Informações do Cliente</h6>
          <p className="text-sm">Preencha todos os dados para criar o acesso do cliente.</p>
        </div>

        {mensagem && (
          <div className={`mx-4 alert alert-${mensagem.tipo} text-white`}>
            {mensagem.texto}
          </div>
        )}

        <Formik
          initialValues={{
            empresa: '',
            email: '',
            telefone1: '',
            telefone2: '',
            cnpj: '',
            nomeContato: '',
            endereco: '',
            cep: '',
            numero: '',
            bairro: '',
            uf: '',
            complemento: '',
            observacoes: '',
          }}
          validationSchema={CadastroSchema}
          onSubmit={handleSalvar}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <div className="card-body p-4">
                <div className="row">
                  {/* Dados Principais */}
                  <div className="col-md-6 mb-3">
                    <label className="form-control-label">Nome da Empresa</label>
                    <Field className={`form-control ${errors.empresa && touched.empresa ? 'is-invalid' : ''}`} name="empresa" />
                    <ErrorMessage name="empresa" component="div" className="invalid-feedback" />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-control-label">E-mail de Acesso</label>
                    <Field className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`} name="email" type="email" />
                    <ErrorMessage name="email" component="div" className="invalid-feedback" />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-control-label">CNPJ (Apenas números)</label>
                    <Field className={`form-control ${errors.cnpj && touched.cnpj ? 'is-invalid' : ''}`} name="cnpj" placeholder="00.000.000/0000-00" />
                    <ErrorMessage name="cnpj" component="div" className="invalid-feedback" />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-control-label">Nome do Contato/Responsável</label>
                    <Field className={`form-control ${errors.nomeContato && touched.nomeContato ? 'is-invalid' : ''}`} name="nomeContato" />
                    <ErrorMessage name="nomeContato" component="div" className="invalid-feedback" />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-control-label">Telefone Principal</label>
                    <Field className={`form-control ${errors.telefone1 && touched.telefone1 ? 'is-invalid' : ''}`} name="telefone1" />
                    <ErrorMessage name="telefone1" component="div" className="invalid-feedback" />
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
                    <label className="form-control-label">Complemento (Opcional)</label>
                    <Field className="form-control" name="complemento" />
                  </div>

                  <div className="col-md-12 mb-3">
                    <label className="form-control-label">Observações Internas</label>
                    <Field as="textarea" className="form-control" name="observacoes" rows={3} />
                  </div>

                  <div className="col-md-12 mt-4">
                    <button 
                      className="btn btn-success btn-lg w-100" 
                      type="submit" 
                      disabled={isSubmitting}
                      style={{ borderRadius: '25px', backgroundColor: '#10B981' }}
                    >
                      {isSubmitting ? (
                        <span className="spinner-border spinner-border-sm me-2"></span>
                      ) : 'Finalizar Cadastro do Cliente'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-link w-100 text-muted mt-2"
                      onClick={() => router.back()}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
}
