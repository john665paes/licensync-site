import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth"
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

const FormularioService = {

     /**
     * Retorna a lista de formularios
     * @returns 
     */
    buscarFormularios: async (): Promise<any[]> => {
        //Retorna a lista de formulários
        return ["1", "2"]
    },

    /**
     * Retorna os dados de um formulario
     * @param id 
     * @returns 
     */
    buscar: async (uid: string): Promise<any>  => {
        return getDoc(doc(db, 'forms', uid))
            .then(retorno => { 
                return (retorno.exists() ? retorno.data() : null)
            })
            .catch(erro => null)
    },

    /**
     * Editar um formulario
     * @param formulario 
     * @returns 
     */
    editar: async (formulario:any): Promise<{sucesso: boolean}> => {
        return updateDoc(doc(db, 'forms', formulario.uid), formulario)
            .then(() => { return { sucesso: true }})
            .catch(() => { return { sucesso: false }});
    }


}


export const useFormularioService = () => FormularioService;