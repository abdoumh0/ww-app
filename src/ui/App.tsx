import reactLogo from "./assets/react.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [notifications, setNotifications] = useState<
    {
      message: string;
      title: string;
      type: string;
    }[]
  >([]);

  useEffect(() => {
    const unsub = window.electronAPI.on("notification:new", (data) => {
      console.log(data);
      setNotifications((prev) => {
        return [...prev, data];
      });
    });

    return unsub;
  }, []);

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={async () => {
            const s = await window.electronAPI.invoke("purchase:create", {
              name: "first",
              items: [],
            });

            console.log(s);
          }}
        >
          Invoke
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      {notifications.map((notification, index) => {
        return (
          <div key={index}>
            <div>{notification.title}</div>
            <div>{notification.message}</div>
          </div>
        );
      })}
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
