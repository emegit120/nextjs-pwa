import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";
import axios from "axios";

import styles from "./produtos.module.scss";
import { Header } from "../../components/Header";

export default function Produto() {

    const Router = useRouter();
  const { id } = Router.query

    console.log('id', id)

  const [name, setName] = useState()
  const [price, setPrice] = useState()
  const [favorite, setFavorite] = useState()
  const [stores, setStores] = useState([])


 

  const [session, setSession] = useState()
  const [controlHook, setControlHook] = useState(false)

  useEffect(()=>{
    if(!session && !controlHook){
      setControlHook(true)
      setSession(JSON.parse(localStorage.getItem('login')))
    }

    if (!session && controlHook) {
      Router.replace("/");
      setControlHook(false)
    }

    console.log('id > ', id)

    if(session && id){
      const api = axios.create({
        baseURL: process.env.REACT_APP_API,
      });
      

      api.interceptors.request.use(
        (config) => {
          config.headers.Authorization = `Bearer ${session.data.token}`;
          return config;
        },
        (error) => Promise.reject(error)
      );
    
      api.interceptors.response.use(
        function (response) {
          return response;
        },
        function (error) {
          console.log("error> ", error);
          if (500 === error.response.status) {
            localStorage.removeItem("login");
            window.location.href = "/";
          }else if (401 === error.response.status) {
            localStorage.removeItem("login");
            window.location.href = "/";
          } else {
            return Promise.reject(error);
          }
        }
      );


      api.get(`https://fiap-reactjs-presencial.herokuapp.com/storeProducts/product/${id}`)
      .then((response) => {
        console.log("response >", response);
        setName(response.data.product.name)
        setPrice(response.data.product.price)
        setStores(response.data.product.stores)
        setFavorite(response.data.product.favorite)
      })
      .catch((error) => {
        console.log("error", error);
  
      });
    }

  },[session, Router, controlHook])

 

    return (
      <>
      <Header/>
      <div className={styles.container}>
        <Head>
          <title>3x Next Commerce</title>
          <meta name="description" content="Produtos - 3x Next Commerce in PWA" />
        </Head>

        <main className={styles.main}>

        <h1 className={styles.title}>Produto Detalhe</h1>
          
         <div className={styles.name}>
            {name}
         </div>
         <div className={styles.price}>
            {price}
         </div>
         <div className={styles.favorite}>
         {!favorite ? <div>não</div> :
                  <div>sim</div>}
         </div>
         <div className={styles.lojasTitle}>Lojas</div>
         <div className={styles.lojas}>
             
            {stores && stores.map(({_id,address,latitude,longitude,name}, index) =>
                <div className={styles.store} key={index}>
                    <div className={styles.titleStore}>{name}</div>
                    <div className={styles.addressStore} >{address}</div>
                    <div>{latitude}</div>
                    <div>{longitude}</div>
                </div>
            )}
         </div>
         <Link href="/produtos">
            <a className={styles.card}>
              <p>Voltar</p>
            </a>
        </Link>

        </main>

        <footer className={styles.footer}>
            3x Next Commerce
        </footer>
      </div>


      </>
    )
  

}