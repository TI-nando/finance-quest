import React from "react";
import styles from "./styles.module.css";
import { Trash2 } from "lucide-react";

// Recebemos a função onDelete aqui
const QuestLog = ({ transactions, onDelete }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📜 Pergaminho de Gastos</h2>

      <div className={styles.list}>
        {/* ... código do empty state ... */}

        {transactions.map((transacao) => (
          <div
            key={transacao.id ?? `${transacao.description}-${transacao.date}`}
            className={styles.questItem}
          >
            {/* Informações (Esquerda) */}
            <div className={styles.itemInfo}>
              <h4>{transacao.description}</h4>
              <p>
                {transacao.category} •{" "}
                {new Date(transacao.date).toLocaleDateString("pt-BR")}
              </p>
            </div>

            {/* Valor e Botão (Direita) */}
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <span className={styles.itemValue}>
                -{" "}
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(transacao.value)}
              </span>

              {/* O BOTÃO DELETAR */}
              <button
                onClick={() => onDelete(transacao.id)}
                className={styles.deleteBtn}
                title="Desfazer gasto"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestLog;
