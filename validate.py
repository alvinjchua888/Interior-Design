#!/usr/bin/env python3
"""
Validation script to test Python modules without running the full Streamlit app.
"""
import sys
import base64
from io import BytesIO
from PIL import Image

# Test imports
try:
    from image_utils import compress_image, get_base64_without_prefix
    from github_service import upload_image_to_github
    from gemini_service import DesignIntensity
    print("✓ All modules imported successfully")
except Exception as e:
    print(f"✗ Import error: {e}")
    sys.exit(1)

# Test image compression
try:
    # Create a test image
    test_image = Image.new('RGB', (100, 100), color='red')
    buffer = BytesIO()
    test_image.save(buffer, format='JPEG')
    buffer.seek(0)
    test_base64 = f"data:image/jpeg;base64,{base64.b64encode(buffer.read()).decode()}"
    
    # Test compression
    compressed = compress_image(test_base64, max_width=50, max_height=50)
    
    # Verify it's compressed
    assert compressed.startswith('data:image/jpeg;base64,')
    
    # Decode and check dimensions
    compressed_data = get_base64_without_prefix(compressed)
    img_bytes = base64.b64decode(compressed_data)
    img = Image.open(BytesIO(img_bytes))
    assert img.size[0] <= 50 and img.size[1] <= 50
    
    print("✓ Image compression working correctly")
except Exception as e:
    print(f"✗ Image compression error: {e}")
    sys.exit(1)

# Test get_base64_without_prefix
try:
    test_with_prefix = "data:image/png;base64,abc123"
    test_without_prefix = "abc123"
    
    assert get_base64_without_prefix(test_with_prefix) == "abc123"
    assert get_base64_without_prefix(test_without_prefix) == "abc123"
    
    print("✓ Base64 prefix removal working correctly")
except Exception as e:
    print(f"✗ Base64 prefix removal error: {e}")
    sys.exit(1)

# Test DesignIntensity enum
try:
    assert DesignIntensity.SUBTLE == "Subtle"
    assert DesignIntensity.BALANCED == "Balanced"
    assert DesignIntensity.BOLD == "Bold"
    
    print("✓ DesignIntensity enum working correctly")
except Exception as e:
    print(f"✗ DesignIntensity error: {e}")
    sys.exit(1)

print("\n✅ All validation tests passed!")
print("\nTo run the app:")
print("1. Create a .env file with your GEMINI_API_KEY")
print("2. Run: streamlit run app.py")
