import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { useState } from "react";

import Head from "next/head";
import Link from "next/link";
import axios from "axios";

import styles from "./index.module.scss";

export default function Home() {
  const [modalError, setModalError] = useState(false);
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("E-mail inválido")
      .required("E-mail é obrigatório"),
    password: Yup.string()
      .min(
        8,
        "Senha deve possuir pelo menos 8 caracteres uma letra maiúscula e um caracter especial"
      )
      .matches(/^(?=.*?[A-Z])(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/, {
        message: "Senha inválida",
        excludeEmptyString: true,
      })
      .required("Senha é obrigatório"),
  });

  const handleLogin = (values) => {
    console.log("valores", values);
 
    const params = new URLSearchParams();
    params.append("email", values.email);
    params.append("password", values.password);

    axios
      .post(
        "https://fiap-reactjs-presencial.herokuapp.com/storeProducts/login",
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        console.log("response >", response);
        
        localStorage.setItem('login', JSON.stringify(response))


        window.location.href = "/produtos";
        
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
        <title>Login - 3x Next Commerce</title>
        <meta name="description" content="Login - 3x Next Commerce in PWA" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Login</h1>
        {modalError && (
          <div className={styles.alertError}>ops, algo deu errado</div>
        )}
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          onSubmit={(values) => handleLogin(values)}
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
                  <label htmlFor="senha">E-mail</label>
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
                    Entrar
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
        <div className={styles.grid}>
          <p className={styles.description}>Não possui Login</p>
          <Link href="/cadastro">
            <a className={styles.card}>
              <p>Cadastre-se</p>
            </a>
          </Link>
        </div>

    
      </main>

      <footer className={styles.footer}>
       
          3x Next Commerce
      </footer>
    </div>
  );
}
