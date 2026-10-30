"""
Lumina Interior Design - AI-powered interior design staging application.
Built with Streamlit and Google Gemini AI.
"""
import streamlit as st
import base64
import os
from io import BytesIO
from datetime import datetime
from dotenv import load_dotenv
from PIL import Image

from gemini_service import generate_interior_design, edit_design, DesignIntensity
from image_utils import compress_image, get_base64_without_prefix
from github_service import upload_image_to_github

# Load environment variables
load_dotenv()

# Design styles
DESIGN_STYLES = [
    'Maximalist Bohemian',
    'Luxury Art Deco',
    'Modern Farmhouse',
    'European Classic',
    'Contemporary Organic'
]

# Page configuration
st.set_page_config(
    page_title="Lumina Interior Design",
    page_icon="🛋️",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS for styling
st.markdown("""
<style>
    /* Main theme */
    .stApp {
        background-color: #09090b;
    }
    
    /* Headers */
    h1, h2, h3 {
        color: #fafafa !important;
    }
    
    /* Buttons */
    .stButton > button {
        background-color: #3b82f6;
        color: white;
        border-radius: 12px;
        padding: 0.5rem 1.5rem;
        font-weight: 600;
        border: none;
        transition: all 0.3s;
    }
    
    .stButton > button:hover {
        background-color: #2563eb;
        transform: scale(1.02);
    }
    
    /* File uploader */
    .stFileUploader {
        background-color: #18181b;
        border-radius: 16px;
        padding: 1rem;
    }
    
    /* Selectbox */
    .stSelectbox {
        background-color: #18181b;
    }
    
    /* Radio buttons */
    .stRadio > label {
        color: #a1a1aa !important;
    }
    
    /* Cards */
    .design-card {
        background-color: #18181b;
        border: 1px solid #27272a;
        border-radius: 16px;
        padding: 1rem;
        margin: 0.5rem 0;
    }
    
    /* Success/error messages */
    .stSuccess {
        background-color: #065f46;
        color: #d1fae5;
    }
    
    .stError {
        background-color: #7f1d1d;
        color: #fecaca;
    }
    
    /* Spinner */
    .stSpinner > div {
        border-top-color: #3b82f6 !important;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'state' not in st.session_state:
    st.session_state.state = 'IDLE'
if 'designs' not in st.session_state:
    st.session_state.designs = {}
if 'selected_design' not in st.session_state:
    st.session_state.selected_design = None
if 'original_image' not in st.session_state:
    st.session_state.original_image = None
if 'current_intensity' not in st.session_state:
    st.session_state.current_intensity = DesignIntensity.BALANCED


def reset_app():
    """Reset the application state."""
    st.session_state.state = 'IDLE'
    st.session_state.designs = {}
    st.session_state.selected_design = None
    st.session_state.original_image = None
    st.rerun()


def image_to_base64(image_file):
    """Convert uploaded image to base64 string."""
    image = Image.open(image_file)
    buffered = BytesIO()
    
    # Convert to RGB if necessary
    if image.mode in ('RGBA', 'LA', 'P'):
        background = Image.new('RGB', image.size, (255, 255, 255))
        if image.mode == 'P':
            image = image.convert('RGBA')
        if 'A' in image.mode:
            background.paste(image, mask=image.split()[-1])
        else:
            background.paste(image)
        image = background
    
    image.save(buffered, format="JPEG", quality=95)
    img_str = base64.b64encode(buffered.getvalue()).decode()
    return f"data:image/jpeg;base64,{img_str}"


def download_image(base64_str, filename):
    """Create download button for base64 image."""
    # Extract base64 data
    image_data = get_base64_without_prefix(base64_str)
    
    st.download_button(
        label="💾 Download Design",
        data=base64.b64decode(image_data),
        file_name=filename,
        mime="image/png"
    )


def main():
    """Main application logic."""
    
    # Header
    col1, col2 = st.columns([6, 1])
    with col1:
        st.markdown("# 🛋️ **Lumina**<span style='color: #3b82f6;'>Interior</span>", unsafe_allow_html=True)
    with col2:
        if st.button("🔄 Reset"):
            reset_app()
    
    st.markdown("---")
    
    # Main application flow
    if st.session_state.state == 'IDLE':
        show_image_uploader()
    elif st.session_state.state == 'GENERATING':
        show_generation_progress()
    elif st.session_state.state == 'SELECTING':
        show_design_grid()
    elif st.session_state.state == 'EDITING':
        show_design_editor()


def show_image_uploader():
    """Display the image upload interface."""
    st.markdown("## Visualize your dream home.")
    st.markdown("Select your preferred intensity and upload a photo to start staging.")
    
    # Intensity selector
    st.markdown("### Design Boldness")
    intensity = st.radio(
        "Choose intensity level",
        [DesignIntensity.SUBTLE, DesignIntensity.BALANCED, DesignIntensity.BOLD],
        index=1,
        horizontal=True,
        label_visibility="collapsed"
    )
    st.session_state.current_intensity = intensity
    
    # Display intensity description
    if intensity == DesignIntensity.SUBTLE:
        st.caption("Light staging, preserves airy white walls.")
    elif intensity == DesignIntensity.BALANCED:
        st.caption("Professional interior staging with rich detail.")
    else:  # BOLD
        st.caption("Dramatic transformation with textures and colors.")
    
    st.markdown("")
    
    # File uploader
    uploaded_file = st.file_uploader(
        "Upload room photo (PNG, JPG, or WebP)",
        type=['png', 'jpg', 'jpeg', 'webp'],
        help="Upload a photo of your room to start the AI staging process"
    )
    
    if uploaded_file is not None:
        # Show preview
        st.image(uploaded_file, caption="Uploaded Image", use_container_width=True)
        
        if st.button("✨ Generate Designs", type="primary", use_container_width=True):
            # Convert and compress image
            base64_image = image_to_base64(uploaded_file)
            compressed_image = compress_image(base64_image)
            
            st.session_state.original_image = compressed_image
            st.session_state.state = 'GENERATING'
            st.rerun()


def show_generation_progress():
    """Display progress while generating designs."""
    st.markdown(f"## 🎨 {st.session_state.current_intensity} Staging")
    
    if st.session_state.current_intensity == DesignIntensity.SUBTLE:
        st.markdown("Applying minimal staging and clean lines...")
    else:
        st.markdown("Adding architectural textures and custom lighting...")
    
    progress_bar = st.progress(0)
    status_text = st.empty()
    
    # Generate designs for all styles
    total_styles = len(DESIGN_STYLES)
    
    for idx, style in enumerate(DESIGN_STYLES):
        status_text.markdown(f"**Generating {style}...** ({idx + 1}/{total_styles})")
        progress_bar.progress((idx + 1) / total_styles)
        
        try:
            generated_url = generate_interior_design(
                st.session_state.original_image,
                style,
                st.session_state.current_intensity
            )
            
            if generated_url:
                st.session_state.designs[style] = {
                    'id': f"design-{datetime.now().timestamp()}-{idx}",
                    'style': style,
                    'image_url': generated_url
                }
        except Exception as e:
            st.warning(f"Failed to generate {style}: {str(e)}")
    
    # Check if any designs were generated
    if len(st.session_state.designs) > 0:
        st.session_state.state = 'SELECTING'
        st.success(f"✅ Generated {len(st.session_state.designs)} design variations!")
        st.rerun()
    else:
        st.error("❌ Connection issue. Please try a different photo.")
        if st.button("Try Again"):
            reset_app()


def show_design_grid():
    """Display the grid of generated designs."""
    st.markdown("## 🎨 Style Variations")
    st.markdown(f"Select a design to start personalizing furniture and decor. ({len(st.session_state.designs)}/{len(DESIGN_STYLES)} generated)")
    
    if st.button("📤 Upload New Photo", type="secondary"):
        reset_app()
    
    st.markdown("---")
    
    # Display designs in a grid
    cols = st.columns(2)
    
    for idx, (style, design) in enumerate(st.session_state.designs.items()):
        with cols[idx % 2]:
            st.markdown(f"### {style}")
            st.image(design['image_url'], use_container_width=True)
            
            col1, col2, col3 = st.columns(3)
            
            with col1:
                if st.button("✏️ Edit", key=f"edit_{style}"):
                    st.session_state.selected_design = design
                    st.session_state.state = 'EDITING'
                    st.rerun()
            
            with col2:
                download_image(
                    design['image_url'],
                    f"Lumina-{style.replace(' ', '-')}.png"
                )
            
            with col3:
                if st.button("🐙 GitHub", key=f"github_{style}"):
                    show_github_upload_modal(design)


def show_design_editor():
    """Display the design editor interface."""
    design = st.session_state.selected_design
    
    # Back button
    if st.button("⬅️ Back to Grid"):
        st.session_state.state = 'SELECTING'
        st.session_state.selected_design = None
        st.rerun()
    
    st.markdown(f"## Editing: {design['style']}")
    
    # Display current design
    st.image(design['image_url'], use_container_width=True)
    
    # Action buttons
    col1, col2, col3 = st.columns(3)
    
    with col1:
        download_image(
            design['image_url'],
            f"Lumina-Edit-{design['style'].replace(' ', '-')}.png"
        )
    
    with col2:
        if st.button("📤 Upload New Photo"):
            reset_app()
    
    with col3:
        if st.button("🐙 Upload to GitHub"):
            show_github_upload_modal(design)
    
    st.markdown("---")
    
    # Edit instructions
    st.markdown("### Refine your design")
    st.caption('Describe any changes like "Add a floor lamp" or "Make the walls blue".')
    
    instruction = st.text_input(
        "Enter instruction",
        placeholder="e.g., Add a floor lamp next to the sofa",
        label_visibility="collapsed"
    )
    
    if st.button("✨ Apply Changes", type="primary", disabled=not instruction):
        with st.spinner("Applying your changes..."):
            try:
                updated_url = edit_design(design['image_url'], instruction)
                
                if updated_url:
                    # Update design
                    design['image_url'] = updated_url
                    st.session_state.selected_design = design
                    
                    # Update in designs dict
                    st.session_state.designs[design['style']] = design
                    
                    st.success("✅ Changes applied successfully!")
                    st.rerun()
                else:
                    st.error("❌ Failed to apply changes. Please try again.")
            except Exception as e:
                st.error(f"❌ AI couldn't apply that specific change. Try a simpler request! Error: {str(e)}")


def show_github_upload_modal(design):
    """Display GitHub upload form in a modal-like container."""
    st.markdown("---")
    st.markdown("### 🐙 Upload to GitHub")
    
    with st.form("github_upload_form"):
        token = st.text_input(
            "Personal Access Token",
            type="password",
            placeholder="ghp_xxxxxxxxxxxx",
            help="GitHub personal access token with repo write access"
        )
        
        repo = st.text_input(
            "Repository (owner/repo)",
            placeholder="username/interior-designs",
            help="Your GitHub repository in format: owner/repo"
        )
        
        default_path = f"designs/{design['style'].lower().replace(' ', '-')}-{int(datetime.now().timestamp())}.png"
        path = st.text_input(
            "File Path",
            value=default_path,
            help="Path where the file will be saved in the repository"
        )
        
        submitted = st.form_submit_button("📤 Confirm Upload", type="primary", use_container_width=True)
        
        if submitted:
            if not token or not repo or not path:
                st.error("❌ Please fill in all fields.")
            else:
                try:
                    with st.spinner("Uploading to GitHub..."):
                        upload_image_to_github(
                            token=token,
                            repo=repo,
                            path=path,
                            message=f"Add interior design: {design['style']}",
                            content=design['image_url']
                        )
                    st.success("✅ Design uploaded successfully to GitHub!")
                except Exception as e:
                    st.error(f"❌ Failed to upload: {str(e)}")


if __name__ == "__main__":
    # Check for API key
    if not os.getenv('GEMINI_API_KEY'):
        st.error("⚠️ GEMINI_API_KEY not found. Please set it in your .env file or environment variables.")
        st.stop()
    
    main()
