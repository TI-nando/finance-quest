import { useState } from "react"; // useState para coisas temporárias (inputs)
import usePersistedState from "./hooks/usePersistedState"; // NOSSO HOOK DE SAVE
import { askOracle } from "./services/aiOracle";
import HealthBar from "./components/HealthBar";
import QuestLog from "./components/QuestLog"; // Importamos a lista

function App() {
  // --- ESTADOS COM SAVE GAME (Persistência) ---
  // Agora usamos usePersistedState em vez de useState
  const [saldo, setSaldo] = usePersistedState("@financequest:saldo", 2500);
  const [transactions, setTransactions] = usePersistedState(
    "@financequest:transactions",
    []
  );

  const [meta] = useState(3000); // Meta fixa por enquanto

  // Estados voláteis (Inputs não precisam ser salvos)
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleGastar = async () => {
    if (!item || !price) return;

    setLoading(true);
    const valorGasto = parseFloat(price);

    // 1. Invoca a IA
    const respostaIA = await askOracle(item, valorGasto);

    // 2. Cria o objeto da transação
    const novaTransacao = {
      description: item,
      value: valorGasto,
      category: respostaIA?.category || "Outros", // Pega a categoria que a IA decidiu
      date: new Date().toISOString(),
    };

    // 3. Atualiza os estados (O Hook salva no localStorage sozinho)
    setSaldo((oldSaldo) => oldSaldo - valorGasto);
    setTransactions((oldTransactions) => [novaTransacao, ...oldTransactions]); // Adiciona no topo da lista

    setFeedback(respostaIA);
    setLoading(false);
    setItem("");
    setPrice("");
  };

  // Função de Reset (Caso você queira começar o jogo do zero)
  const handleReset = () => {
    if (confirm("Tem certeza que quer deletar seu Save?")) {
      setSaldo(2500);
      setTransactions([]);
      setFeedback(null);
    }
  };

  return (
    <div className="container">
      <header
        style={{
          marginBottom: "30px",
          textAlign: "center",
          position: "relative",
        }}
      >
        <h1 style={{ fontSize: "2rem", color: "var(--gold)" }}>
          FINANCE QUEST ⚔️
        </h1>
        <button
          onClick={handleReset}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            background: "transparent",
            color: "#555",
            fontSize: "0.8rem",
          }}
        >
          🗑️ Reset Save
        </button>
      </header>

      <HealthBar current={saldo} max={meta} />

      {/* ÁREA DE INPUTS (Manteve igual) */}
      <div
        style={{
          backgroundColor: "var(--card-bg)",
          padding: "20px",
          borderRadius: "8px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <input
          placeholder="Nome do Item"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "4px",
            border: "none",
            background: "#121214",
            color: "white",
          }}
        />
        <input
          type="number"
          placeholder="R$"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{
            width: "100px",
            padding: "12px",
            borderRadius: "4px",
            border: "none",
            background: "#121214",
            color: "white",
          }}
        />
        <button
          onClick={handleGastar}
          disabled={loading}
          style={{
            padding: "0 24px",
            borderRadius: "4px",
            background: loading ? "#555" : "var(--mana-blue)",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {loading ? "⚔️" : "Lançar"}
        </button>
      </div>

      {/* FEEDBACK IA */}
      {feedback && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            background: "rgba(255, 215, 0, 0.1)",
            border: "1px solid var(--gold)",
            borderRadius: "6px",
          }}
        >
          <p style={{ color: "var(--gold)", fontStyle: "italic" }}>
            🧙‍♂️ Oráculo: "{feedback.message}"
          </p>
        </div>
      )}

      {/* NOVO: HISTÓRICO DE GASTOS */}
      <QuestLog transactions={transactions} />
    </div>
  );
}

export default App;
