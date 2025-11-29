import React from "react";

// Recebemos 'current' (Saldo Atual) e 'max' (Salário/Meta)
const HealthBar = ({ current, max }) => {
  // 1. Lógica de Porcentagem (Matemática de Dano)
  // Se max for 0, evita divisão por zero (Bug que trava jogo)
  const percentage = max > 0 ? (current / max) * 100 : 0;

  // Trava a barra entre 0% e 100% (pra não vazar da tela se tiver dívida)
  const width = Math.min(Math.max(percentage, 0), 100);

  // 2. Lógica de Cores (Mudança de Fase)
  let barColor = "var(--hp-safe)"; // Começa Verde
  if (percentage < 50) barColor = "var(--hp-warning)"; // Fica Laranja
  if (percentage < 20) barColor = "var(--hp-critical)"; // Fica Vermelha

  return (
    <div style={{ marginBottom: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <span style={{ fontWeight: "bold" }}>HP Financeiro</span>
        <span>
          {/* Formatador de Moeda (Transforma 1000 em R$ 1.000,00) */}
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(current)}
          {" / "}
          <span style={{ color: "var(--text-secondary)" }}>
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(max)}
          </span>
        </span>
      </div>

      {/* A Barra Cinza (Fundo) */}
      <div
        style={{
          width: "100%",
          height: "24px",
          backgroundColor: "#323238",
          borderRadius: "12px",
          overflow: "hidden", // Corta o que passar da borda
          border: "1px solid #444",
        }}
      >
        {/* A Barra Colorida (Sangue/Vida) */}
        <div
          style={{
            width: `${width}%`,
            height: "100%",
            backgroundColor: barColor,
            transition: "width 0.5s ease-in-out, background-color 0.5s", // Animação suave
            boxShadow: `0 0 10px ${barColor}`, // Brilho neon (Gamer Style)
          }}
        />
      </div>
    </div>
  );
};

export default HealthBar;
