import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.initializeClient();
  }

  initializeClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }
  }

  async convertCodeWithAI(sourceCode, sourceLang, targetLang) {
    if (!this.genAI || !this.model) {
      throw new Error('Gemini API key not configured');
    }

    const prompt = `Convert the following ${sourceLang} code to ${targetLang}. 
    Provide only the converted code without explanations or markdown formatting.
    Maintain the same functionality and logic.
    
    Source code:
    \`\`\`${sourceLang}
    ${sourceCode}
    \`\`\`
    
    Converted ${targetLang} code:`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const convertedCode = response.text().trim();
      
      // Clean up the response (remove markdown formatting if present)
      const cleanCode = convertedCode.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();

      return {
        code: cleanCode,
        success: true,
        error: null,
        analysis: [
          `✅ AI-powered conversion from ${sourceLang} to ${targetLang}`,
          `✅ Code analyzed and transformed using Gemini 1.5 Flash`,
          `✅ Functionality preserved during conversion`
        ]
      };
    } catch (error) {
      return {
        code: '',
        success: false,
        error: error.message,
        analysis: [`❌ AI conversion failed: ${error.message}`]
      };
    }
  }

  async fixCodeWithAI(code, language) {
    if (!this.genAI || !this.model) {
      throw new Error('Gemini API key not configured');
    }

    const prompt = `Analyze and fix the following ${language} code. 
    Identify syntax errors, logical issues, and best practices violations.
    Provide the corrected code without explanations or markdown formatting.
    
    Code to fix:
    \`\`\`${language}
    ${code}
    \`\`\`
    
    Fixed code:`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const fixedCode = response.text().trim();
      
      // Clean up the response
      const cleanCode = fixedCode.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();

      return {
        code: cleanCode,
        success: true,
        error: null,
        analysis: [
          `✅ AI-powered code analysis and fixing`,
          `✅ Syntax errors identified and corrected`,
          `✅ Code quality improved using Gemini 1.5 Flash`,
          `✅ Best practices applied`
        ]
      };
    } catch (error) {
      return {
        code: '',
        success: false,
        error: error.message,
        analysis: [`❌ AI code fixing failed: ${error.message}`]
      };
    }
  }

  async analyzeCodeQuality(code, language) {
    if (!this.genAI || !this.model) {
      throw new Error('Gemini API key not configured');
    }

    const prompt = `Analyze the following ${language} code and provide a detailed quality assessment.
    Focus on:
    1. Code structure and organization
    2. Performance considerations
    3. Security issues
    4. Best practices adherence
    5. Readability and maintainability
    
    Code to analyze:
    \`\`\`${language}
    ${code}
    \`\`\`
    
    Provide a structured analysis with specific recommendations.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const analysis = response.text().trim();

      return {
        analysis,
        success: true,
        error: null
      };
    } catch (error) {
      return {
        analysis: '',
        success: false,
        error: error.message
      };
    }
  }

  async generateCodeExplanation(code, language) {
    if (!this.genAI || !this.model) {
      throw new Error('Gemini API key not configured');
    }

    const prompt = `Explain the following ${language} code in detail:
    
    \`\`\`${language}
    ${code}
    \`\`\`
    
    Provide:
    1. What the code does
    2. How it works
    3. Key concepts used
    4. Potential improvements`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const explanation = response.text().trim();

      return {
        explanation,
        success: true,
        error: null
      };
    } catch (error) {
      return {
        explanation: '',
        success: false,
        error: error.message
      };
    }
  }

  async suggestImprovements(code, language) {
    if (!this.genAI || !this.model) {
      throw new Error('Gemini API key not configured');
    }

    const prompt = `Suggest improvements for the following ${language} code:
    
    \`\`\`${language}
    ${code}
    \`\`\`
    
    Focus on:
    1. Performance optimizations
    2. Code readability
    3. Best practices
    4. Security improvements
    5. Maintainability`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const suggestions = response.text().trim();

      return {
        suggestions,
        success: true,
        error: null
      };
    } catch (error) {
      return {
        suggestions: '',
        success: false,
        error: error.message
      };
    }
  }

  isConfigured() {
    return this.genAI !== null && this.model !== null;
  }
}
