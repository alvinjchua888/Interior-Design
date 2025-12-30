import { GitHubUploadParams } from "../types";

export async function uploadImageToGitHub(params: GitHubUploadParams): Promise<void> {
  const { token, repo, path, message, content } = params;

  const cleanBase64 = content.split(',')[1] || content;

  const url = `https://api.github.com/repos/${repo}/contents/${path}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      content: cleanBase64,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to upload to GitHub');
  }
}
