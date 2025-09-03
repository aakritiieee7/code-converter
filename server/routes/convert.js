import { Router } from 'express';
import { supabase, isSupabaseConfigured } from '../supabase.js';
import { CodeTransformer } from '../lib/codeTransformer.js';
import { CodeAnalyzer } from '../lib/codeAnalyzer.js';
import { GeminiService } from '../lib/geminiService.js';

const router = Router();

const TABLE = process.env.SUPABASE_TABLE || 'history';

// Initialize services
const codeTransformer = new CodeTransformer();
const codeAnalyzer = new CodeAnalyzer();
const geminiService = new GeminiService();

async function saveHistory({ sourceLang, targetLang = null, inputCode, outputCode, analysisSummary, useAI = false }) {
  if (!isSupabaseConfigured()) {
    console.log('Supabase not configured, skipping history save');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({ 
        sourceLang, 
        targetLang, 
        inputCode, 
        outputCode, 
        analysisSummary,
        useAI: useAI || false
      })
      .select();
    if (error) throw error;
    return data?.[0];
  } catch (e) {
    console.error('Supabase insert error:', e.message);
    return null;
  }
}

// Enhanced conversion endpoint
router.post('/convert', async (req, res) => {
  const { sourceLang, targetLang, inputCode, useAI = false } = req.body || {};
  
  if (!sourceLang || !targetLang || !inputCode) {
    return res.status(400).json({ error: 'sourceLang, targetLang, inputCode required' });
  }

  try {
    let result;
    
    if (useAI && geminiService.isConfigured()) {
      // Use AI-powered conversion with Gemini
      result = await geminiService.convertCodeWithAI(inputCode, sourceLang, targetLang);
    } else {
      // Use rule-based transformation
      result = await codeTransformer.convertCode(inputCode, sourceLang, targetLang);
    }

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    // Perform additional analysis
    const syntaxAnalysis = codeAnalyzer.analyzeSyntax(result.outputCode, targetLang);
    const qualityMetrics = codeAnalyzer.generateQualityMetrics(result.outputCode, targetLang);

    // Combine analysis results
    const combinedAnalysis = [
      ...result.analysis,
      `✅ Code quality: ${qualityMetrics.readability}`,
      `✅ Lines of code: ${qualityMetrics.linesOfCode}`,
      `✅ Functions: ${qualityMetrics.functions}`,
      `✅ Classes: ${qualityMetrics.classes}`,
      ...syntaxAnalysis.warnings.map(w => `⚠️ ${w}`),
      ...syntaxAnalysis.suggestions.map(s => `💡 ${s}`)
    ];

    // Save to history
    const saved = await saveHistory({ 
      sourceLang, 
      targetLang, 
      inputCode, 
      outputCode: result.outputCode, 
      analysisSummary: combinedAnalysis,
      useAI
    });

    res.json({ 
      outputCode: result.outputCode, 
      analysis: combinedAnalysis, 
      id: saved?.id,
      useAI,
      qualityMetrics
    });

  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Enhanced code fixing endpoint
router.post('/fix', async (req, res) => {
  const { language, inputCode, useAI = false } = req.body || {};
  
  if (!language || !inputCode) {
    return res.status(400).json({ error: 'language, inputCode required' });
  }

  try {
    let result;
    
    if (useAI && geminiService.isConfigured()) {
      // Use AI-powered fixing with Gemini
      result = await geminiService.fixCodeWithAI(inputCode, language);
    } else {
      // Use rule-based fixing
      const syntaxAnalysis = codeAnalyzer.analyzeSyntax(inputCode, language);
      const fixResult = codeAnalyzer.fixSyntaxErrors(inputCode, language);
      
      result = {
        code: fixResult.code,
        success: true,
        error: null,
        analysis: [
          `✅ Syntax analysis completed`,
          `✅ Found ${syntaxAnalysis.errors.length} errors`,
          `✅ Found ${syntaxAnalysis.warnings.length} warnings`,
          ...fixResult.fixes.map(f => `✅ ${f}`),
          ...syntaxAnalysis.warnings.map(w => `⚠️ ${w}`),
          ...syntaxAnalysis.suggestions.map(s => `💡 ${s}`)
        ]
      };
    }

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    // Perform quality analysis on fixed code
    const qualityMetrics = codeAnalyzer.generateQualityMetrics(result.code, language);

    // Combine analysis results
    const combinedAnalysis = [
      ...result.analysis,
      `✅ Code quality: ${qualityMetrics.readability}`,
      `✅ Lines of code: ${qualityMetrics.linesOfCode}`,
      `✅ Functions: ${qualityMetrics.functions}`,
      `✅ Classes: ${qualityMetrics.classes}`
    ];

    // Save to history
    const saved = await saveHistory({ 
      sourceLang: language, 
      targetLang: null, 
      inputCode, 
      outputCode: result.code, 
      analysisSummary: combinedAnalysis,
      useAI
    });

    res.json({ 
      outputCode: result.code, 
      analysis: combinedAnalysis, 
      id: saved?.id,
      useAI,
      qualityMetrics
    });

  } catch (error) {
    console.error('Code fixing error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Enhanced analysis endpoint
router.post('/analyze', async (req, res) => {
  const { language, inputCode, useAI = false } = req.body || {};
  
  if (!language || !inputCode) {
    return res.status(400).json({ error: 'language, inputCode required' });
  }

  try {
    let analysis;
    
    if (useAI && geminiService.isConfigured()) {
      // Use AI-powered analysis with Gemini
      const aiResult = await geminiService.analyzeCodeQuality(inputCode, language);
      analysis = aiResult.analysis;
    } else {
      // Use rule-based analysis
      const syntaxAnalysis = codeAnalyzer.analyzeSyntax(inputCode, language);
      const qualityMetrics = codeAnalyzer.generateQualityMetrics(inputCode, language);
      
      analysis = [
        `📊 Code Analysis Report`,
        `📏 Lines of code: ${qualityMetrics.linesOfCode}`,
        `🔧 Functions: ${qualityMetrics.functions}`,
        `🏗️ Classes: ${qualityMetrics.classes}`,
        `📈 Complexity: ${qualityMetrics.complexity}`,
        `📖 Readability: ${qualityMetrics.readability}`,
        ...syntaxAnalysis.errors.map(e => `❌ Error: ${e}`),
        ...syntaxAnalysis.warnings.map(w => `⚠️ Warning: ${w}`),
        ...syntaxAnalysis.suggestions.map(s => `💡 Suggestion: ${s}`)
      ].join('\n');
    }

    res.json({ analysis });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

// New endpoint for code explanation
router.post('/explain', async (req, res) => {
  const { language, inputCode, useAI = false } = req.body || {};
  
  if (!language || !inputCode) {
    return res.status(400).json({ error: 'language, inputCode required' });
  }

  try {
    let explanation;
    
    if (useAI && geminiService.isConfigured()) {
      const result = await geminiService.generateCodeExplanation(inputCode, language);
      explanation = result.explanation;
    } else {
      explanation = 'AI explanation not available. Please configure Gemini API key.';
    }

    res.json({ explanation });

  } catch (error) {
    console.error('Explanation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// New endpoint for improvement suggestions
router.post('/suggest', async (req, res) => {
  const { language, inputCode, useAI = false } = req.body || {};
  
  if (!language || !inputCode) {
    return res.status(400).json({ error: 'language, inputCode required' });
  }

  try {
    let suggestions;
    
    if (useAI && geminiService.isConfigured()) {
      const result = await geminiService.suggestImprovements(inputCode, language);
      suggestions = result.suggestions;
    } else {
      suggestions = 'AI suggestions not available. Please configure Gemini API key.';
    }

    res.json({ suggestions });

  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ error: error.message });
  }
});

// History endpoint
router.get('/history', async (_req, res) => {
  if (!isSupabaseConfigured()) {
    return res.json({ items: [], message: 'Supabase not configured' });
  }

  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    res.json({ items: data || [] });
  } catch (e) {
    console.error('Supabase select error:', e.message);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({ 
    status: 'healthy',
    services: {
      gemini: geminiService.isConfigured(),
      supabase: isSupabaseConfigured(),
      transformer: !!codeTransformer,
      analyzer: !!codeAnalyzer
    }
  });
});

export default router;
