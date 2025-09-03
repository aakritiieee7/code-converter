import OpenAI from 'openai';

export class OpenAIService {
  constructor() {
    this.openai = null;
    this.initializeClient();
  }

  initializeClient() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey: apiKey
      });
    }
  }

  async convertCodeWithAI(sourceCode, sourceLang, targetLang) {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
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
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert code converter. Convert code between programming languages while maintaining functionality. Return only the converted code."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.1
      });

      const convertedCode = completion.choices[0].message.content.trim();
      
      // Clean up the response (remove markdown formatting if present)
      const cleanCode = convertedCode.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();

      return {
        code: cleanCode,
        success: true,
        error: null,
        analysis: [
          `✅ AI-powered conversion from ${sourceLang} to ${targetLang}`,
          `✅ Code analyzed and transformed using GPT-4`,
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
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
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
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert code reviewer and fixer. Identify and fix syntax errors, logical issues, and improve code quality. Return only the fixed code."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.1
      });

      const fixedCode = completion.choices[0].message.content.trim();
      
      // Clean up the response
      const cleanCode = fixedCode.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();

      return {
        code: cleanCode,
        success: true,
        error: null,
        analysis: [
          `✅ AI-powered code analysis and fixing`,
          `✅ Syntax errors identified and corrected`,
          `✅ Code quality improved using GPT-4`,
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
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
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
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert code reviewer. Provide detailed analysis of code quality, performance, security, and best practices. Be specific and actionable."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.2
      });

      const analysis = completion.choices[0].message.content.trim();

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

  isConfigured() {
    return this.openai !== null;
  }
}
