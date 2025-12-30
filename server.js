import express from 'express';
import cors from 'cors';
import OpenAI, { toFile } from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use(express.static(path.join(__dirname, 'dist')));

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

app.post('/api/generate-design', async (req, res) => {
  try {
    const { imageBase64, style, intensity } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image is required' });
    }

    let intensityPrompt = "";
    switch (intensity) {
      case 'Subtle':
        intensityPrompt = `Focus on minimal, clean staging. Maintain airy white walls or very light neutral tones. Add essential furniture with slim profiles. Keep the original character of the room prominent. Subtle accents only.`;
        break;
      case 'Bold':
        intensityPrompt = `MAXIMALIST APPROACH. Transform the room completely. Structural wood paneling, floor-to-ceiling textures, bold statement furniture, and dramatic lighting. No blank walls allowed. Use high-contrast materials and deep colors.`;
        break;
      default:
        intensityPrompt = `Balanced professional staging. Add sophisticated ${style} furniture, layered rugs, and tasteful wall decor. Use a mix of textures without overwhelming the space. Magazine-quality lighting.`;
    }

    const prompt = `Photorealistic Interior Design Transformation: ${style} style.
CONTEXT: High-end interior architect staging a condo.
INTENSITY LEVEL: ${intensity}.
${intensityPrompt}
REQUIREMENT: Professional, high-resolution, magazine-quality photograph. Keep structural walls and windows as they are. Transform the existing room photo into this style.`;

    const imageBuffer = Buffer.from(imageBase64, 'base64');
    const imageFile = await toFile(imageBuffer, 'room.png', { type: 'image/png' });

    const response = await openai.images.edit({
      model: 'gpt-image-1',
      image: imageFile,
      prompt,
    });

    const generatedBase64 = response.data[0]?.b64_json;
    if (generatedBase64) {
      res.json({ imageUrl: `data:image/png;base64,${generatedBase64}` });
    } else {
      res.status(500).json({ error: 'No image generated' });
    }
  } catch (error) {
    console.error('Error generating design:', error);
    res.status(500).json({ error: error.message || 'Failed to generate design' });
  }
});

app.post('/api/edit-design', async (req, res) => {
  try {
    const { imageBase64, instruction } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const prompt = `Edit this room design. Instruction: "${instruction}".
Requirement: Maintain the high level of detail and texture. If adding items, ensure they have realistic shadows and textures. Keep the professional staging aesthetic.`;

    const imageBuffer = Buffer.from(imageBase64, 'base64');
    const imageFile = await toFile(imageBuffer, 'design.png', { type: 'image/png' });

    const response = await openai.images.edit({
      model: 'gpt-image-1',
      image: imageFile,
      prompt,
    });

    const generatedBase64 = response.data[0]?.b64_json;
    if (generatedBase64) {
      res.json({ imageUrl: `data:image/png;base64,${generatedBase64}` });
    } else {
      res.status(500).json({ error: 'No image generated' });
    }
  } catch (error) {
    console.error('Error editing design:', error);
    res.status(500).json({ error: error.message || 'Failed to edit design' });
  }
});

app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
