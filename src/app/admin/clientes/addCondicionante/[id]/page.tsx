'use client';
import React, { useEffect, useState } from 'react';
import { AdminHeader } from '../../../components';
import { useUsuarioService } from '../../../../../services/usuario';
import { Field, Form, Formik } from 'formik';

export default function UsuarioEditarPage({ params }: { params: { id: string } }) {
  const usuariosSrv = useUsuarioService();
  const [mensagem, setMensagem] = useState<null | string>(null); // Mensagem de sucesso ou erro
  const [loading, setLoading] = useState(false); // Remover a dependência do carregamento do usuário

  useEffect(() => {
    setLoading(false); // Não precisamos mais carregar dados, então setamos o loading como false diretamente
  }, [params]);

  const handleSalvar = async (dados: any) => {
    setMensagem(null); // Reseta a mensagem de status

    try {
      if (!params?.id) throw new Error('ID do usuário não encontrado.');
      const retorno = await usuariosSrv.AdicionarCondicionante({
        id: params.id,
        ...dados,
      });

      if (!retorno.sucesso) {
        setMensagem('Não foi possível salvar o condicionante.'); // Mensagem de erro
      } else {
        setMensagem('Condicionante salvo com sucesso!'); // Mensagem de sucesso
      }
    } catch (error: any) {
      console.error('Erro ao salvar os dados:', error);
      setMensagem(error.message || 'Erro ao salvar os dados.');
    }
  };

  return (
    <main>
      <AdminHeader titulo="Adicionar Condicionante" />
      <h6>Formulário</h6>

      {/* Mensagens de Sucesso ou Erro */}
      {mensagem && (
        <p
          className={`alert ${
            mensagem.includes('sucesso') ? 'alert-success' : 'alert-danger'
          }`}
        >
          {mensagem}
        </p>
      )}

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <Formik
          initialValues={{
            conteudo: '', // Deixe os campos vazios, sem dados do banco
            data: '', // Deixe o campo de data vazio
          }}
          onSubmit={handleSalvar}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="card-body">
                <div className="row">
                  {/* Campo Textarea */}
                  <div className="col-md-12">
                    <div className="form-group">
                      <label className="form-control-label">Conteúdo</label>
                      <Field
                        as="textarea"
                        className="form-control"
                        name="conteudo"
                        placeholder="Digite o conteúdo aqui..."
                        required
                      />
                    </div>
                  </div>

                  {/* Campo de Seleção de Data */}
                  <div className="col-md-12">
                    <div className="form-group">
                      <label className="form-control-label">Data</label>
                      <Field
                        className="form-control"
                        type="date"
                        name="data"
                        required
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
      )}
    </main>
  );
}
