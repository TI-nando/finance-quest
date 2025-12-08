import React from "react";
import styles from "./styles.module.css";

const BossCard = ({ boss, currentSavings, onCreateBoss }) => {
  // Se não houver Boss, mostra botão para criar (Summon)
  if (!boss) {
    return (
      <button className={styles.createButton} onClick={onCreateBoss}>
        + Invocar Boss (Criar Meta Financeira)
      </button>
    );
  }

  // Lógica da Barra de Vida do Boss
  // A vida é a meta. O dano é o dinheiro guardado.
  // Vida Restante = Meta - Economias
  const damageDealt = currentSavings;
  const maxHealth = boss.cost;
  const currentHealth = Math.max(0, maxHealth - damageDealt);

  // Porcentagem da barra (Vida Restante)
  const healthPercentage = (currentHealth / maxHealth) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "0.7rem", color: "#ff9999" }}>
            BOSS ATUAL
          </span>
          <span className={styles.bossName}>{boss.name}</span>
        </div>
        <span className={styles.bossIcon}>🐉</span>
      </div>

      <div className={styles.healthBarContainer}>
        <div
          className={styles.healthBarFill}
          style={{ width: `${healthPercentage}%` }}
        />
      </div>

      <div className={styles.stats}>
        <span>
          HP:{" "}
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(currentHealth)}
        </span>
        <span className={styles.damageText}>
          Dano:{" "}
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(damageDealt)}
        </span>
      </div>
    </div>
  );
};

export default BossCard;
