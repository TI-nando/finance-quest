import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_AI_API_KEY;

if (!API_KEY) {
  console.error("ERRO CRÍTICO: Chave da API não encontrada no .env");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const askOracle = async (description, value, type) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Atue como um Mago Sábio de RPG Medieval.
      O jogador registrou uma transação do tipo: "${
        type === "income" ? "GANHO DE OURO (Cura)" : "GASTO DE OURO (Dano)"
      }".
      Descrição: "${description}"
      Valor: R$ ${value}

      Sua missão:
      1. Se for GASTO: Classifique (Taverna, Equipamento, Taxa) e dê uma bronca sarcástica ou alerta.
      2. Se for GANHO: Classifique (Saque de Masmorra, Recompensa de Quest, Salário do Rei) e parabenize o jogador.
      
      Responda APENAS um JSON:
      {
        "category": "Classificação RPG",
        "message": "Seu comentário aqui"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Erro na IA:", error);
    return {
      category: "Erro",
      message: "O oráculo não conseguiu processar seu pedido.",
    };
  }
};
