import { GoogleGenerativeAI, Type } from "@google/generative-ai";
import { env } from "../config/env";
import { ProcessedTransaction } from "../type";

const ai = new GoogleGenerativeAI({ apiKey: env.API_KEY });

export class GeminiService {
  // Using gemini-3-flash-preview as the optimized model for high-speed text tasks (equivalent/better than 1.5 Flash)
  private modelId = "gemini-3-flash-preview";

  async parseNotification(rawText: string): Promise<ProcessedTransaction> {
    const prompt = `
      You are an AI parser for MoMo and banking financial notifications in Vietnam (VND).
      Analyze the following raw notification text and extract structured data.

      Raw Text: "${rawText}"

      Rules:
      1. amount: Extract the absolute numeric value (e.g., 50000).
      2. type: 'INCOME' if money is received, 'EXPENSE' if money is paid.
      3. category: Infer a standard category (e.g., Food, Transport, Utilities, Shopping, Transfer, Salary).
      4. note: A brief description of the transaction based on the content.
      5. party: The merchant name or person involved.
      6. confidence: A number between 0 and 1 indicating how confident you are in the parsing.
    `;

    try {
      const response = await ai.models.generateContent({
        model: this.modelId,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              amount: { type: Type.NUMBER, description: "Amount in VND" },
              type: { type: Type.STRING, enum: ["INCOME", "EXPENSE"] },
              category: { type: Type.STRING },
              note: { type: Type.STRING },
              party: { type: Type.STRING },
              confidence: { type: Type.NUMBER }
            },
            required: ["amount", "type", "category", "note", "party", "confidence"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("AI returned empty response");

      return JSON.parse(text) as ProcessedTransaction;
    } catch (error) {
      console.error("Gemini Parsing Error:", error);
      throw new Error("Failed to process transaction via Gemini AI");
    }
  }
}

export const geminiService = new GeminiService();
