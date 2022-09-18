import Head from "next/head";
import Header from "../components/Header";
import Image from "next/image";
import BankFunction from "../components/BankFunction";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className="background">
      <Head>
        <title>Bank App</title>
        <meta name="description" content="My bank nextsj new version" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Header />
      <BankFunction />
      <footer className="">wöö</footer>
    </div>
  );
}
