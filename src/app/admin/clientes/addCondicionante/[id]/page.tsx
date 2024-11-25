'use client';
import React, { useEffect, useState } from 'react';
import { AdminHeader } from '../../../components';
import { useUsuarioService } from '../../../../../services/usuario';
import { Field, Form, Formik } from 'formik';

export default function UsuarioEditarPage({ params }: { params: Promise<{ id: string }> }) {
  const usuariosSrv = useUsuarioService();
  const [usuario, setUsuario] = useState<any>(null);
  const [mensagem, setMensagem] = useState<null | string>(null); // Mensagem de sucesso ou erro
  const [loading, setLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    const buscarUsuario = async () => {
      try {
        const resolvedParams = await params; // Resolve o Promise
        const userId = resolvedParams.id; // Acesse o ID do resolvedParams
        if (!userId) {
          console.error('ID não encontrado');
          setMensagem('Erro: ID não encontrado');
          setLoading(false);
          return;
        }

        // Buscar usuário usando o ID
        const usuarioCarregado = await usuariosSrv.buscar(userId); // Busca o usuário no serviço
        setUsuario({ ...usuarioCarregado, uid: userId });
        setLoading(false); // Finaliza o carregamento
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        setMensagem('Erro ao buscar os dados do usuário');
        setLoading(false); // Finaliza o carregamento mesmo em caso de erro
      }
    };

    buscarUsuario();
  }, [params, usuariosSrv]);

  const handleSalvar = async (dados: any) => {
    console.log('dados no handleSalvar:', dados); // Adicione um log para depurar

    try {
        // Atualiza os dados do usuário
        const retorno = await usuariosSrv.AdicionarCondicionante(dados);

        if (retorno.sucesso) {
            setMensagem('Condicionante adicionado com sucesso!');
        } else {
            setMensagem('Erro ao adicionar condicionante.');
        }
    } catch (error) {
        console.error('Erro ao salvar os dados:', error);
        setMensagem('Erro ao salvar os dados');
    }
};

  return (
    <main>
      <AdminHeader titulo="Adicionar Condicionante" />
      <h6>Formulário</h6>

      {/* Mensagens de Sucesso ou Erro */}
      {mensagem && (
        <p
          className={`alert ${mensagem.includes('sucesso') ? 'alert-success' : 'alert-danger'}`}
        >
          {mensagem}
        </p>
      )}

      {loading ? (
        <p>Carregando...</p>
      ) : (
        usuario && (
          <Formik
            initialValues={{
              uid: usuario.uid,
              condicionante: '', // Deixe os campos vazios, sem dados do banco
              data: '', // Deixe o campo de data vazio
            }}
            onSubmit={handleSalvar} // Chama a função handleSalvar com os dados do formulário
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="card-body">
                  <div className="columns">
                    {/* Campo Textarea para Condicionante */}
                    <div className="col-md-12">
                      <div className="form-group">
                        <label className="form-control-label">Condicionante:</label>
                        <Field
                          as="textarea" // Usando "textarea" para o campo condicionante
                          className="form-control"
                          name="condicionante"
                        />
                      </div>
                    </div>

                    {/* Campo de Seleção de Data */}
                    <div className="col-md-5">
                      <div className="form-group">
                        <label className="form-control-label">Data Vencimento:</label>
                        <Field
                          className="form-control"
                          type="date" // Usando o tipo "date" para o campo de data
                          name="data"
                        />
                      </div>
                    </div>

                    {/* Botão Salvar */}
                    <div className="col-md-12">
                      <div className="form-group">
                        <button
                          className="btn btn-primary w-100"
                          type="submit"
                          disabled={isSubmitting}
                        >
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
