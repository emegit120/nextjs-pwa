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

export default function Produtos() {
  const [produtos, setProdutos] = useState([])
  const [page, setPage] = useState()
  const [perpage, setPerPage] = useState()
  const [total, setTotal] = useState()

  const Router = useRouter();

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

    if(session){
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


      api.get("https://fiap-reactjs-presencial.herokuapp.com/storeProducts/?page=0&perPage=5&orderDirection=asc")
      .then((response) => {
        console.log("response >", response);
        
        setProdutos(response.data.products)
        setPage(response.data.page)
        setPerPage(response.data.perPage)
        setTotal(response.data.totalItems)
      })
      .catch((error) => {
        console.log("error", error);
  
      });
    }

  },[session, Router, controlHook])

  const productDetail = id => {
    console.log('id clicado >', id)
   // Router.replace(`product/:${id}`);
  }

    return (
      <>
      <Header/>
      <div className={styles.container}>
        <Head>
          <title>3x Next Commerce</title>
          <meta name="description" content="Produtos - 3x Next Commerce in PWA" />
        </Head>

        <main className={styles.main}>

        <h1 className={styles.title}>Produtos</h1>
          
          <div className={styles.table}>
            <div className={styles.tableHead}>
              <div className={styles.tableRowWidth}>Nome</div>
              <div className={styles.tableRowPrice}>Preço</div>
              <div className={styles.tableRowFav}>Favorito</div>
              <div className={styles.tableRowlink}></div>
            </div>
            {produtos.map(({_id,name,price,favorite}, index) =>
                <div className={styles.tableRow} key={index}>
                  <div className={styles.tableRowWidth}>{name}</div>
                  <div className={styles.tableRowPrice}>{price}</div>
                  {!favorite ? <div className={styles.tableRowFav}>não</div> :
                  <div className={styles.tableRowFav}>sim</div>}
                  <div className={styles.tableRowlink}>
                    <Link as={`/produtos/${_id}`} href="/produtos/[id]"><a>detalhes</a></Link>
                  </div>
                </div>
            )}
            <div className={styles.tableFooter}>
                <div className={styles.tableRowWidth}>paginação</div>
            </div>
          </div>
          

        </main>

        <footer className={styles.footer}>
            3x Next Commerce
        </footer>
      </div>


      </>
    )
  

}
/*export const getServerSideProps = async () => {

  console.log('passou')

  let products = []

 

  return {
    props: {
      products:products
    }
  }
}
*/