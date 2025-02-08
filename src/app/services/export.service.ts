import { Injectable } from '@angular/core';
import { SupabaseService, SnipAI } from './supabase.service';
import { Octokit } from '@octokit/rest';
import { jsPDF } from 'jspdf';
import { marked } from 'marked';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  private octokit: Octokit;

  constructor(private supabaseService: SupabaseService) {
    this.octokit = new Octokit();
  }

  // GitHub Gist Export
  async exportToGist(snippet: SnipAI, githubToken: string) {
    const octokit = new Octokit({ auth: githubToken });

    const files: { [key: string]: { content: string } } = {
      [`${snippet.title}.${this.getFileExtension(snippet.language)}`]: {
        content: snippet.code,
      },
    };

    const response = await octokit.gists.create({
      description: snippet.title,
      public: snippet.is_public,
      files,
    });

    return response.data.html_url;
  }

  // Import from GitHub
  async importFromGithub(gistId: string): Promise<SnipAI> {
    const response = await this.octokit.gists.get({ gist_id: gistId });
    const gist = response.data;
    const file = Object.values(gist.files ?? {})[0];

    if (!file) throw new Error('No file found in gist');

    return {
      title: file.filename?.split('.')[0] || 'Untitled',
      code: file.content || '',
      language: this.detectLanguage(file.filename || ''),
      is_public: gist.public,
      category: 'Imported',
      user_id: '',
    };
  }

  // Export as PDF
  async exportToPDF(snippet: SnipAI): Promise<Blob> {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text(snippet.title, 20, 20);

    // Add metadata
    doc.setFontSize(10);
    doc.text(`Language: ${snippet.language}`, 20, 30);
    doc.text(`Created: ${new Date().toLocaleDateString()}`, 20, 35);

    // Add code with syntax highlighting
    doc.setFontSize(11);
    const splitCode = doc.splitTextToSize(snippet.code, 170);
    doc.text(splitCode, 20, 45);

    return doc.output('blob');
  }

  // Export as Markdown
  exportToMarkdown(snippet: SnipAI): string {
    return `# ${snippet.title}

## Details
- Language: ${snippet.language}
- Category: ${snippet.category}
- Created: ${new Date().toLocaleDateString()}

## Code
\`\`\`${snippet.language}
${snippet.code}
\`\`\`
`;
  }

  // Backup all snippets
  async backupAllSnippets(): Promise<Blob> {
    const snippets = await this.supabaseService.getUserCodeBins();
    const backup = {
      version: '1.0',
      date: new Date().toISOString(),
      snippets,
    };

    return new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
  }

  // Helper methods
  private getFileExtension(language: string): string {
    const extensions: { [key: string]: string } = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      csharp: 'cs',
    };
    return extensions[language.toLowerCase()] || 'txt';
  }

  private detectLanguage(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languages: { [key: string]: string } = {
      js: 'javascript',
      ts: 'typescript',
      py: 'python',
      java: 'java',
      cpp: 'cpp',
      cs: 'csharp',
    };
    return languages[ext || ''] || 'plaintext';
  }
}
