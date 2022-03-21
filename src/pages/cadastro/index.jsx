import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import Head from "next/head";
import styles from "./cadastro.module.scss";
import axios from "axios";

import Link from "next/link";

export default function Cadastro() {
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);

  const LoginSchema = Yup.object().shape({
    name: Yup.string()
      .min(5, "Nome Completo")
      .matches(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/, "Nome inválido")
      .required("Nome é obrigatório"),
    phone: Yup.string()
      .min(11, "Numero inválido")
      .max(11, "Numero inválido")
      .matches(
        /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})-?(\d{4}))$/,
        "Numero inválido"
      )
      .required("Celular é obrigatório"),
    email: Yup.string()
      .email("E-mail inválido")
      .required("E-mail é obrigatório"),
    password: Yup.string()
      .min(8, "Senha deve possuir pelo menos 8 caracteres")
      .matches(/^(?=.*?[A-Z])(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/, {
        message:
          "Senha deve uma letra maiúscula, um número e um caracter especial",
        excludeEmptyString: true,
      })
      .required("Senha é obrigatório"),
  });

  const handleCadastro = (values) => {
    console.log("valores", values);

    const params = new URLSearchParams();
    params.append("name", values.name);
    params.append("phone", values.phone);
    params.append("email", values.email);
    params.append("password", values.password);

    axios
      .put(
        "https://fiap-reactjs-presencial.herokuapp.com/storeProducts/signup",
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        console.log("response >", response);
        setModalSuccess(true);
        setTimeout(() => {
          setModalSuccess(false);
          window.location.href = "/";
        }, 5000);
      })
      .catch((error) => {
        console.log("error", error);
        setModalError(true);
        setTimeout(() => {
          setModalError(false);
        }, 5000);
      });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Cadastro - 3x Next Commerce</title>
        <meta name="description" content="Cadastro - 3x Next Commerce in PWA" />
      </Head>
      
      <main className={styles.main}>
        <h1 className={styles.title}>Cadastro</h1>
        {modalSuccess && (
          <div className={styles.alertSuccess}>Usuário criado com sucesso!</div>
        )}
        {modalError && (
          <div className={styles.alertError}>ops, algo deu errado</div>
        )}

       

        <Formik
          initialValues={{
            name: "",
            phone: "",
            email: "",
            password: "",
          }}
          onSubmit={(values) => handleCadastro(values)}
          validationSchema={LoginSchema}
        >
          {({
            values,
            handleChange,
            errors,
            isValid,
            handleSubmit,
            setFieldValue,
            dirty,
            touched,
          }) => (
            <Form>
              <div className={styles.card}>
                <div className={styles.field}>
                  <label htmlFor="name">Nome</label>
                  <Field name="name" className={styles.w100} />
                  {errors.name && touched.name ? (
                    <div className={styles.invalid}>{errors.name}</div>
                  ) : null}
                </div>

                <div className={styles.field}>
                  <label htmlFor="phone">Celular</label>
                  <Field name="phone" className={styles.w100} />
                  {errors.phone && touched.phone ? (
                    <div className={styles.invalid}>{errors.phone}</div>
                  ) : null}
                </div>

                <div className={styles.field}>
                  <label htmlFor="email">E-mail</label>
                  <Field name="email" type="email" className={styles.w100} />
                  {errors.email && touched.email ? (
                    <div className={styles.invalid}>{errors.email}</div>
                  ) : null}
                </div>

                <div className={styles.field}>
                  <label htmlFor="senha">Senha</label>
                  <Field
                    name="password"
                    type="password"
                    className={styles.w100}
                  />
                  {errors.password && touched.password ? (
                    <div className={styles.invalid}>{errors.password}</div>
                  ) : null}
                </div>

                <div className={styles.textRight}>
                  <button type="submit" disabled={!isValid || !dirty}>
                    Cadastrar
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
        <Link href="/">
            <a className={styles.card}>
              <p>Voltar</p>
            </a>
        </Link>
      </main>
      <footer className={styles.footer}>
       
          3x Next Commerce
      </footer>
    </div>
  );
}
