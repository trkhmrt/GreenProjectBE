import React, { useState } from "react";
import iyzicoLogo from "../assets/SmsLogos/iyzico_ile_ode_colored_horizontal.svg";
import Modal from "./Modal";

export default function SmsModal({ open, onClose, onSuccess, onFailure, orderId, bin, PaReq }) {
  const [sms, setSms] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Burada gerçek API isteğini yapmalısın
      // const response = await axios.post(..., { sms, orderId, bin, PaReq });
      // if (response.data.status === "success") {
      //   onSuccess();
      // } else {
      //   setError("Kod hatalı veya işlem başarısız.");
      //   onFailure && onFailure();
      // }
      // DEMO:
      if (sms === "283126") {
        onSuccess();
      } else {
        setError("Kod hatalı veya işlem başarısız.");
        if (onFailure) onFailure();
      }
    } catch (e) {
      setError("Sunucu hatası!");
      if (onFailure) onFailure();
    }
    setLoading(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit} style={modalStyle}>
        <img src={iyzicoLogo} alt="iyzico logo" style={{ width: 120, margin: "0 auto 16px auto", display: "block" }} />
        <h2 style={{ fontWeight: 600, fontSize: 22, marginBottom: 8, textAlign: "center" }}>SMS Doğrulama</h2>
        <p style={{ color: "#666", fontSize: 15, marginBottom: 18, textAlign: "center" }}>
          Telefonunuza gelen SMS kodunu giriniz
        </p>
        <input
          type="text"
          value={sms}
          onChange={e => setSms(e.target.value)}
          placeholder="SMS Kodu"
          style={inputStyle}
          maxLength={8}
          autoFocus
        />
        <div style={{ fontSize: 13, color: '#888', marginBottom: 8, textAlign: 'center' }}>
          (Test kodu: 283126)
          {orderId && <div>orderId: {orderId}</div>}
          {bin && <div>bin: {bin}</div>}
          {PaReq && <div>PaReq: {PaReq}</div>}
        </div>
        <button
          type="submit"
          disabled={loading || !sms}
          style={buttonStyle}
        >
          {loading ? "Gönderiliyor..." : "Doğrula"}
        </button>
        {error && <div style={{ color: "#e53935", marginTop: 12, textAlign: "center" }}>{error}</div>}
      </form>
    </Modal>
  );
}

const modalStyle = {
  minWidth: 280,
  maxWidth: 340,
  padding: "32px 24px 24px 24px",
  borderRadius: 16,
  background: "#fff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  fontSize: "1.1rem",
  borderRadius: 8,
  border: "1px solid #ccc",
  marginBottom: 16,
  outline: "none"
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  fontSize: "1.1rem",
  borderRadius: 8,
  background: "#0A2C5A",
  color: "#fff",
  border: "none",
  cursor: "pointer"
};