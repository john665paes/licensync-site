'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { AdminHeader } from '../../components';
import { useUsuarioService } from '../../../../services/usuario';
import { Field, Form, Formik } from 'formik';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/config/firebase';
import { useSearchParams } from 'next/navigation';

// 1. Criamos um sub-componente que cuida do formulário e de buscar o usuário
function FormularioEdicaoCliente() {
  const usuariosSrv = useUsuarioService();
  const searchParams = useSearchParams();
  const userId = searchParams.get('id'); // Extrai o ID da URL (?id=...)

  const [usuario, setUsuario] = useState<any>(null);
  const [mensagem, setMensagem] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const buscarUsuario = async () => {
      try {
        if (!userId) {
          console.error('Nenhum ID foi informado na URL.');
          setMensagem(false);
          setLoading(false);
          return;
        }

        const usuarioCarregado = await usuariosSrv.buscar(userId);
        setUsuario({ ...usuarioCarregado, uid: userId });
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        setMensagem(false);
        setLoading(false);
      }
    };

    buscarUsuario();
  }, [userId, usuariosSrv]);

  const handleSalvar = async (dados: any) => {
    setMensagem(null); // Reseta a mensagem de status

    try {
      // Atualiza os dados do usuário
      const retorno = await usuariosSrv.atualizarCliente(dados);

      if (retorno.sucesso) {
        // Se houver um arquivo de licença, realiza o upload e chama o serviço editarLicenca
        if (file && typeof file !== 'string') {
          try {
            const filePath = `arquivos/${dados.uid}/${file.name}`;
            const storageRef = ref(storage, filePath);

            // Realiza o upload do arquivo
            await uploadBytesResumable(storageRef, file).then(async (snapshot) => {
              // Obtém a URL da licença
              const licencaUrl = await getDownloadURL(snapshot.ref);

              // Adiciona a URL da licença no objeto dados
              dados.licenca = licencaUrl;

              // Chama o serviço para salvar a URL da licença no banco
              const licencaRetorno = await usuariosSrv.editarLicenca(dados);
              if (!licencaRetorno.sucesso) {
                throw new Error('Erro ao salvar a licença');
              }
            });
          } catch (error) {
            console.error('Erro ao salvar a licença:', error);
            setMensagem(false);
            return;
          }
        }

        setMensagem(true); // Exibe mensagem de sucesso
        setFile(null); // Reseta o estado do arquivo após o upload
      } else {
        setMensagem(false); // Mostra mensagem de erro se o retorno for falso
      }
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
      setMensagem(false); // Define mensagem de erro em caso de exceção
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <>
      {/* Mensagens de Sucesso ou Erro */}
      {mensagem === false && (
        <p className="alert alert-danger">Não foi possível salvar o usuário</p>
      )}
      {mensagem === true && (
        <p className="alert alert-success">Usuário salvo com sucesso</p>
      )}

      {/* Exibe o formulário somente quando os dados do usuário são carregados */}
      {loading ? (
        <p>Carregando dados do cliente...</p>
      ) : (
        usuario && (
          <Formik
            initialValues={{
              uid: usuario.uid || '',
              empresa: usuario.empresa || '',
              cnpj: usuario.cnpj || '',
              email: usuario.email || '',
              telefone1: usuario.telefone1 || '',
              telefone2: usuario.telefone2 || '',
              endereco: usuario.endereco || '',
              cidade: usuario.cidade || '',
              cep: usuario.cep || '',
              numero: usuario.numero || '',
              complemento: usuario.complemento || '',
              bairro: usuario.bairro || '',
              uf: usuario.uf || '',
              licenca: usuario.licenca || '',
            }}
            enableReinitialize
            onSubmit={handleSalvar}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="card-body">
                  <div className="row">
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

                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-control-label">Telefone 1</label>
                        <Field className="form-control" type="text" name="telefone1" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-control-label">Telefone 2</label>
                        <Field className="form-control" type="text" name="telefone2" />
                      </div>
                    </div>

                    <div className="col-md-8">
                      <div className="form-group">
                        <label className="form-control-label">Endereço</label>
                        <Field className="form-control" type="text" name="endereco" />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="form-control-label">Cidade</label>
                        <Field className="form-control" type="text" name="cidade" />
                      </div>
                    </div>

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

                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="form-control-label">Complemento</label>
                        <Field className="form-control" type="text" name="complemento" />
                      </div>
                    </div>

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

                    {/* Campo para selecionar um novo arquivo de licença */}
                    <div className="row w-100 mx-0 mt-3">
                      <div className="col-md-6">
                        <div className="form-group text-center">
                          <label className="form-control-label d-block text-left">
                            Anexar Nova Licença (PDF)
                          </label>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                      
                      {/* Exibe a licença atual, se houver */}
                      <div className="col-md-6 d-flex align-items-center justify-content-center">
                        <div className="form-group text-center mt-3 mt-md-0">
                          {usuario.licenca && (
                            <div>
                              <a
                                href={usuario.licenca}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline-info"
                              >
                                Visualizar Licença Atual
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Botão Salvar */}
                    <div className="col-md-12 mt-4">
                      <div className="form-group">
                        <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
                          {isSubmitting ? 'Salvando Alterações...' : 'Salvar Alterações'}
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

// 2. O componente principal da página.
// Envolvemos a lógica que usa o `useSearchParams` com o `<Suspense>`.
export default function UsuarioEditarPage() {
  return (
    <main>
      <AdminHeader titulo="Editar Cliente" />
      <h6>Formulário</h6>
      
      <Suspense fallback={<p>Carregando formulário...</p>}>
        <FormularioEdicaoCliente />
      </Suspense>
    </main>
  );
}