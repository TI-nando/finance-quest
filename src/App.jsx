import { useState } from "react";
import usePersistedState from "./hooks/usePersistedState";
import { askOracle } from "./services/aiOracle";
import HealthBar from "./components/HealthBar";
import QuestLog from "./components/QuestLog";
import TypeSelector from "./components/TypeSelector";
import LevelBar from "./components/LevelBar";

function App() {
  // --- ESTADOS (Save Game) ---
  const [saldo, setSaldo] = usePersistedState("@financequest:saldo", 0);
  const [xp, setXp] = usePersistedState("@financequest:xp", 0);
  const [transactions, setTransactions] = usePersistedState(
    "@financequest:transactions",
    []
  );

  // Estado para controlar se é Gasto (expense) ou Depósito (income)
  const [transactionType, setTransactionType] = useState("expense");
  const [meta] = useState(30000); // Definir o maximo de saldo.

  // Estados Temporários (Inputs)
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // --- AÇÃO PRINCIPAL (Adicionar) ---
  const handleGastar = async () => {
    if (!item || !price) return;

    setLoading(true);
    const valorNumber = parseFloat(price);

    // 1. Invoca a IA passando o TIPO da transação
    const respostaIA = await askOracle(item, valorNumber, transactionType);

    const novaTransacao = {
      id: crypto.randomUUID(),
      description: item,
      value: valorNumber,
      type: transactionType,
      category: respostaIA?.category || "Outros",
      date: new Date().toISOString(),
    };

    // Ganho de XP
    let xpGanho = 0;

    if (transactionType === "income") {
      xpGanho = 100; // XP GANHO POR REGISTRAR (MUDA O XP)
    }
    setXp((old) => old + xpGanho);

    // Atualiza o saldo

    if (transactionType === "expense") {
      setSaldo((oldSaldo) => oldSaldo - valorNumber); // Dano (Diminui Saldo)
    } else {
      setSaldo((oldSaldo) => oldSaldo + valorNumber); // Cura (Aumenta Saldo)
    }

    setTransactions((oldTransactions) => [novaTransacao, ...oldTransactions]);

    setFeedback(respostaIA);
    setLoading(false);
    setItem("");
    setPrice("");
  };

  // --- REMOVE TRANSAÇÃO ---
  const handleRemove = (id) => {
    const itemParaRemover = transactions.find((t) => t.id === id);
    if (!itemParaRemover) return;

    // Remove Dinheiro e XP
    if (itemParaRemover.type === "expense") {
      setSaldo((old) => old + itemParaRemover.value); // Devolve o dinheiro
    } else {
      setSaldo((old) => old - itemParaRemover.value); // Retira o dinheiro extra
    }

    setTransactions((old) => old.filter((t) => t.id !== id));
  };

  // --- RESETA TUDO ---
  const handleReset = () => {
    if (confirm("Tem a certeza que quer apagar o Save Game?")) {
      setSaldo(0);
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
            color: "#666",
            fontSize: "0.8rem",
            cursor: "pointer",
            border: "none",
          }}
        >
          🗑️ Reset Save
        </button>
      </header>
      <LevelBar currentXP={xp} /> {/* Barra de XP */}
      <HealthBar current={saldo} max={meta} /> {/* Barra de Saldo */}
      {/* ÁREA DE COMBATE */}
      <div
        style={{
          backgroundColor: "var(--card-bg)",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        {/* SELETOR (Botões Dano vs Cura) */}
        <TypeSelector type={transactionType} setType={setTransactionType} />

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input
            placeholder="Nome do Item (Ex: Salário, Pizza...)"
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
              border: "none",
              cursor: "pointer",
              // Muda a cor do botão dependendo do tipo
              background: loading
                ? "#555"
                : transactionType === "expense"
                ? "var(--hp-critical)"
                : "var(--hp-safe)",
              color: "white",
              fontWeight: "bold",
              transition: "background 0.3s",
            }}
          >
            {loading
              ? "Invocando..."
              : transactionType === "expense"
              ? "Pagar ⚔️"
              : "Curar ❤️"}
          </button>
        </div>
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
          <p style={{ color: "var(--gold)", fontStyle: "italic", margin: 0 }}>
            🧙‍♂️ Oráculo: "{feedback.message}"
          </p>
        </div>
      )}
      {/* HISTÓRICO */}
      <QuestLog transactions={transactions} onDelete={handleRemove} />
    </div>
  );
}

export default App;
