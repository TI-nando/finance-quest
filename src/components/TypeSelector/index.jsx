import React from "react";
import styles from "./styles.module.css";

const TypeSelector = ({ type, setType }) => {
  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${
          type === "expense" ? styles.activeExpense : ""
        }`}
        onClick={() => setType("expense")}
      >
        ⚔️ Dano (Gasto)
      </button>

      <button
        className={`${styles.button} ${
          type === "income" ? styles.activeIncome : ""
        }`}
        onClick={() => setType("income")}
      >
        ❤️ Cura (Depósito)
      </button>
    </div>
  );
};

export default TypeSelector;
