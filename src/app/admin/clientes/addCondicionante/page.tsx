'use client';
import React, { useEffect, useState, Suspense } from 'react'; // Importamos o Suspense
import { AdminHeader } from '../../components';
import { useUsuarioService } from '../../../../services/usuario';
import { Field, Form, Formik } from 'formik';
import { useSearchParams } from 'next/navigation';

// 1. Criamos um sub-componente que vai conter o formulário e a lógica de busca
function FormularioCondicionante() {
  const usuariosSrv = useUsuarioService();
  const searchParams = useSearchParams();
  const userId = searchParams.get('id'); // Pega o ID direto da URL: ?id=123

  const [usuario, setUsuario] = useState<any>(null);
  const [mensagem, setMensagem] = useState<null | string>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarUsuario = async () => {
      try {
        // Se não vier ID na URL, já avisa o erro e para
        if (!userId) {
          console.error('ID não encontrado');
          setMensagem('Erro: ID não encontrado na URL');
          setLoading(false);
          return;
        }

        // Buscar usuário usando o userId extraído
        const usuarioCarregado = await usuariosSrv.buscar(userId);
        setUsuario({ ...usuarioCarregado, uid: userId });
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        setMensagem('Erro ao buscar os dados do usuário');
        setLoading(false);
      }
    };

    buscarUsuario();
  }, [userId, usuariosSrv]);

  const handleSalvar = async (dados: any) => {
    console.log('dados no handleSalvar:', dados);

    try {
      const retorno = await usuariosSrv.AdicionarCondicionante(dados, usuario.uid);

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
    <>
      {/* Mensagens de Sucesso ou Erro */}
      {mensagem && (
        <p className={`alert ${mensagem.includes('sucesso') ? 'alert-success' : 'alert-danger'}`}>
          {mensagem}
        </p>
      )}

      {loading ? (
        <p>Carregando dados do usuário...</p>
      ) : (
        usuario && (
          <Formik
            initialValues={{
              uid: usuario.uid,
              condicionante: '',
              data: '',
            }}
            onSubmit={handleSalvar}
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
                          as="textarea"
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
                          type="date"
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
    </>
  );
}

// 2. Este é o componente principal (a página). Ele não recebe mais {params}.
export default function UsuarioEditarPage() {
  return (
    <main>
      <AdminHeader titulo="Adicionar Condicionante" />
      <h6>Formulário</h6>
      
      {/* 3. Obrigatório no Next.js: O componente que usa useSearchParams 
        deve ficar dentro de um Suspense.
      */}
      <Suspense fallback={<p>Carregando formulário...</p>}>
        <FormularioCondicionante />
      </Suspense>
    </main>
  );
}