import React from "react";

const QuestLog = ({ transactions }) => {
  return (
    <div style={{ marginTop: "20px" }}>
      <h2
        style={{
          color: "var(--text-secondary)",
          fontSize: "1.2rem",
          marginBottom: "10px",
        }}
      >
        📜 Pergaminho de Gastos
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {transactions.length === 0 && (
          <p style={{ color: "#555", fontStyle: "italic" }}>
            Nenhuma aventura registrada ainda...
          </p>
        )}

        {transactions.map((transacao, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#202024",
              padding: "12px",
              borderRadius: "6px",
              borderLeft: "4px solid var(--hp-critical)", // Marca vermelha de dano
            }}
          >
            <div>
              <strong
                style={{ display: "block", color: "var(--text-primary)" }}
              >
                {transacao.description}
              </strong>
              <small
                style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}
              >
                {transacao.category || "Desconhecido"}
              </small>
            </div>

            <span style={{ color: "var(--hp-critical)", fontWeight: "bold" }}>
              -{" "}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(transacao.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestLog;
