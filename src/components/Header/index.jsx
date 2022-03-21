import { useRouter } from "next/router";

import { useEffect, useState } from "react";

import styles from "./header.module.scss";
import Link from "next/link";

export function Header(){
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

  },[session, Router, controlHook])

  const Logout = () => {
      console.log('logout')
      localStorage.removeItem('login')
      Router.replace("/");
  }

  if (session) {
    return (
        <div className={styles.header}>
            <div className={styles.esquerda}>
                <Link href="/produtos"><a>Produtos</a></Link>
                <Link href="/favoritos"><a>Favoritos</a></Link>
            </div>
            <div className={styles.direita}>
                <div>{session.data.name}</div>
                <Link href="#"><a onClick={Logout}>Logout</a></Link>
            </div>
        </div>
    )
  }
  return null
}