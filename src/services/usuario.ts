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
        // 1. Tenta autenticar no Firebase Auth
        const retorno = await signInWithEmailAndPassword(auth, email, senha);
        const userUid = retorno.user.uid;

        // 2. Busca os dados completos deste usuário no Firestore
        // Buscamos pelo ID do documento que deve ser o UID do usuário
        const docRef = doc(db, 'usuarios', userUid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
            const dadosUsuario = snap.data();

            // 3. Verifica se ele é admin
            if (dadosUsuario.nivel === 'admin') {
                // Retornamos um objeto único contendo os dados do Auth + dados do Firestore (NOME, etc)
                return { 
                    sucesso: true, 
                    usuario: { ...retorno.user, ...dadosUsuario } 
                };
            } else {
                console.warn("Usuário não tem permissão de administrador.");
                return { sucesso: false };
            }
        }

        console.warn("Usuário autenticado no Auth, mas dados não encontrados no Firestore.");
        return { sucesso: false };
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
            const uid = retorno.user.uid; // Pega o UID gerado
            delete usuario.senha;
            delete usuario.confirmarSenha;

            // Define o ID do documento como o UID do Auth
            const usuarioDOC = doc(db, 'usuarios', uid);
            await setDoc(usuarioDOC, {
                ...usuario,
                id: uid,       // Garante que o campo 'id' interno seja o UID
                nivel: 'admin',
            });

            return { sucesso: true };
        })
        .catch(erro => {
            console.error(erro);
            return { sucesso: false };
        });
},


/**
 * Excluir um usuário do Firestore
 */
excluirUsuario: async (uid: any): Promise<{ sucesso: boolean }> => {
    try {
        // 1. Garantir que o UID seja uma string e não esteja vazio
        const idLimpo = String(uid).trim();

        if (!idLimpo || idLimpo === "undefined" || idLimpo === "[object Object]") {
            console.error("ID inválido fornecido para exclusão:", uid);
            return { sucesso: false };
        }

        const authInstance = getAuth();
        const userLogado = authInstance.currentUser;

        // 2. Trava de segurança para não se autodeletar
        if (userLogado && userLogado.uid === idLimpo) {
            console.error("Operação negada: Não é possível excluir o próprio perfil logado.");
            return { sucesso: false };
        }

        // 3. Referência do documento (Onde o erro costuma acontecer se o ID estiver mal formado)
        const docRef = doc(db, 'usuarios', idLimpo);

        // 4. Execução da exclusão
        await deleteDoc(docRef);

        console.log(`Usuário ${idLimpo} removido com sucesso.`);
        return { sucesso: true };

    } catch (erro: any) {
        // Captura o erro sem deixar o app travar
        console.error("Erro ao excluir usuário:", erro.message);
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