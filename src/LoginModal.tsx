import { useState } from "react";
import "./LoginModal.css";

interface LoginModalProps {
  onLogin: (u: string, p: string) => void;
  onClose: () => void;
  error?: string;
}

function LoginModal({ onLogin, onClose, error }: LoginModalProps) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Hacker Login</h2>
        {error && <p className="error">{error}</p>}
        <input type="text" placeholder="Username" value={u} onChange={e => setU(e.target.value)} />
        <input type="password" placeholder="Password" value={p} onChange={e => setP(e.target.value)} />
        <div className="modal-actions">
          <button onClick={() => onLogin(u, p)}>Login</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
export default LoginModal;
