import React from "react";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";

interface User {
  displayName: string;
}
interface LoginProps {
  user: User | null;
}

const cardStyle: React.CSSProperties = {
  maxWidth: 340,
  margin: "80px auto",
  padding: "32px 24px",
  borderRadius: 16,
  boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
  background: "#fff",
  textAlign: "center",
};

const buttonStyle: React.CSSProperties = {
  minWidth: 220, // 追加: ボタン幅を確保
  padding: "12px 0", // 左右の余白を減らす
  borderRadius: 8,
  border: "1.5px solid #4285F4",
  background: "#fff",
  color: "#4285F4",
  fontWeight: 600,
  fontSize: 16,
  cursor: "pointer",
  marginTop: 16,
  transition: "background 0.2s, color 0.2s",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
};

const logoutButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: "#e53935",
};

const userNameStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 500,
  marginBottom: 16,
  color: "#333",
};

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

  return (
    <div style={cardStyle}>
      {user ? (
        <>
          <div style={userNameStyle}>{user.displayName} でログイン中</div>
          <button style={logoutButtonStyle} onClick={handleLogout}>
            ログアウト
          </button>
        </>
      ) : (
        <>
          <h2 style={{ marginBottom: 24, color: "#222" }}>家計簿アプリ</h2>
          <button style={buttonStyle} onClick={handleLogin}>
            <svg width="20" height="20" viewBox="0 0 48 48">
              <g>
                <path
                  fill="#4285F4"
                  d="M44.5 20H24v8.5h11.7C34.7 33.1 30.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.4-6.4C34.5 5.1 29.5 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.2-4z"
                />
                <path
                  fill="#34A853"
                  d="M6.3 14.7l7 5.1C15.7 17.1 19.5 14 24 14c2.7 0 5.2.9 7.2 2.4l6.4-6.4C34.5 5.1 29.5 3 24 3c-7.7 0-14.2 4.4-17.7 10.7z"
                />
                <path
                  fill="#FBBC05"
                  d="M24 44c5.1 0 9.8-1.7 13.4-4.7l-6.2-5.1C29.5 36.9 27 38 24 38c-6.1 0-10.7-3.9-12.5-9.1l-7 5.4C7.8 39.6 15.3 44 24 44z"
                />
                <path
                  fill="#EA4335"
                  d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.3 5.5-7.7 5.5-4.5 0-8.3-3.6-8.3-8s3.8-8 8.3-8c2.2 0 4.2.8 5.7 2.1l6.4-6.4C38.2 7.6 31.7 4 24 4c-8.7 0-16.2 4.4-20.2 10.7l7 5.1C8.3 17.1 15.7 14 24 14c2.7 0 5.2.9 7.2 2.4l6.4-6.4C34.5 5.1 29.5 3 24 3c-7.7 0-14.2 4.4-17.7 10.7z"
                />
              </g>
            </svg>
            Googleでログイン
          </button>
        </>
      )}
    </div>
  );
};

export default Login;
