# Quick Start Guide

This guide will help you get Lumina Interior Design up and running in minutes.

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- A Gemini API key from Google AI Studio

## Getting Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy your API key

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/alvinjchua888/Interior-Design.git
cd Interior-Design
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Your API Key

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file and add your Gemini API key:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Validate Installation (Optional)

Run the validation script to ensure everything is set up correctly:

```bash
python validate.py
```

You should see:
```
✓ All modules imported successfully
✓ Image compression working correctly
✓ Base64 prefix removal working correctly
✓ DesignIntensity enum working correctly

✅ All validation tests passed!
```

### 5. Run the Application

```bash
streamlit run app.py
```

The app will automatically open in your default browser at `http://localhost:8501`

## Using the Application

### Step 1: Select Design Intensity
Choose from three intensity levels:
- **Subtle**: Light staging, preserves airy white walls
- **Balanced**: Professional interior staging with rich detail (default)
- **Bold**: Dramatic transformation with textures and colors

### Step 2: Upload Your Room Photo
- Click "Upload room photo" or drag and drop an image
- Supported formats: PNG, JPG, JPEG, WebP
- Best results with well-lit, clear room photos

### Step 3: Generate Designs
- Click "Generate Designs"
- Wait while the AI generates 5 different style variations:
  - Maximalist Bohemian
  - Luxury Art Deco
  - Modern Farmhouse
  - European Classic
  - Contemporary Organic

### Step 4: Edit and Refine
- Click "Edit" on any design you like
- Enter natural language instructions like:
  - "Add a floor lamp next to the sofa"
  - "Make the walls blue"
  - "Add more plants"
  - "Change the rug to a darker color"
- Click "Apply Changes" to see the updated design

### Step 5: Save Your Design
You have two options:

**Download Locally:**
- Click the "Download Design" button
- The image will be saved to your downloads folder

**Upload to GitHub:**
1. Click the "GitHub" button
2. Enter your GitHub Personal Access Token
3. Enter the repository (format: `owner/repo`)
4. Specify the file path in the repository
5. Click "Confirm Upload"

## Troubleshooting

### API Key Issues

**Error: GEMINI_API_KEY not found**
- Make sure you created the `.env` file
- Check that the API key is correctly set in the `.env` file
- Restart the Streamlit app after creating/updating the `.env` file

### Import Errors

**Error: Module not found**
```bash
pip install -r requirements.txt --upgrade
```

### Connection Issues

**Error: Failed to generate designs**
- Check your internet connection
- Verify your Gemini API key is valid
- Try with a different image
- Check Google AI Studio for API quota limits

### Image Upload Issues

**Error: Failed to process image**
- Ensure the image is a valid format (PNG, JPG, JPEG, WebP)
- Try compressing or resizing the image if it's very large
- Convert RGBA or transparent images to RGB

## GitHub Upload Setup

To use the GitHub upload feature:

1. **Create a Personal Access Token:**
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Give it a name like "Lumina Interior Design"
   - Select the `repo` scope
   - Click "Generate token"
   - Copy the token (starts with `ghp_`)

2. **Create a Repository:**
   - Create a new GitHub repository for storing your designs
   - Use format: `username/repository-name`

3. **Upload:**
   - Enter your token and repository in the app
   - The app will remember your settings for the session

## Performance Tips

- **Faster generation**: Use Subtle intensity for quicker results
- **Better quality**: Use Bold intensity for more detailed designs
- **Clear photos**: Well-lit, uncluttered room photos work best
- **Aspect ratio**: 16:9 landscape photos are ideal

## Support

If you encounter any issues:

1. Check the console output for error messages
2. Run `python validate.py` to test your setup
3. Verify your API key is valid
4. Check [Google AI Studio](https://aistudio.google.com/) for API status
5. Open an issue on GitHub with details about the problem

## Next Steps

- Experiment with different intensity levels
- Try various room types (bedroom, living room, kitchen, etc.)
- Compare different design styles
- Share your favorite designs!

---

**Happy Designing! 🛋️✨**
