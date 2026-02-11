
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/usuarios")
      .then(res => setUsuarios(res.data));
  }, []);

  return (
    <div>
      <h1>Usuários</h1>
      <ul>
        {usuarios.map(u => (
          <li key={u.id}>{u.nome} - {u.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
