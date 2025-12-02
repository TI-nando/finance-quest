import React, { useMemo } from "react";
import styles from "./styles.module.css";

const LevelBar = ({ currentXP }) => {
  // Tabela de Níveis (XP necessário para cada nível)
  const LEVEL_THRESHOLDS = [0, 1000, 2500, 5000, 10000, 20000, 50000];

  const levelInfo = useMemo(() => {
    let level = 1;
    let nextLevelXP = 1000;
    let currentLevelXP = 0;

    // Descobre o nível atual
    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
      if (currentXP >= LEVEL_THRESHOLDS[i]) {
        level = i + 1;
        currentLevelXP = LEVEL_THRESHOLDS[i];
        nextLevelXP = LEVEL_THRESHOLDS[i + 1] || Infinity;
      } else {
        break;
      }
    }

    // Calcula a porcentagem da barra
    const xpNeededForNext = nextLevelXP - currentLevelXP;
    const xpProgressInLevel = currentXP - currentLevelXP;
    const percentage = Math.min(
      (xpProgressInLevel / xpNeededForNext) * 100,
      100
    );

    return {
      level,
      nextLevelXP,
      percentage,
      xpProgressInLevel,
      xpNeededForNext,
    };
  }, [currentXP]);

  return (
    <div className={styles.container}>
      <div className={styles.badge}>
        <span className={styles.levelLabel}>LVL</span>
        <span className={styles.levelValue}>{levelInfo.level}</span>
      </div>

      <div className={styles.progressContainer}>
        <div className={styles.stats}>
          <span>Rank: {getLevelTitle(levelInfo.level)}</span>
          <span>
            XP: {parseInt(levelInfo.xpProgressInLevel)} /{" "}
            {levelInfo.xpNeededForNext}
          </span>
        </div>

        <div className={styles.barBg}>
          <div
            className={styles.barFill}
            style={{ width: `${levelInfo.percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

function getLevelTitle(level) {
  if (level === 1) return "Novato";
  if (level === 2) return "Aprendiz";
  if (level === 3) return "Aventureiro";
  if (level === 4) return "Veterano";
  if (level === 5) return "Mestre";
  if (level >= 6) return "Lenda";
  return "Desconhecido";
}

export default LevelBar;
