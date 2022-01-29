import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  query,
  onSnapshot,
} from "firebase/firestore";

import { getAuth, signInAnonymously } from "firebase/auth";
import "./App.css";

const citiesList = [
  {
    name: "Berlin",
    points: 1,
    icon: "🍹",
  },
  {
    name: "Munich",
    points: 3,
    icon: "🍺",
  },
  {
    name: "Frankfurt",
    points: 2,
    icon: "🗽",
  },
  {
    name: "Düsseldorf",
    points: 3,
    icon: "🗼",
  },
];

function firebaseInit() {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBjupzOWoMUDI1bwd7rTwOXyHmRbcqRGsM",
    authDomain: "game2-a5b6a.firebaseapp.com",
    databaseURL: "https://game2-a5b6a-default-rtdb.firebaseio.com",
    projectId: "game2-a5b6a",
    storageBucket: "game2-a5b6a.appspot.com",
    messagingSenderId: "326352877217",
    appId: "1:326352877217:web:a55e632d95e9a60c9ca2e0",
  };

  // Initialize Firebase
  initializeApp(firebaseConfig);
}

function App() {
  firebaseInit();

  // initialize firebase functions
  const auth = getAuth();
  const db = getFirestore();

  const [uid, setUid] = useState(null);
  const [cities, setCities] = useState([]);
  const [munich, setMunich] = useState(0);
  const [berlin, setBerlin] = useState(0);
  const [frankfurt, setFrankfurt] = useState(0);
  const [duesseldorf, setDuesseldorf] = useState(0);

  useEffect(() => {
    // sign in
    signInAnonymously(auth).then((user) => {
      setUid(user.user.uid);
    });

    //setup game
    const q = query(collection(db, "game"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const temp = [];
      querySnapshot.forEach((doc) => {
        temp.push(doc.data());
      });
      setCities(temp);
      console.log("## temp", temp);
      // console.log("game ", cities.join(", "));
    });
  }, []);

  useEffect(() => {
    console.log("munich ");
    setBerlin(
      cities.filter((x) => {
        return x.i === 0;
      }).length
    );
    setMunich(
      cities.filter((x) => {
        return x.i === 1;
      }).length
    );
    setFrankfurt(
      cities.filter((x) => {
        return x.i === 2;
      }).length
    );
    setDuesseldorf(
      cities.filter((x) => {
        return x.i === 3;
      }).length
    );
  }, [cities]);

  async function makeMove(i) {
    await addDoc(collection(db, "game"), {
      uid,
      time: serverTimestamp(),
      side: 1,
      i: i,
    });
  }

  return (
    <div className="App">
      <h1>Hello, {uid}</h1>
      <div>
        munich {munich}
        {citiesList.map((city, index) => (
          <div key={index} onClick={() => makeMove(index)}>
            {city.icon} {city.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
