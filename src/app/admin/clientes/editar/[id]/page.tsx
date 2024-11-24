'use client';
import React, { useEffect, useState } from 'react';
import { AdminHeader } from '../../../components';
import { useUsuarioService } from '../../../../../services/usuario';
import { Field, Form, Formik } from 'formik';

export default function UsuarioEditarPage({ params }: any) {
  const usuariosSrv = useUsuarioService();
  const [usuario, setUsuario] = useState<any>(null);
  const [mensagem, setMensagem] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarUsuario = async () => {
        try {
            const resolvedParams = await params; // Resolve os parâmetros
            const userId = resolvedParams.id;
            const usuarioCarregado = await usuariosSrv.buscar(userId); // Busca o usuário no serviço
            setUsuario({ ...usuarioCarregado, uid: userId });
            setLoading(false); // Finaliza o carregamento
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            setMensagem(false); // Mostra mensagem de erro, se necessário
            setLoading(false); // Finaliza o carregamento mesmo em caso de erro
        }
    };

    buscarUsuario();
}, [params, usuariosSrv]);


const handleSalvar = async (dados: any) => {
  setMensagem(null); // Reseta a mensagem de status

  try {
      // Chama o serviço e trata o retorno
      const retorno = await usuariosSrv.atualizarCliente(dados);

      if (!retorno.sucesso) {
          setMensagem(false); // Define mensagem de erro
      } else {
          setMensagem(true); // Define mensagem de sucesso
      }
  } catch (error) {
      console.error('Erro ao salvar os dados:', error);
      setMensagem(false); // Define mensagem de erro em caso de exceção
  }
};


  return (
    <main>
      <AdminHeader titulo={'Editar Cliente'} />
      <h6>Formulário</h6>

      {/* Mensagens de Sucesso ou Erro */}
      {mensagem === false && (
        <p className="alert alert-danger">Não foi possível salvar o usuário</p>
      )}
      {mensagem === true && (
        <p className="alert alert-success">Usuário salvo com sucesso</p>
      )}

      {/* Exibe o formulário somente quando os dados do usuário são carregados */}
      {loading ? (
        <p>Carregando...</p> // Exibe mensagem enquanto está carregando os dados
      ) : (
        usuario && (
          <Formik
            initialValues={{
              uid: usuario.uid || '', // Inclui o uid como parte dos valores iniciais
              nome: usuario.nome || '',
              email: usuario.email || '',
              senha: usuario.senha || '',
              empresa: usuario.empresa || '',
              cnpj: usuario.cnpj || '',
              telefone1: usuario.telefone1 || '',
              telefone2: usuario.telefone2 || '',
              cep: usuario.cep || '',
              endereco: usuario.endereco || '',
              numero: usuario.numero || '',
              complemento: usuario.complemento || '',
              cidade: usuario.cidade || '',
              bairro: usuario.bairro || '',
              uf: usuario.uf || '',
            }}
            enableReinitialize
            onSubmit={handleSalvar} // Chama a função handleSalvar com os dados do formulário
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="card-body">
                  <div className="row">
                    {/* Formulário de entrada */}
                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="form-control-label">Empresa</label>
                        <Field className="form-control" type="text" name="empresa" />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="form-control-label">CNPJ</label>
                        <Field className="form-control" type="text" name="cnpj" />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="form-control-label">Email:</label>
                        <Field className="form-control" type="email" name="email" />
                      </div>
                    </div>

                    {/* Outras entradas como telefone, cidade, etc. */}
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

                    {/* Campos adicionais */}
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

                    {/* CEP, Número, Bairro */}
                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="form-control-label">CEP</label>
                        <Field className="form-control" type="text" name="cep" />
                      </div>
                    </div>
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

                    {/* Bairro e UF */}
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-control-label">Bairro</label>
                        <Field className="form-control" type="text" name="bairro" />
                      </div>
                    </div>
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
        )
      )}
    </main>
  );
}
