
import { GoogleGenAI } from "@google/genai";
import { DesignIntensity } from "../types";

export async function generateInteriorDesign(
  base64Image: string, 
  style: string, 
  intensity: DesignIntensity = DesignIntensity.BALANCED
): Promise<string | null> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  let intensityPrompt = "";
  
  switch (intensity) {
    case DesignIntensity.SUBTLE:
      intensityPrompt = `Focus on minimal, clean staging. Maintain airy white walls or very light neutral tones. Add essential furniture with slim profiles. Keep the original character of the room prominent. Subtle accents only.`;
      break;
    case DesignIntensity.BOLD:
      intensityPrompt = `MAXIMALIST APPROACH. Transform the room completely. Structural wood paneling, floor-to-ceiling textures, bold statement furniture, and dramatic lighting. No blank walls allowed. Use high-contrast materials and deep colors.`;
      break;
    default:
      intensityPrompt = `Balanced professional staging. Add sophisticated ${style} furniture, layered rugs, and tasteful wall decor. Use a mix of textures without overwhelming the space. Magazine-quality lighting.`;
  }

  const prompt = `Photorealistic Interior Design Transformation: ${style} style. 
  CONTEXT: High-end interior architect staging a condo.
  INTENSITY LEVEL: ${intensity}.
  ${intensityPrompt}
  REQUIREMENT: Professional, high-resolution, magazine-quality photograph. Keep structural walls and windows as they are.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } },
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (part?.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  } catch (error) {
    console.error(`Error: ${style}`, error);
  }
  return null;
}

export async function editDesign(base64Image: string, editInstructions: string): Promise<string | null> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `Edit this room design. Instruction: "${editInstructions}". 
  Requirement: Maintain the high level of detail and texture. If adding items, ensure they have realistic shadows and textures. Keep the professional staging aesthetic.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/png' } },
          { text: prompt }
        ]
      }
    });

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (part?.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  } catch (error) {
    console.error("Edit error", error);
    throw error;
  }
  return null;
}
