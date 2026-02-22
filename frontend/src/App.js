
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function App() {
  // Estado para medida mais recente
  const [medida, setMedida] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para medidas do dia e seleção de dias atrás
  const [medidasDia, setMedidasDia] = useState([]);
  const [loadingDia, setLoadingDia] = useState(true);
  const [errorDia, setErrorDia] = useState(null);
  const [diasAtras, setDiasAtras] = useState(0); // 0 = hoje, 1 = ontem, ...

  // GET /medidasLatest
  useEffect(() => {
    fetch("https://estacaometereologica.onrender.com/medidasLatest", {
      headers: {
        token: process.env.REACT_APP_TOKEN
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar dados");
        return res.json();
      })
      .then((data) => {
        setMedida(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // GET /medidasByDay?data=YYYY-MM-DD (refaz consulta ao mudar diasAtras)
  useEffect(() => {
    setLoadingDia(true);
    setErrorDia(null);
    const hoje = new Date();
    const dataConsulta = new Date(hoje);
    dataConsulta.setDate(hoje.getDate() - diasAtras);
    const yyyy = dataConsulta.getFullYear();
    const mm = String(dataConsulta.getMonth() + 1).padStart(2, "0");
    const dd = String(dataConsulta.getDate()).padStart(2, "0");
    const dataStr = `${yyyy}-${mm}-${dd}`;

    fetch(`https://estacaometereologica.onrender.com/medidasByDay?data=${dataStr}`, {
      headers: {
        token: process.env.REACT_APP_TOKEN
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar dados do dia");
        return res.json();
      })
      .then((data) => {
        setMedidasDia(data);
        setLoadingDia(false);
      })
      .catch((err) => {
        setErrorDia(err.message);
        setLoadingDia(false);
      });
  }, [diasAtras]);

  // ...existing code...

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!medida) return <div>Nenhum dado encontrado.</div>;

  const temp = medida.temperatura?.sensor1;
  const umid = medida.umidade?.sensor1;
  const press = medida.pressao?.sensor1;
  const horario = new Date(medida.data).toLocaleString();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#23272f',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, sans-serif',
      gap: 32,
    }}>
      {/* Quadrado superior */}
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
            {/* Temperatura */}
            <div style={{
              flex: 1,
              background: '#23272f',
              borderRadius: 8,
              padding: '16px 12px',
              textAlign: 'center',
            }}>
              <span style={{ color: '#ff6b6b', fontWeight: 600, fontSize: 16 }}>Temperatura</span>
              <div style={{ fontSize: 22, fontWeight: 700, marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span>{temp !== null ? temp + ' °C' : 'N/A'}</span>
                {typeof medida.temperatura?.sensor2 === 'number' && (
                  <span style={{ fontSize: 18, fontWeight: 700, color: '#4ecdc4', marginTop: 2 }}>{medida.temperatura.sensor2} °C</span>
                )}
              </div>
            </div>
            {/* Umidade */}
            <div style={{
              flex: 1,
              background: '#23272f',
              borderRadius: 8,
              padding: '16px 12px',
              textAlign: 'center',
            }}>
              <span style={{ color: '#4ecdc4', fontWeight: 600, fontSize: 16 }}>Umidade</span>
              <div style={{ fontSize: 22, fontWeight: 700, marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span>{umid !== null ? umid + ' %' : 'N/A'}</span>
                {typeof medida.umidade?.sensor2 === 'number' && (
                  <span style={{ fontSize: 18, fontWeight: 700, color: '#ff6b6b', marginTop: 2 }}>{medida.umidade.sensor2} %</span>
                )}
              </div>
            </div>
            {/* Pressão */}
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
      {/* Seletor de dia global */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 24, marginTop: 24 }}>
        <span style={{ marginRight: 12, color: '#aaa' }}>Dia:</span>
        <select
          value={diasAtras}
          onChange={e => setDiasAtras(Number(e.target.value))}
          style={{
            background: '#23272f', color: '#fff', border: '1px solid #444', borderRadius: 6, padding: '4px 12px', fontSize: 16
          }}
        >
          {new Array(7).fill(null).map((_, idx) => (
            <option key={`dia-option-${idx}`} value={idx}>{idx + 1}</option>
          ))}
        </select>
        <span style={{ marginLeft: 8, color: '#aaa', fontSize: 14 }}>
          {(() => {
            const d = new Date();
            d.setDate(d.getDate() - diasAtras);
            return `(${d.toLocaleDateString()})`;
          })()}
        </span>
      </div>

      {/* Quadrados dos gráficos */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
        {/* Temperatura */}
        <div style={{
          background: '#2d323c',
          borderRadius: 16,
          boxShadow: '0 4px 24px #0006',
          padding: '40px 32px',
          minWidth: 350,
          maxWidth: 420,
          color: '#f3f3f3',
        }}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: 8,
            fontWeight: 600,
            fontSize: 22,
            color: '#4ecdc4',
          }}>Temperatura do Dia</h2>
          {/* Temperatura máxima e mínima do dia */}
          {medidasDia && medidasDia.length > 0 && (() => {
            const temps = medidasDia.map(m => m.temperatura?.sensor1).filter(t => typeof t === 'number');
            if (temps.length === 0) return null;
            const max = Math.max(...temps);
            const min = Math.min(...temps);
            return (
              <div style={{ textAlign: 'center', marginBottom: 8, color: '#ffd166', fontWeight: 500, fontSize: 16 }}>
                Máx: <span style={{color:'#ff6b6b'}}>{max}°C</span> &nbsp;|&nbsp; Mín: <span style={{color:'#4ecdc4'}}>{min}°C</span>
              </div>
            );
          })()}
          {loadingDia ? (
            <div>Carregando gráfico...</div>
          ) : errorDia ? (
            <div>Erro: {errorDia}</div>
          ) : (() => {
            // Gráfico de temperatura com sensor1 e sensor2
            let data = null;
            if (medidasDia && medidasDia.length > 0) {
              const medidasAsc = [...medidasDia].reverse();
              const step = Math.floor(medidasAsc.length / 12);
              const pontos = [];
              for (let i = 1; i <= 12; i++) {
                const idx = i * step - 1;
                if (medidasAsc[idx]) {
                  pontos.push(medidasAsc[idx]);
                }
              }
              // Sensor 2 só se houver pelo menos um valor válido
              const hasSensor2 = pontos.some(m => typeof m.temperatura?.sensor2 === 'number');
              data = {
                labels: pontos.map(m => new Date(m.data).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })),
                datasets: [
                  {
                    label: "Sensor 1 (°C)",
                    data: pontos.map(m => m.temperatura?.sensor1 ?? null),
                    fill: false,
                    borderColor: "#ff6b6b",
                    backgroundColor: "#ffb347",
                    tension: 0.3,
                  },
                  ...(hasSensor2 ? [{
                    label: "Sensor 2 (°C)",
                    data: pontos.map(m => typeof m.temperatura?.sensor2 === 'number' ? m.temperatura.sensor2 : null),
                    fill: false,
                    borderColor: "#4ecdc4",
                    backgroundColor: "#b2f7ef",
                    tension: 0.3,
                  }] : [])
                ],
              };
            }
            return data ? (
              <Line
                data={data}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: true },
                    tooltip: { enabled: true },
                  },
                  scales: {
                    x: { grid: { color: "#444" }, ticks: { color: "#ccc" } },
                    y: { grid: { color: "#444" }, ticks: { color: "#ccc" } },
                  },
                }}
                height={220}
              />
            ) : (
              <div>Nenhum dado para o gráfico.</div>
            );
          })()}
        </div>

        {/* Umidade */}
        <div style={{
          background: '#2d323c',
          borderRadius: 16,
          boxShadow: '0 4px 24px #0006',
          padding: '40px 32px',
          minWidth: 350,
          maxWidth: 420,
          color: '#f3f3f3',
        }}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: 8,
            fontWeight: 600,
            fontSize: 22,
            color: '#4ecdc4',
          }}>Umidade do Dia</h2>
          {/* Umidade máxima e mínima do dia */}
          {medidasDia && medidasDia.length > 0 && (() => {
            const umids = medidasDia.map(m => m.umidade?.sensor1).filter(u => typeof u === 'number');
            if (umids.length === 0) return null;
            const max = Math.max(...umids);
            const min = Math.min(...umids);
            return (
              <div style={{ textAlign: 'center', marginBottom: 8, color: '#ffd166', fontWeight: 500, fontSize: 16 }}>
                Máx: <span style={{color:'#ff6b6b'}}>{max}%</span> &nbsp;|&nbsp; Mín: <span style={{color:'#4ecdc4'}}>{min}%</span>
              </div>
            );
          })()}
          {loadingDia ? (
            <div>Carregando gráfico...</div>
          ) : errorDia ? (
            <div>Erro: {errorDia}</div>
          ) : (() => {
            // Gráfico de umidade com sensor1 e sensor2
            let data = null;
            if (medidasDia && medidasDia.length > 0) {
              const medidasAsc = [...medidasDia].reverse();
              const step = Math.floor(medidasAsc.length / 12);
              const pontos = [];
              for (let i = 1; i <= 12; i++) {
                const idx = i * step - 1;
                if (medidasAsc[idx]) {
                  pontos.push(medidasAsc[idx]);
                }
              }
              const hasSensor2 = pontos.some(m => typeof m.umidade?.sensor2 === 'number');
              data = {
                labels: pontos.map(m => new Date(m.data).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })),
                datasets: [
                  {
                    label: "Sensor 1 (%)",
                    data: pontos.map(m => m.umidade?.sensor1 ?? null),
                    fill: false,
                    borderColor: "#4ecdc4",
                    backgroundColor: "#b2f7ef",
                    tension: 0.3,
                  },
                  ...(hasSensor2 ? [{
                    label: "Sensor 2 (%)",
                    data: pontos.map(m => typeof m.umidade?.sensor2 === 'number' ? m.umidade.sensor2 : null),
                    fill: false,
                    borderColor: "#ff6b6b",
                    backgroundColor: "#ffb347",
                    tension: 0.3,
                  }] : [])
                ],
              };
            }
            return data ? (
              <Line
                data={data}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: true },
                    tooltip: { enabled: true },
                  },
                  scales: {
                    x: { grid: { color: "#444" }, ticks: { color: "#ccc" } },
                    y: { grid: { color: "#444" }, ticks: { color: "#ccc" } },
                  },
                }}
                height={220}
              />
            ) : (
              <div>Nenhum dado para o gráfico.</div>
            );
          })()}
        </div>

        {/* Pressão */}
        <div style={{
          background: '#2d323c',
          borderRadius: 16,
          boxShadow: '0 4px 24px #0006',
          padding: '40px 32px',
          minWidth: 350,
          maxWidth: 420,
          color: '#f3f3f3',
        }}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: 8,
            fontWeight: 600,
            fontSize: 22,
            color: '#4ecdc4',
          }}>Pressão do Dia</h2>
          {/* Pressão máxima e mínima do dia */}
          {medidasDia && medidasDia.length > 0 && (() => {
            const press = medidasDia.map(m => m.pressao?.sensor1).filter(p => typeof p === 'number');
            if (press.length === 0) return null;
            const max = Math.max(...press);
            const min = Math.min(...press);
            return (
              <div style={{ textAlign: 'center', marginBottom: 8, color: '#ffd166', fontWeight: 500, fontSize: 16 }}>
                Máx: <span style={{color:'#ff6b6b'}}>{max} hPa</span> &nbsp;|&nbsp; Mín: <span style={{color:'#4ecdc4'}}>{min} hPa</span>
              </div>
            );
          })()}
          {(() => {
            if (loadingDia) return <div>Carregando gráfico...</div>;
            if (errorDia) return <div>Erro: {errorDia}</div>;
            // Gráfico de pressão
            let data = null;
            if (medidasDia && medidasDia.length > 0) {
              const medidasAsc = [...medidasDia].reverse();
              const step = Math.floor(medidasAsc.length / 12);
              const pontos = [];
              for (let i = 1; i <= 12; i++) {
                const idx = i * step - 1;
                if (medidasAsc[idx]) {
                  pontos.push(medidasAsc[idx]);
                }
              }
              data = {
                labels: pontos.map(m => new Date(m.data).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })),
                datasets: [
                  {
                    label: "Pressão (hPa)",
                    data: pontos.map(m => m.pressao?.sensor1 ?? null),
                    fill: false,
                    borderColor: "#ffd166",
                    backgroundColor: "#ffe29a",
                    tension: 0.3,
                  },
                ],
              };
            }
            if (data) {
              return (
                <Line
                  data={data}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                      tooltip: { enabled: true },
                    },
                    scales: {
                      x: { grid: { color: "#444" }, ticks: { color: "#ccc" } },
                      y: { grid: { color: "#444" }, ticks: { color: "#ccc" } },
                    },
                  }}
                  height={220}
                />
              );
            } else {
              return <div>Nenhum dado para o gráfico.</div>;
            }
          })()}
        </div>
      </div>
    </div>
  );
}

export default App;
