import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private isProcessing = new BehaviorSubject<boolean>(false);
  isProcessing$ = this.isProcessing.asObservable();

  constructor() {
    this.genAI = new GoogleGenerativeAI(environment.geminiApiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async explainCode(code: string): Promise<string> {
    this.isProcessing.next(true);
    try {
      const prompt = `Explain this code in detail, focusing on its purpose and how it works:\n\n${code}`;
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI Error:', error);
      throw new Error('Failed to explain code');
    } finally {
      this.isProcessing.next(false);
    }
  }

  async suggestImprovements(code: string): Promise<string> {
    this.isProcessing.next(true);
    try {
      const prompt = `Analyze this code and suggest specific improvements for:
      1. Performance optimization
      2. Code readability
      3. Best practices
      4. Potential bugs
      
      Code:
      ${code}`;
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI Error:', error);
      throw new Error('Failed to suggest improvements');
    } finally {
      this.isProcessing.next(false);
    }
  }

  async translateCode(
    code: string,
    fromLang: string,
    toLang: string
  ): Promise<string> {
    this.isProcessing.next(true);
    try {
      const prompt = `Translate this ${fromLang} code to ${toLang}. Maintain the same functionality and include comments explaining the translation:

      Original ${fromLang} code:
      ${code}`;
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI Error:', error);
      throw new Error('Failed to translate code');
    } finally {
      this.isProcessing.next(false);
    }
  }

  async generateCodeFromPrompt(
    prompt: string,
    language: string
  ): Promise<string> {
    this.isProcessing.next(true);
    try {
      const fullPrompt = `Generate ${language} code that:
      1. Implements the following requirement: ${prompt}
      2. Includes detailed comments explaining the code
      3. Follows best practices
      4. Is production-ready and efficient`;
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI Error:', error);
      throw new Error('Failed to generate code');
    } finally {
      this.isProcessing.next(false);
    }
  }
}
