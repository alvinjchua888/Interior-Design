"""
Image utility functions for compressing and processing images.
"""
import base64
from io import BytesIO
from PIL import Image


def compress_image(base64_str: str, max_width: int = 1280, max_height: int = 720, quality: int = 80) -> str:
    """
    Compresses an image to ensure fast upload and processing.
    Aims for a max dimension of 1280px while maintaining aspect ratio.
    
    Args:
        base64_str: Base64 encoded image string (with or without data URI prefix)
        max_width: Maximum width for the compressed image
        max_height: Maximum height for the compressed image
        quality: JPEG quality (1-100)
    
    Returns:
        Base64 encoded compressed image string with data URI prefix
    """
    # Remove data URI prefix if present
    if ',' in base64_str:
        header, base64_data = base64_str.split(',', 1)
    else:
        base64_data = base64_str
    
    # Decode base64 to image
    image_data = base64.b64decode(base64_data)
    image = Image.open(BytesIO(image_data))
    
    # Convert RGBA to RGB if necessary
    if image.mode == 'RGBA':
        background = Image.new('RGB', image.size, (255, 255, 255))
        background.paste(image, mask=image.split()[3])
        image = background
    elif image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Calculate new dimensions maintaining aspect ratio
    width, height = image.size
    
    if width > height:
        if width > max_width:
            height = int((max_width / width) * height)
            width = max_width
    else:
        if height > max_height:
            width = int((max_height / height) * width)
            height = max_height
    
    # Resize image
    if width != image.size[0] or height != image.size[1]:
        image = image.resize((width, height), Image.LANCZOS)
    
    # Save to BytesIO as JPEG
    buffer = BytesIO()
    image.save(buffer, format='JPEG', quality=quality, optimize=True)
    buffer.seek(0)
    
    # Encode to base64
    compressed_base64 = base64.b64encode(buffer.read()).decode('utf-8')
    
    return f"data:image/jpeg;base64,{compressed_base64}"


def get_base64_without_prefix(base64_str: str) -> str:
    """
    Remove data URI prefix from base64 string if present.
    
    Args:
        base64_str: Base64 string with or without data URI prefix
    
    Returns:
        Base64 string without prefix
    """
    if ',' in base64_str:
        return base64_str.split(',', 1)[1]
    return base64_str
