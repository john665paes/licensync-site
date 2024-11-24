"use client";
import * as React from 'react';
import { AdminHeader } from '../../components';
import { useUsuarioService } from '../../../../services/usuario';
import { Field, Form, Formik } from 'formik';

export default function UsuarioEditarPage({ params }: any) {
  const usuariosSrv = useUsuarioService();
  const [mensagem, setMensagem] = React.useState<null | boolean>(null);

  // Função para salvar os dados do usuário
  const handleSalvar = async (usuario: any) => {
    setMensagem(null);
    const retorno = await usuariosSrv.cadastrarCliente(usuario);
    setMensagem(retorno.sucesso);
  };

  return (
    <main>
      <AdminHeader titulo={'Cadastrar Cliente'} />
      <h6>Formulário</h6>

      {mensagem != null && mensagem === false && (
        <p className="alert alert-danger">Não foi possível cadastrar usuário</p>
      )}
      {mensagem != null && mensagem === true && (
        <p className="alert alert-success">Cadastrado com sucesso</p>
      )}

      <Formik
        initialValues={{
          nome: '',
          email: '',
          senha: '',
          empresa: '',
          cnpj: '',
          telefone1: '',
          telefone2: '',
          cep: '',
          endereco: '',
          numero: '',
          complemento: '',
          cidade: '',
          bairro: '',
          uf: '',
        }}
        enableReinitialize
        onSubmit={handleSalvar}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="card-body">
              <div className="row">

                {/* Empresa */}
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-control-label">Empresa</label>
                    <Field className="form-control" type="text" name="empresa" />
                  </div>
                </div>

                {/* CNPJ */}
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-control-label">CNPJ</label>
                    <Field className="form-control" type="text" name="cnpj" />
                  </div>
                </div>

                {/* Email */}
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-control-label">Email:</label>
                    <Field className="form-control" type="email" name="email" />
                  </div>
                </div>

                {/* Telefones */}
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-control-label">Telefone 1</label>
                    <Field className="form-control" type="text" name="telefone1" />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-control-label">Telefone 2</label>
                    <Field className="form-control" type="text" name="telefone2" />
                  </div>
                </div>

                {/* Cidade */}
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-control-label">Cidade</label>
                    <Field className="form-control" type="text" name="cidade" />
                  </div>
                </div>

                {/* Endereço */}
                <div className="col-md-8">
                  <div className="form-group">
                    <label className="form-control-label">Endereço</label>
                    <Field className="form-control" type="text" name="endereco" />
                  </div>
                </div>

                {/* CEP */}
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-control-label">CEP</label>
                    <Field className="form-control" type="text" name="cep" />
                  </div>
                </div>


                {/* Número */}
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-control-label">Número</label>
                    <Field className="form-control" type="text" name="numero" />
                  </div>
                </div>

                {/* Complemento */}
                <div className="col-md-8">
                  <div className="form-group">
                    <label className="form-control-label">Complemento</label>
                    <Field className="form-control" type="text" name="complemento" />
                  </div>
                </div>


                {/* Bairro */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-control-label">Bairro</label>
                    <Field className="form-control" type="text" name="bairro" />
                  </div>
                </div>

                {/* UF */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-control-label">UF</label>
                    <Field className="form-control" type="text" name="uf" />
                  </div>
                </div>

                {/* Botão Salvar */}
                <div className="col-md-12">
                  <div className="form-group">
                    <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Enviando...' : 'Salvar'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </main>
  );
}
