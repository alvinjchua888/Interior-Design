"""
GitHub service for uploading images to GitHub repositories.
"""
import requests
from typing import Dict, Any


def upload_image_to_github(
    token: str,
    repo: str,
    path: str,
    message: str,
    content: str
) -> Dict[str, Any]:
    """
    Uploads a base64 image to a GitHub repository.
    
    Args:
        token: GitHub personal access token
        repo: Repository in format "owner/repo"
        path: File path in the repository
        message: Commit message
        content: Base64 encoded image content (with or without data URI prefix)
    
    Returns:
        Response data from GitHub API
    
    Raises:
        Exception: If upload fails
    """
    # GitHub API expects content WITHOUT the data:image/... prefix
    clean_base64 = content.split(',')[1] if ',' in content else content
    
    url = f"https://api.github.com/repos/{repo}/contents/{path}"
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
    }
    
    data = {
        'message': message,
        'content': clean_base64,
    }
    
    response = requests.put(url, json=data, headers=headers)
    
    if not response.ok:
        error_data = response.json()
        error_message = error_data.get('message', 'Failed to upload to GitHub')
        raise Exception(error_message)
    
    return response.json()
