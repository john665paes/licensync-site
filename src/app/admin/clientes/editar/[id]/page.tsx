'use client';
import React, { useEffect, useState } from 'react';
import { AdminHeader } from '../../../components';
import { useUsuarioService } from '../../../../../services/usuario';
import { Field, Form, Formik } from 'formik';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/config/firebase';

export default function UsuarioEditarPage({ params }: any) {
  const usuariosSrv = useUsuarioService();
  const [usuario, setUsuario] = useState<any>(null);
  const [mensagem, setMensagem] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null); // Estado para gerenciar o arquivo da licença

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
      // Atualiza os dados do usuário
      const retorno = await usuariosSrv.atualizarCliente(dados);

      if (retorno.sucesso) {
        // Se houver um arquivo de licença, realiza o upload e chama o serviço editarLicenca
        if (file && typeof file !== 'string') {
          try {
            const filePath = `licencas/${dados.uid}/${file.name}`;
            const storageRef = ref(storage, filePath);

            // Realiza o upload do arquivo
            await uploadBytesResumable(storageRef, file).then(async (snapshot) => {
              // Obtém a URL da licença
              const licencaUrl = await getDownloadURL(snapshot.ref);

              // Adiciona a URL da licença no objeto `dados`
              dados.licenca = licencaUrl;

              // Chama o serviço para salvar a URL da licença no banco
              const licencaRetorno = await usuariosSrv.editarLicenca(dados);
              if (!licencaRetorno.sucesso) {
                throw new Error('Erro ao salvar a licença');
              }
            });
          } catch (error) {
            console.error('Erro ao salvar a licença:', error);
            setMensagem(false); // Define mensagem de erro caso o upload ou a atualização da licença falhe
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

  // Função para lidar com a seleção do arquivo de licença
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]); // Armazena o arquivo selecionado
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

                    {/* Outras entradas */}
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

                    {/* Cidade e Endereço */}
                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="form-control-label">Cidade</label>
                        <Field className="form-control" type="text" name="cidade" />
                      </div>
                    </div>

                    <div className="col-md-8">
                      <div className="form-group">
                        <label className="form-control-label">Endereço</label>
                        <Field className="form-control" type="text" name="endereco" />
                      </div>
                    </div>

                    {/* Arquivo de licença */}
                    <div className="col-md-6">
                      <div className="form-group text-center">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="form-control"
                        />
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