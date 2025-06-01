import React from "react";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";

interface User {
  displayName: string;
}
interface LoginProps {
  user: User | null;
}

const Login: React.FC<LoginProps> = ({ user }) => {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      alert("ログインできませんでした: " + (e as Error).message);
      console.error(e);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      alert("ログアウトできませんでした: " + (e as Error).message);
      console.error(e);
    }
  };

  return user ? (
    <div>
      <span>{user.displayName} でログイン中</span>
      <button onClick={handleLogout}>ログアウト</button>
    </div>
  ) : (
    <button onClick={handleLogin}>Googleでログイン</button>
  );
};

export default Login;