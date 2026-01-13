
import { GoogleGenAI, Type } from "@google/genai";
import { DiseaseType, Severity, ScreeningResult } from "../types";

export async function analyzeRetinalImages(
  leftImage: string | undefined,
  rightImage: string | undefined,
  patientId: string,
  nurseId: string
): Promise<Partial<ScreeningResult>> {
  // Always initialize GoogleGenAI with the API key from process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  // Use gemini-3-pro-preview for complex reasoning and medical diagnostic tasks
  const model = "gemini-3-pro-preview";
  
  const parts = [];
  if (leftImage) {
    parts.push({ text: "IMAGE A is the LEFT EYE (OS)." });
    parts.push({ inlineData: { mimeType: "image/jpeg", data: leftImage.split(',')[1] || leftImage } });
  }
  if (rightImage) {
    parts.push({ text: "IMAGE B is the RIGHT EYE (OD)." });
    parts.push({ inlineData: { mimeType: "image/jpeg", data: rightImage.split(',')[1] || rightImage } });
  }

  parts.push({
    text: `Analyze these fundus images as an expert ophthalmologist. 
    Classify findings into: ["Normal", "Mild Diabetic Retinopathy", "Severe Diabetic Retinopathy", "Glaucoma", "Cataract", "Age-related Macular Degeneration"].
    Respond in JSON format with 'leftEye' and 'rightEye' objects.
    Each must have:
    - disease (string from list)
    - severity: ["Low", "Medium", "High", "Critical"]
    - riskScore: 0-100
    - confidenceScore: 0-100
    - abnormalities: detailed findings string.`
  });

  // Call generateContent with both model name and prompt parts
  const response = await ai.models.generateContent({
    model,
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          leftEye: {
            type: Type.OBJECT,
            properties: {
              disease: { type: Type.STRING },
              severity: { type: Type.STRING },
              riskScore: { type: Type.NUMBER },
              confidenceScore: { type: Type.NUMBER },
              abnormalities: { type: Type.STRING }
            },
            required: ["disease", "severity", "riskScore", "confidenceScore", "abnormalities"]
          },
          rightEye: {
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
        },
        required: ["leftEye", "rightEye"]
      }
    }
  });

  // Extract text content directly from the response.text property
  const data = JSON.parse(response.text?.trim() || "{}");
  return {
    leftEye: data.leftEye,
    rightEye: data.rightEye,
    patientId,
    nurseId,
    date: new Date().toISOString(),
    id: Math.random().toString(36).substr(2, 9),
    leftEyeImage: leftImage,
    rightEyeImage: rightImage,
    status: 'PENDING'
  };
}
