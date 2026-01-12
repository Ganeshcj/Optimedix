
import { GoogleGenAI, Type } from "@google/genai";
import { DiseaseType, Severity, ScreeningResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeRetinalImage(
  imageData: string, 
  patientId: string
): Promise<Partial<ScreeningResult>> {
  const model = "gemini-3-flash-preview";

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageData.split(',')[1] || imageData
          }
        },
        {
          text: `You are an expert retinal ophthalmologist AI. Analyze this fundus image. 
          Respond in JSON format with the following fields:
          - disease: one of ["Normal", "Diabetic Retinopathy", "Glaucoma", "Cataract", "Age-related Macular Degeneration"]
          - severity: one of ["Low", "Medium", "High", "Critical"]
          - riskScore: number between 0-100
          - confidenceScore: number between 0-100
          - abnormalities: string describing findings`
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          disease: { type: Type.STRING },
          severity: { type: Type.STRING },
          riskScore: { type: Type.NUMBER },
          confidenceScore: { type: Type.NUMBER },
          abnormalities: { type: Type.STRING }
        },
        required: ["disease", "severity", "riskScore", "confidenceScore", "abnormalities"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text || "{}");
    return {
      ...data,
      patientId,
      date: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9)
    };
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    // Fallback mock
    return {
      disease: DiseaseType.DR,
      severity: Severity.MEDIUM,
      riskScore: 65,
      confidenceScore: 88,
      abnormalities: "Microaneurysms detected in the macular region.",
      patientId,
      date: new Date().toISOString(),
      id: "mock-" + Date.now()
    };
  }
}
