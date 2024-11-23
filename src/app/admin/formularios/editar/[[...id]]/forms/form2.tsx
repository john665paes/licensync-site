import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { Field, Form, Formik } from 'formik';
import * as React from 'react';
import { storage } from '@/config/firebase';

export interface Formulario1Props {
    formulario: any;
    handleSalvar(dados: any): void;
}

export default function Formulario2 ({formulario, handleSalvar}: Formulario1Props) {

    const handleSubmit = async (dados:any) => {
        //trata os arquivos
        if (dados.imagem) {
            //converte o audio para blob
            await uploadBytesResumable(ref(storage, 'tela2/imagem1.jpg'), dados.imagem)
                .then(async snapshot => {
                    //Altera a imagem para URL
                    dados.imagem = await getDownloadURL(snapshot.ref);
                })
        }

        if (dados.imagem2) {
          //converte o audio para blob
          await uploadBytesResumable(ref(storage, 'tela2/imagem2.jpg'), dados.imagem2)
              .then(async snapshot => {
                  //Altera a imagem para URL
                  dados.imagem2 = await getDownloadURL(snapshot.ref);
              })
        }

        handleSalvar(dados);
    }

    return (
        <Formik
            initialValues={formulario}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({isSubmitting, setFieldValue}) => (
              <Form>
            <div className="card-body">  
              <div className="row">                

                {/* TEXTO */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-control-label">Texto</label>
                    <Field as="textarea" className="form-control" name="texto"/>
                  </div>
                </div>

                {/* IMAGEM */}
                <div className="col-md-12">
                  <div className="form-group">
                  <label className="form-control-label">Imagem {formulario?.imagem && <a href={formulario.imagem} target="_blank">(VISUALIZAR IMAGEM)</a>} </label>
                    <input className="form-control" type="file" accept="image/jpg"  onChange={(e:any) => { setFieldValue("imagem", e.target.files[0])  }} />
                  </div>
                </div>

                 {/* IMAGEM 2*/}
                 <div className="col-md-12">
                  <div className="form-group">
                  <label className="form-control-label">Imagem 2 {formulario?.imagem2 && <a href={formulario.imagem2} target="_blank">(VISUALIZAR IMAGEM)</a>} </label>
                    <input className="form-control" type="file" accept="image/jpg"  onChange={(e:any) => { setFieldValue("imagem2", e.target.files[0])  }} />
                  </div>
                </div>

                

                {/* BOTÃO */}
                <div className="col-md-12">
                  <div className="form-group">
                    <button className='btn btn-primary w-100' type="submit" disabled={isSubmitting}>Salvar</button>
                  </div>
                </div>
              </div>
            </div>
            </Form>)}   
          </Formik>
    );
}
