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
    <div style={{
      minHeight: '100vh',
      background: '#23272f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, sans-serif',
    }}>
      <div style={{
        background: '#2d323c',
        borderRadius: 16,
        boxShadow: '0 4px 24px #0006',
        padding: '40px 32px',
        minWidth: 350,
        maxWidth: 420,
        color: '#f3f3f3',
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: 32,
          fontWeight: 700,
          letterSpacing: 1,
          fontSize: 28,
          color: '#ffb347',
        }}>Estação Meteorológica</h1>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}>
          <div style={{
            background: '#23272f',
            borderRadius: 8,
            padding: '16px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 18,
          }}>
            <span style={{ color: '#aaa' }}>Horário</span>
            <span style={{ fontWeight: 500 }}>{horario}</span>
          </div>
          <div style={{
            display: 'flex',
            gap: 16,
            justifyContent: 'space-between',
          }}>
            <div style={{
              flex: 1,
              background: '#23272f',
              borderRadius: 8,
              padding: '16px 12px',
              textAlign: 'center',
            }}>
              <span style={{ color: '#ff6b6b', fontWeight: 600, fontSize: 16 }}>Temperatura</span>
              <div style={{ fontSize: 22, fontWeight: 700, marginTop: 8 }}>{temp !== null ? temp + ' °C' : 'N/A'}</div>
            </div>
            <div style={{
              flex: 1,
              background: '#23272f',
              borderRadius: 8,
              padding: '16px 12px',
              textAlign: 'center',
            }}>
              <span style={{ color: '#4ecdc4', fontWeight: 600, fontSize: 16 }}>Umidade</span>
              <div style={{ fontSize: 22, fontWeight: 700, marginTop: 8 }}>{umid !== null ? umid + ' %' : 'N/A'}</div>
            </div>
            <div style={{
              flex: 1,
              background: '#23272f',
              borderRadius: 8,
              padding: '16px 12px',
              textAlign: 'center',
            }}>
              <span style={{ color: '#ffd166', fontWeight: 600, fontSize: 16 }}>Pressão</span>
              <div style={{ fontSize: 22, fontWeight: 700, marginTop: 8 }}>{press !== null ? press + ' hPa' : 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
