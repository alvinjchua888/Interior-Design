import { DesignIntensity } from "../types";

const API_BASE = '/api';

export async function generateInteriorDesign(
  base64Image: string,
  style: string,
  intensity: DesignIntensity = DesignIntensity.BALANCED
): Promise<string | null> {
  try {
    const imageBase64 = base64Image.split(',')[1];
    
    const response = await fetch(`${API_BASE}/generate-design`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64,
        style,
        intensity,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate design');
    }

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error(`Error: ${style}`, error);
    throw error;
  }
}

export async function editDesign(base64Image: string, editInstructions: string): Promise<string | null> {
  try {
    const imageBase64 = base64Image.split(',')[1];
    
    const response = await fetch(`${API_BASE}/edit-design`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64,
        instruction: editInstructions,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to edit design');
    }

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error("Edit error", error);
    throw error;
  }
}
