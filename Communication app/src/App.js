import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';
import "firebase/database";

firebase.initializeApp({
  apiKey: "",
  authDomain: "localhost:3000",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
});

function App() {
  const [user, setUser] = useState(null);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });

    const messagesRef = firebase.database().ref("messages");
    messagesRef.on("value", (snapshot) => {
      const messages = snapshot.val();
      const messageList = [];
      for (let id in messages) {
        messageList.push({ id, ...messages[id] });
      }
      setMessages(messageList);
    });
  }, []);

  const signIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  };

  const signOut = () => {
    firebase.auth().signOut();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMessageRef = firebase.database().ref("messages").push();
    newMessageRef.set({
      text: text,
      user: user.displayName,
    });
    setText("");
  };

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.displayName}</h1>
          <button onClick={signOut}>Sign Out</button>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
          <ul>
            {messages.map((message) => (
              <li key={message.id}>
                <strong>{message.user}: </strong>
                {message.text}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h1>Sign In</h1>
          <button onClick={signIn}>Sign in with Google</button>
        </div>
      )}
    </div>
  );
}

export default App;
