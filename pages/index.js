import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import React from "react";

export default function Home() {
  const [length, setLength] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [location, setLocation] = useState("");
  const [goal, setGoal] = useState("");

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    console.log("hello");
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/generate-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          length: length,
          difficulty: difficulty,
          location: location,
          goal: goal,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result.replaceAll("\n", "<br />"));
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>ai workout</title>
        <link rel="icon" href="/muscles.png" />
      </Head>

      <main className={styles.main}>
        <h3>your ai-generated workout plan! 🏋</h3>
        <form onSubmit={onSubmit}>
          <label>your experience</label>
          <select onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">beginner</option>
            <option value="intermediate">intermediate</option>
            <option value="hard">expert</option>
          </select>

          <label>length</label>
          <select onChange={(e) => setLength(e.target.value)}>
            <option value="quick">short</option>
            <option value="average length">medium</option>
            <option value="long">long</option>
          </select>

          <label>location</label>
          <input
            type="text"
            name="location"
            value={location}
            placeholder="ex. my house/the gym/the park"
            onChange={(e) => setLocation(e.target.value)}
          />

          <label>goal</label>
          <input
            type="text"
            name="goal"
            placeholder="ex. lose weight/strengthen core"
            onChange={(e) => setGoal(e.target.value)}
          />

          <input type="submit" value="create my plan!" />
        </form>
        {loading && (
          <div>
            <center>
              <h4>generating workout plan...</h4>
              <img src="/test.gif" height="120" />
            </center>
          </div>
        )}
        {result && (
          <div
            className={styles.result}
            dangerouslySetInnerHTML={{ __html: result }}
          ></div>
        )}
        <h6>
          made by <a href="https://vishalshenoy.me">vishal shenoy</a>
        </h6>
      </main>
    </div>
  );
}
