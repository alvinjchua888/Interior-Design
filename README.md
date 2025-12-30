<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Lumina Interior Design - AI-Powered Interior Staging

Transform your rooms with AI-powered interior design staging. Built with Python, Streamlit, and Google Gemini AI.

## Features

- 🎨 **Multiple Design Styles**: Generate 5 different interior design variations
- 🎚️ **Intensity Levels**: Choose from Subtle, Balanced, or Bold transformations
- ✏️ **AI Editing**: Refine designs with natural language instructions
- 💾 **Download Designs**: Save your favorite designs locally
- 🐙 **GitHub Integration**: Upload designs directly to your GitHub repository

## Design Styles

- Maximalist Bohemian
- Luxury Art Deco
- Modern Farmhouse
- European Classic
- Contemporary Organic

## Run Locally

**Prerequisites:** Python 3.8+

1. **Clone the repository**
   ```bash
   git clone https://github.com/alvinjchua888/Interior-Design.git
   cd Interior-Design
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up your API key**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   Get your API key from: https://aistudio.google.com/app/apikey

4. **Run the app**
   ```bash
   streamlit run app.py
   ```

5. **Open your browser**
   
   The app will automatically open at `http://localhost:8501`

## Usage

1. **Select Design Boldness**: Choose your preferred intensity level (Subtle, Balanced, or Bold)
2. **Upload Photo**: Upload a photo of your room
3. **Generate Designs**: Wait for AI to generate 5 style variations
4. **Select & Edit**: Choose a design and refine it with custom instructions
5. **Download or Share**: Save your design or upload it to GitHub

## Technologies Used

- **Frontend**: Streamlit
- **Backend**: Python 3.8+
- **AI Model**: Google Gemini 2.0 Flash
- **Image Processing**: Pillow (PIL)
- **Environment**: python-dotenv

## Requirements

See [requirements.txt](requirements.txt) for full list of dependencies.

## License

MIT License - feel free to use this project for your own purposes!
