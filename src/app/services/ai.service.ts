import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class AIService {
  [x: string]: any;
  private genAI: GoogleGenerativeAI;
  private model: any;
  private isProcessing = new BehaviorSubject<boolean>(false);
  isProcessing$ = this.isProcessing.asObservable();

  constructor(private loadingService: LoadingService) {
    this.genAI = new GoogleGenerativeAI(environment.geminiApiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async explainCode(code: string): Promise<string> {
    this.loadingService.show();
    try {
      const result = await this.model.generateContent(`
        Explain this code in detail:
        ${code}
        
        Format the explanation with:
        1. Overview
        2. Key concepts
        3. Line-by-line explanation
        4. Best practices used
      `);
      return result.response.text();
    } catch (error) {
      console.error('AI Error:', error);
      throw new Error('Failed to explain code');
    } finally {
      this.loadingService.hide();
    }
  }

  async suggestImprovements(code: string): Promise<string> {
    try {
      const prompt = `Analyze this code and suggest specific improvements for:
      1. Performance optimization
      2. Code readability
      3. Best practices
      4. Potential bugs
      
      Also provide an optimized version of the code.
      
      Code:
      ${code}`;

      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('AI Error:', error);
      throw new Error('Failed to suggest improvements');
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
    this.loadingService.show();
    try {
      const result = await this.model.generateContent(prompt);
      let code = result.response.text();
      // Extract code from markdown if present
      if (code.includes('```')) {
        code = code.split('```')[1].split('```')[0];
      }
      return code.trim();
    } catch (error) {
      console.error('AI Error:', error);
      throw new Error('Failed to generate code');
    } finally {
      this.loadingService.hide();
    }
  }

  async analyzeComplexity(code: string): Promise<string> {
    this.isProcessing.next(true);
    try {
      const prompt = `Analyze this code's complexity and provide detailed feedback on:
      1. Time complexity (Big O notation)
      2. Space complexity
      3. Cognitive complexity
      4. Areas that could be simplified
      
      Code:
      ${code}`;
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } finally {
      this.isProcessing.next(false);
    }
  }

  async analyzeSecurity(code: string): Promise<string> {
    this.isProcessing.next(true);
    try {
      const prompt = `Perform a security analysis of this code and identify:
      1. Potential security vulnerabilities
      2. Common security anti-patterns
      3. Data safety concerns
      4. Recommended security improvements
      
      Code:
      ${code}`;
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } finally {
      this.isProcessing.next(false);
    }
  }

  async reviewCode(code: string): Promise<string> {
    this.isProcessing.next(true);
    try {
      const prompt = `Perform a comprehensive code review focusing on:
      1. Code quality and best practices
      2. Performance considerations
      3. Error handling
      4. Maintainability
      5. Specific improvement suggestions
      
      Code:
      ${code}`;
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } finally {
      this.isProcessing.next(false);
    }
  }

  async completeCode(code: string): Promise<string> {
    this.isProcessing.next(true);
    try {
      const prompt = `Complete or suggest improvements to this code. If it appears incomplete:
      1. Add missing functionality
      2. Complete any TODO comments
      3. Add error handling
      4. Add input validation
      
      Code:
      ${code}`;
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } finally {
      this.isProcessing.next(false);
    }
  }

  async formatCode(code: string): Promise<string> {
    this.isProcessing.next(true);
    try {
      const prompt = `Format and improve the readability of this code:
      1. Apply consistent indentation
      2. Organize imports and declarations
      3. Add appropriate spacing
      4. Follow language-specific style guidelines
      
      Code:
      ${code}`;
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } finally {
      this.isProcessing.next(false);
    }
  }

  async generateDocs(code: string): Promise<string> {
    this.isProcessing.next(true);
    try {
      const prompt = `Generate comprehensive documentation for this code including:
      1. Function/class purpose and description
      2. Parameter descriptions
      3. Return value details
      4. Usage examples
      5. Important notes or warnings
      
      Code:
      ${code}`;
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } finally {
      this.isProcessing.next(false);
    }
  }

  async findSimilarCode(code: string): Promise<string> {
    this.isProcessing.next(true);
    try {
      const prompt = `Analyze this code and suggest similar patterns or alternatives:
      1. Common design patterns that match
      2. Alternative implementations
      3. Similar solutions from popular libraries
      4. Best practices for this type of code
      
      Code:
      ${code}`;
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } finally {
      this.isProcessing.next(false);
    }
  }

  async detectDuplicates(code: string): Promise<string> {
    this.isProcessing.next(true);
    try {
      const prompt = `Analyze this code for potential duplication and suggest improvements:
      1. Identify repeated code patterns
      2. Suggest ways to reduce duplication
      3. Recommend abstractions or refactoring
      4. Identify shared functionality
      
      Code:
      ${code}`;
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } finally {
      this.isProcessing.next(false);
    }
  }
}
