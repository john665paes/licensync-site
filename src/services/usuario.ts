import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from '@/config/firebase';
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";

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
                usuario.uid = retorno.user.uid;
                delete usuario.senha;

                // Adicionando o nível antes de salvar
                const usuarioDOC = doc(db, 'usuarios', usuario.uid);
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
                usuario.uid = retorno.user.uid;
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
    excluir: async (usuario: any): Promise<{ sucesso: boolean }> => {
        return deleteDoc(doc(db, 'usuarios', usuario.uid))
            .then(retorno => {
                return { sucesso: true }
            })
            .catch(erro => {
                return { sucesso: false }
            })
    }


}


export const useUsuarioService = () => UsuarioService;