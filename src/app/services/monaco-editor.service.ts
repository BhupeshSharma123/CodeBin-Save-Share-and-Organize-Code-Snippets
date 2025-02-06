import { Injectable } from '@angular/core';
import { executeJavaCode, executePythonCode } from './language-executors';
import { AIService } from './ai.service';

@Injectable({
  providedIn: 'root',
})
export class MonacoEditorService {
  constructor(private aiService: AIService) {}

  async executeCode(language: string, code: string): Promise<string> {
    const prompt = `Execute this ${language} code and show the output. Only show the output, no explanations:

${code}`;

    try {
      const result = await this.aiService.generateCodeFromPrompt(
        prompt,
        language
      );
      return result;
    } catch (error: any) {
      throw new Error(`Execution error: ${error.message}`);
    }
  }

  private executeJavaScript(code: string): any {
    try {
      // Basic JavaScript evaluation
      const result = eval(code);
      return result;
    } catch (error: any) {
      throw new Error(`Execution error: ${error.message}`);
    }
  }

  // Add any additional methods needed for other languages
}
