"""
Gemini AI service for generating and editing interior designs.
"""
import os
import base64
from typing import Optional
import google.generativeai as genai
from image_utils import get_base64_without_prefix


# Design intensity levels
class DesignIntensity:
    SUBTLE = "Subtle"
    BALANCED = "Balanced"
    BOLD = "Bold"


def generate_interior_design(
    base64_image: str,
    style: str,
    intensity: str = DesignIntensity.BALANCED,
    api_key: Optional[str] = None
) -> Optional[str]:
    """
    Generate an interior design using Gemini AI.
    
    Args:
        base64_image: Base64 encoded image string
        style: Design style (e.g., "Modern Farmhouse")
        intensity: Design intensity level
        api_key: Gemini API key (if not provided, uses GEMINI_API_KEY env var)
    
    Returns:
        Base64 encoded generated image with data URI prefix, or None if failed
    """
    # Configure API
    api_key = api_key or os.getenv('GEMINI_API_KEY')
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment")
    
    genai.configure(api_key=api_key)
    
    # Determine intensity prompt
    intensity_prompt = ""
    
    if intensity == DesignIntensity.SUBTLE:
        intensity_prompt = (
            "Focus on minimal, clean staging. Maintain airy white walls or very light neutral tones. "
            "Add essential furniture with slim profiles. Keep the original character of the room prominent. "
            "Subtle accents only."
        )
    elif intensity == DesignIntensity.BOLD:
        intensity_prompt = (
            "MAXIMALIST APPROACH. Transform the room completely. Structural wood paneling, "
            "floor-to-ceiling textures, bold statement furniture, and dramatic lighting. "
            "No blank walls allowed. Use high-contrast materials and deep colors."
        )
    else:  # BALANCED
        intensity_prompt = (
            f"Balanced professional staging. Add sophisticated {style} furniture, layered rugs, "
            "and tasteful wall decor. Use a mix of textures without overwhelming the space. "
            "Magazine-quality lighting."
        )
    
    prompt = (
        f"Photorealistic Interior Design Transformation: {style} style. "
        f"CONTEXT: High-end interior architect staging a condo. "
        f"INTENSITY LEVEL: {intensity}. "
        f"{intensity_prompt} "
        f"REQUIREMENT: Professional, high-resolution, magazine-quality photograph. "
        f"Keep structural walls and windows as they are."
    )
    
    try:
        # Create model
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        # Prepare image data
        image_data = get_base64_without_prefix(base64_image)
        image_bytes = base64.b64decode(image_data)
        
        # Generate content
        response = model.generate_content(
            [
                {
                    'mime_type': 'image/jpeg',
                    'data': image_bytes
                },
                prompt
            ],
            generation_config={
                'temperature': 1.0,
                'top_p': 0.95,
                'top_k': 40,
                'max_output_tokens': 8192,
            }
        )
        
        # Extract generated image
        if response.candidates and len(response.candidates) > 0:
            candidate = response.candidates[0]
            if candidate.content and candidate.content.parts:
                for part in candidate.content.parts:
                    if hasattr(part, 'inline_data') and part.inline_data:
                        generated_data = part.inline_data.data
                        mime_type = part.inline_data.mime_type
                        return f"data:{mime_type};base64,{generated_data}"
        
        print(f"No image generated for style: {style}")
        return None
        
    except Exception as error:
        print(f"Error generating {style}: {error}")
        return None


def edit_design(
    base64_image: str,
    edit_instructions: str,
    api_key: Optional[str] = None
) -> Optional[str]:
    """
    Edit an interior design based on user instructions using Gemini AI.
    
    Args:
        base64_image: Base64 encoded image string
        edit_instructions: Instructions for editing the design
        api_key: Gemini API key (if not provided, uses GEMINI_API_KEY env var)
    
    Returns:
        Base64 encoded edited image with data URI prefix, or None if failed
    """
    # Configure API
    api_key = api_key or os.getenv('GEMINI_API_KEY')
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment")
    
    genai.configure(api_key=api_key)
    
    prompt = (
        f'Edit this room design. Instruction: "{edit_instructions}". '
        f"Requirement: Maintain the high level of detail and texture. "
        f"If adding items, ensure they have realistic shadows and textures. "
        f"Keep the professional staging aesthetic."
    )
    
    try:
        # Create model
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        # Prepare image data
        image_data = get_base64_without_prefix(base64_image)
        image_bytes = base64.b64decode(image_data)
        
        # Determine mime type
        mime_type = 'image/png' if 'image/png' in base64_image else 'image/jpeg'
        
        # Generate content
        response = model.generate_content(
            [
                {
                    'mime_type': mime_type,
                    'data': image_bytes
                },
                prompt
            ],
            generation_config={
                'temperature': 1.0,
                'top_p': 0.95,
                'top_k': 40,
                'max_output_tokens': 8192,
            }
        )
        
        # Extract edited image
        if response.candidates and len(response.candidates) > 0:
            candidate = response.candidates[0]
            if candidate.content and candidate.content.parts:
                for part in candidate.content.parts:
                    if hasattr(part, 'inline_data') and part.inline_data:
                        generated_data = part.inline_data.data
                        mime_type = part.inline_data.mime_type
                        return f"data:{mime_type};base64,{generated_data}"
        
        return None
        
    except Exception as error:
        print(f"Edit error: {error}")
        raise error
