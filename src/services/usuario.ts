import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, deleteUser, getAuth } from "firebase/auth"
import { auth, db, storage } from '@/config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";

const UsuarioService = {

    /**
     * Loga usuário
     * @param email 
     * @param senha 
     * @returns {usuario caso logado com sucesso, e o sucesso com um status de logado ou não}
     */
    logar: async (email: string, senha: string): Promise<{ usuario?: any; sucesso: boolean }> => {
        try {
            // Tenta fazer o login do usuário com email e senha
            const retorno = await signInWithEmailAndPassword(auth, email, senha);
            console.log("Usuário autenticado:", retorno.user.uid);

            // Consulta no Firestore, verificando o 'uid' do usuário e o nível de 'admin'
            const consulta = query(collection(db, 'usuarios'),
                where('uid', '==', retorno.user.uid),   // Verifique se o campo no Firestore é 'uid' ou outro
                where('nivel', '==', 'admin'));

            const dados = await getDocs(consulta);
            console.log("Usuários encontrados:", dados.size);

            if (dados.size > 0) {
                return { sucesso: true, usuario: retorno.user };
            }

            console.warn("Usuário autenticado, mas não encontrado no Firestore com nível 'admin'.");
            return { sucesso: false }; // Usuário autenticado, mas não encontrado no Firestore com nível 'admin'
        } catch (erro: any) {
            console.error("Erro durante o login:", erro.code, erro.message);
            return { sucesso: false };
        }
    },

    /**
     * Função para recuperar senha
     * @param email 
     * @returns sucesso status booleano caso tenha conseguido solicitar nova senha
     */
    recuperarSenha: async (email: string): Promise<{ sucesso: boolean }> => {
        return sendPasswordResetEmail(auth, email)
            .then((retorno) => { return { sucesso: true } })
            .catch(erro => { return { sucesso: false } });
    },

    /**
     * Retorna a lista de usuários do sistema
     * @returns 
     */
    buscarUsuarios: async (): Promise<any[]> => {
        return getDocs(collection(db, 'usuarios'))
            .then(snapshots => {
                const retorno: any[] = [];
                snapshots.forEach(snap => {
                    retorno.push(snap.data())
                })
                return retorno;
            })
            .catch(erro => [])
    },

    /**
     * Retorna a lista de usuários do sistema, exceto os administradores
     * @returns 
     */

    buscarUsuariosCliente: async (): Promise<any[]> => {
        try {
            const usuariosQuery = query(collection(db, 'usuarios'), where('nivel', '==', 'cliente'));
            const snapshots = await getDocs(usuariosQuery);
            return snapshots.docs.map(doc => doc.data());
        } catch (erro) {
            console.error(erro);
            return [];
        }
    },

    /**
     * Retorna os dados de um usuário
     * @param id 
     * @returns 
     */
    buscar: async (id: string): Promise<any> => {
        return getDoc(doc(db, 'usuarios', id))
            .then(retorno => {
                return (retorno.exists() ? retorno.data() : null)
            })
            .catch(erro => null)
    },

    /**
     * Cadastra um novo usuário
     * @param usuario 
     * @returns 
     */
    cadastrarCliente: async (usuario: any): Promise<{ sucesso: boolean }> => {
        return createUserWithEmailAndPassword(auth, usuario.email, usuario.cnpj)
            .then(async retorno => {
                usuario.id = retorno.user.uid;
                delete usuario.senha;

                // Adicionando o nível antes de salvar
                const usuarioDOC = doc(db, 'usuarios', usuario.id);
                await setDoc(usuarioDOC, {
                    ...usuario,
                    nivel: 'cliente', // Adicionando explicitamente o nível
                });

                return { sucesso: true };
            })
            .catch(erro => {
                console.error(erro);
                return { sucesso: false };
            });
    },


    cadastrarAdm: async (usuario: any): Promise<{ sucesso: boolean }> => {
        return createUserWithEmailAndPassword(auth, usuario.email, usuario.senha)
            .then(async retorno => {
                usuario.id = retorno.user.uid;
                delete usuario.senha;

                // Adicionando o nível 'admin' antes de salvar
                const usuarioDOC = doc(db, 'usuarios', usuario.uid);
                await setDoc(usuarioDOC, {
                    ...usuario,
                    nivel: 'admin', // Definindo o nível como 'admin'
                });

                return { sucesso: true };
            })
            .catch(erro => {
                console.error(erro);
                return { sucesso: false };
            });
    },



    /**
     * Excluir um usuario
     * @param usuario 
     * @returns 
     */
    excluirUsuario: async (uid: string): Promise<{ sucesso: boolean }> => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            // Verificar se o usuário atual é o mesmo a ser deletado
            if (user && user.uid === uid) {
                // Deletar do Firestore
                await deleteDoc(doc(db, 'usuarios', uid));

                // Deletar da Autenticação
                await deleteUser(user);

                console.log(`Usuário ${uid} deletado com sucesso.`);
                return { sucesso: true };
            } else {
                console.error('O usuário atual não corresponde ao UID fornecido.');
                return { sucesso: false };
            }
        } catch (erro) {
            console.error("Erro ao excluir usuário:", erro);
            return { sucesso: false };
        }
    },
    /**
     * Edita um usuário
     * @param usuario 
     * @returns 
     */
    atualizarCliente: async (usuario: any): Promise<{ sucesso: boolean }> => {
        try {
            usuario.id = usuario.uid;
            // Valida se o UID está presente
            if (!usuario.id) {
                throw new Error('ID do usuário (uid) não fornecido.');
            }

            // Remove campos sensíveis antes de salvar
            delete usuario.senha;

            // Referência ao documento do Firestore
            const usuarioDOC = doc(db, 'usuarios', usuario.id);

            // Atualiza ou mescla os dados do usuário
            await setDoc(
                usuarioDOC,
                {
                    ...usuario,
                    nivel: usuario.nivel || 'cliente', // Adiciona o nível se não existir
                },
                { merge: true } // Mescla com os dados existentes
            );

            return { sucesso: true };
        } catch (erro) {
            console.error('Erro ao atualizar o usuário:', erro);
            return { sucesso: false };
        }
    },
    AdicionarCondicionante: async (condicionante: any, usuario: any): Promise<{ sucesso: boolean }> => {
        // Verifique se o objeto 'usuario' e o 'uid' estão definidos
        if (!usuario) {
            console.error('Erro: usuário ou uid não definido');
            return { sucesso: false }; // Retorna falso se o uid não estiver presente
        }
    
        try {
           
            // Salvar o condicionante na subcoleção 'condicionantes' do usuário
            await addDoc(collection(db, 'usuarios', usuario, 'condicionantes'), condicionante);
    
            return { sucesso: true };
        } catch (error) {
            console.error('Erro ao salvar condicionante:', error);
            return { sucesso: false }; // Retorna falso em caso de erro
        }
    },    

    editarLicenca: async (usuario: any): Promise<{ sucesso: boolean }> => {
        return updateDoc(doc(db, 'usuarios', usuario.id), usuario)
            .then(() => { return { sucesso: true } })
            .catch(() => { return { sucesso: false } });
    },
}


export const useUsuarioService = () => UsuarioService;