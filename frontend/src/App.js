import React, { useEffect, useState } from "react";

function App() {
  const [medida, setMedida] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://estacaometereologica.onrender.com/medidas", {
      headers: {
        token: process.env.REACT_APP_TOKEN
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar dados");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Ordena por data decrescente (mais recente primeiro)
          const sorted = data.sort((a, b) => new Date(b.data) - new Date(a.data));
          setMedida(sorted[0]);
        } else {
          setMedida(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!medida) return <div>Nenhum dado encontrado.</div>;

  // Extrai os valores dos sensores principais
  const temp = medida.temperatura?.sensor1;
  const umid = medida.umidade?.sensor1;
  const press = medida.pressao?.sensor1;
  const horario = new Date(medida.data).toLocaleString();

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 400, margin: '2rem auto', padding: 24, border: '1px solid #ddd', borderRadius: 8, background: '#f9f9f9' }}>
      <h2>Estação Meteorológica</h2>
      <div><strong>Horário:</strong> {horario}</div>
      <div><strong>Temperatura:</strong> {temp !== null ? temp + ' °C' : 'N/A'}</div>
      <div><strong>Umidade:</strong> {umid !== null ? umid + ' %' : 'N/A'}</div>
      <div><strong>Pressão:</strong> {press !== null ? press + ' hPa' : 'N/A'}</div>
    </div>
  );
}

export default App;
