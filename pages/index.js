import Head from "next/head";
import { useState } from "react";
import Image from "next/image";
import styles from "./index.module.css";
import 'tailwindcss/tailwind.css'

export default function Home() {

  const [questionInput, setQuestionInput] = useState("");
  const [maxTokensInput, setMaxTokensInput] = useState(30);
  const [temperatureInput, setTemperatureInput] = useState(0);
  
  const [questionResult, setQuestionResult] = useState();
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/ask_ted", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: questionInput, maxTokens:maxTokensInput, temperature: temperatureInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setQuestionResult(questionInput);
      setQuestionInput("");
      //setMaxTokensInput("");
      //setTemperatureInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (    <div>
      <Head>
        <title>Life Advice From Uncle Ted</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
        <meta name="msapplication-TileColor" content="#da532c"/>
        <meta name="theme-color" content="#ffffff"/>
      </Head>

      <main className={styles.main}>
        <h2 className={`font-semibold text-2xl`}>Ask Uncle Ted</h2>
        <Image src="/uncle_ted.jpg" className={`logo-image`} height={180} width={320} alt="Uncle Ted" style={{marginBottom:'2rem'}}/>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="question"
            placeholder="Question"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
          />
          <input
            hidden={true}
            type="number"
            name="maxTokens"
            placeholder="Max. Tokens"
            min={1} 
            max={50}
            step={1}
            value={maxTokensInput}
            onChange={(e) => setMaxTokensInput(e.target.value)}
          />
          <input
            hidden={true}
            type="number"
            name="temperature"
            min={0}
            max={1}
            step={0.1}
            placeholder="Temperature "
            value={temperatureInput}
            onChange={(e) => setTemperatureInput(e.target.value)}
          />


          <input type="submit" value="What Would Ted Do?" />
        </form>
        {questionResult && <div className={`text-xl mt-16 mb-8 px-4`}><span className="font-semibold">Q:</span> {questionResult}</div>}
        {result && <div className={`text-lg mt-4`}>
            <blockquote className={`px-4`}>
            <svg aria-hidden="true" class="w-10 h-10 text-gray-400 dark:text-gray-600 " viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" fill="currentColor"/></svg>
            {result}
              </blockquote>
        </div>}
      </main>
    </div>
  );
}
