import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { Field, Form, Formik } from 'formik';
import * as React from 'react';
import { storage } from '@/config/firebase';

export interface Formulario1Props {
    formulario: any;
    handleSalvar(dados: any): void;
}

export default function Formulario1 ({formulario, handleSalvar}: Formulario1Props) {

    const handleSubmit = async (dados:any) => {
        //trata os arquivos
        if (dados.audio) {
            //converte o audio para blob
            await uploadBytesResumable(ref(storage, 'tela1/audio.mp3'), dados.audio)
                .then(async snapshot => {
                    //Altera o audio para URL
                    dados.audio = await getDownloadURL(snapshot.ref);
                })
        }

        if (dados.imagem) {
            //converte o audio para blob
            await uploadBytesResumable(ref(storage, 'tela1/imagem.jpg'), dados.imagem)
                .then(async snapshot => {
                    //Altera a imagem para URL
                    dados.imagem = await getDownloadURL(snapshot.ref);
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
                {/* TITULO */}
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form-control-label">Título</label>
                    <Field className="form-control" type="text" name="titulo" />
                  </div>
                </div>

                {/* TEXTO  1 */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-control-label">Texto 1</label>
                    <Field as="textarea" className="form-control" name="texto1"/>
                  </div>
                </div>
                
                {/* TEXTO  2 */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-control-label">Texto 2</label>
                    <Field as="textarea" className="form-control" name="texto2"/>
                  </div>
                </div>

                {/* AUDIO */}
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form-control-label">Audio {formulario?.audio && <a href={formulario.audio} target="_blank">(VISUALIZAR AUDIO)</a>} </label>
                    <input className="form-control" type="file" accept="audio/mp3" onChange={(e:any) => { setFieldValue("audio", e.target.files[0])  }} />
                  </div>
                </div>

                {/* IMAGEM */}
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form-control-label">Imagem {formulario?.imagem && <a href={formulario.imagem} target="_blank">(VISUALIZAR IMAGEM)</a>} </label>
                    <input className="form-control" type="file" accept="image/jpg"  onChange={(e:any) => { setFieldValue("imagem", e.target.files[0])  }} />
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
