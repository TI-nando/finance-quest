import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_AI_API_KEY;

if (!API_KEY) {
  console.error("ERRO CRÍTICO: Chave da API não encontrada no .env");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const askOracle = async (description, value) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Atue como um Narrador de RPG Medieval.
      O jogador gastou R$ ${value} com: "${description}".
      
      Responda APENAS um JSON neste formato:
      {
        "category": "Classifique o gasto (ex: Taverna, Equipamento, Taxa)",
        "message": "Um conselho curto e engraçado sobre esse gasto"
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
