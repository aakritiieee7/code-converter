export class CodeAnalyzer {
  constructor() {
    this.supportedLanguages = ['javascript', 'typescript', 'python', 'java', 'csharp'];
  }

  // Analyze code for syntax errors and issues
  analyzeSyntax(code, language) {
    const analysis = {
      errors: [],
      warnings: [],
      suggestions: [],
      metrics: {
        linesOfCode: 0,
        complexity: 0,
        functions: 0,
        classes: 0
      }
    };

    const lines = code.split('\n');
    analysis.metrics.linesOfCode = lines.length;

    switch (language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        return this.analyzeJavaScript(code, analysis);
      case 'python':
        return this.analyzePython(code, analysis);
      case 'java':
        return this.analyzeJava(code, analysis);
      case 'csharp':
        return this.analyzeCSharp(code, analysis);
      default:
        analysis.errors.push(`Unsupported language: ${language}`);
        return analysis;
    }
  }

  analyzeJavaScript(code, analysis) {
    // Check for common JavaScript issues
    const issues = [
      {
        pattern: /console\.log\(/g,
        type: 'warning',
        message: 'Console.log statements found - consider removing for production'
      },
      {
        pattern: /var\s+/g,
        type: 'suggestion',
        message: 'Consider using let or const instead of var'
      },
      {
        pattern: /==/g,
        type: 'warning',
        message: 'Consider using === instead of == for strict equality'
      },
      {
        pattern: /function\s+(\w+)/g,
        type: 'info',
        message: 'Function declarations found'
      }
    ];

    issues.forEach(issue => {
      const matches = code.match(issue.pattern);
      if (matches) {
        if (issue.type === 'error') {
          analysis.errors.push(issue.message);
        } else if (issue.type === 'warning') {
          analysis.warnings.push(issue.message);
        } else if (issue.type === 'suggestion') {
          analysis.suggestions.push(issue.message);
        }
      }
    });

    // Count functions and classes
    analysis.metrics.functions = (code.match(/function\s+\w+/g) || []).length;
    analysis.metrics.classes = (code.match(/class\s+\w+/g) || []).length;

    return analysis;
  }

  analyzePython(code, analysis) {
    const issues = [
      {
        pattern: /print\s*\(/g,
        type: 'warning',
        message: 'Print statements found - consider using logging for production'
      },
      {
        pattern: /def\s+(\w+)/g,
        type: 'info',
        message: 'Function definitions found'
      },
      {
        pattern: /class\s+(\w+)/g,
        type: 'info',
        message: 'Class definitions found'
      },
      {
        pattern: /import\s+\*/g,
        type: 'warning',
        message: 'Wildcard imports found - consider specific imports'
      }
    ];

    issues.forEach(issue => {
      const matches = code.match(issue.pattern);
      if (matches) {
        if (issue.type === 'error') {
          analysis.errors.push(issue.message);
        } else if (issue.type === 'warning') {
          analysis.warnings.push(issue.message);
        } else if (issue.type === 'suggestion') {
          analysis.suggestions.push(issue.message);
        }
      }
    });

    // Count functions and classes
    analysis.metrics.functions = (code.match(/def\s+\w+/g) || []).length;
    analysis.metrics.classes = (code.match(/class\s+\w+/g) || []).length;

    return analysis;
  }

  analyzeJava(code, analysis) {
    const issues = [
      {
        pattern: /System\.out\.print/g,
        type: 'warning',
        message: 'System.out.print statements found - consider using logging'
      },
      {
        pattern: /public\s+class\s+(\w+)/g,
        type: 'info',
        message: 'Public class definitions found'
      },
      {
        pattern: /public\s+static\s+void\s+main/g,
        type: 'info',
        message: 'Main method found'
      }
    ];

    issues.forEach(issue => {
      const matches = code.match(issue.pattern);
      if (matches) {
        if (issue.type === 'error') {
          analysis.errors.push(issue.message);
        } else if (issue.type === 'warning') {
          analysis.warnings.push(issue.message);
        } else if (issue.type === 'suggestion') {
          analysis.suggestions.push(issue.message);
        }
      }
    });

    analysis.metrics.functions = (code.match(/public\s+\w+\s+\w+\s*\(/g) || []).length;
    analysis.metrics.classes = (code.match(/public\s+class\s+\w+/g) || []).length;

    return analysis;
  }

  analyzeCSharp(code, analysis) {
    const issues = [
      {
        pattern: /Console\.Write/g,
        type: 'warning',
        message: 'Console.Write statements found - consider using logging'
      },
      {
        pattern: /public\s+class\s+(\w+)/g,
        type: 'info',
        message: 'Public class definitions found'
      },
      {
        pattern: /static\s+void\s+Main/g,
        type: 'info',
        message: 'Main method found'
      }
    ];

    issues.forEach(issue => {
      const matches = code.match(issue.pattern);
      if (matches) {
        if (issue.type === 'error') {
          analysis.errors.push(issue.message);
        } else if (issue.type === 'warning') {
          analysis.warnings.push(issue.message);
        } else if (issue.type === 'suggestion') {
          analysis.suggestions.push(issue.message);
        }
      }
    });

    analysis.metrics.functions = (code.match(/public\s+\w+\s+\w+\s*\(/g) || []).length;
    analysis.metrics.classes = (code.match(/public\s+class\s+\w+/g) || []).length;

    return analysis;
  }

  // Fix common syntax errors
  fixSyntaxErrors(code, language) {
    let fixedCode = code;
    const fixes = [];

    switch (language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        return this.fixJavaScriptErrors(fixedCode, fixes);
      case 'python':
        return this.fixPythonErrors(fixedCode, fixes);
      case 'java':
        return this.fixJavaErrors(fixedCode, fixes);
      case 'csharp':
        return this.fixCSharpErrors(fixedCode, fixes);
      default:
        return { code: fixedCode, fixes: ['Unsupported language for fixing'] };
    }
  }

  fixJavaScriptErrors(code, fixes) {
    let fixedCode = code;

    // Add missing semicolons
    const lines = fixedCode.split('\n');
    const fixedLines = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.endsWith(';') && !trimmed.endsWith('{') && !trimmed.endsWith('}') && !trimmed.startsWith('//') && !trimmed.startsWith('/*')) {
        if (!/(if|for|while|switch|function|class)\s*\(/.test(trimmed)) {
          return line + ';';
        }
      }
      return line;
    });

    if (fixedLines.join('\n') !== fixedCode) {
      fixedCode = fixedLines.join('\n');
      fixes.push('Added missing semicolons');
    }

    return { code: fixedCode, fixes };
  }

  fixPythonErrors(code, fixes) {
    let fixedCode = code;

    // Add missing colons
    const lines = fixedCode.split('\n');
    const fixedLines = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed && /^(def|class|if|for|while|elif|else)\s+\w+/.test(trimmed) && !trimmed.endsWith(':')) {
        return line + ':';
      }
      return line;
    });

    if (fixedLines.join('\n') !== fixedCode) {
      fixedCode = fixedLines.join('\n');
      fixes.push('Added missing colons for Python blocks');
    }

    return { code: fixedCode, fixes };
  }

  fixJavaErrors(code, fixes) {
    let fixedCode = code;

    // Add missing semicolons
    const lines = fixedCode.split('\n');
    const fixedLines = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.endsWith(';') && !trimmed.endsWith('{') && !trimmed.endsWith('}') && !trimmed.startsWith('//')) {
        if (!/(if|for|while|switch|public|private|protected)\s*\(/.test(trimmed)) {
          return line + ';';
        }
      }
      return line;
    });

    if (fixedLines.join('\n') !== fixedCode) {
      fixedCode = fixedLines.join('\n');
      fixes.push('Added missing semicolons');
    }

    return { code: fixedCode, fixes };
  }

  fixCSharpErrors(code, fixes) {
    // Similar to Java fixes
    return this.fixJavaErrors(code, fixes);
  }

  // Generate quality metrics
  generateQualityMetrics(code, language) {
    const metrics = {
      linesOfCode: code.split('\n').length,
      characters: code.length,
      functions: 0,
      classes: 0,
      complexity: 0,
      readability: 'good'
    };

    // Count functions and classes based on language
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        metrics.functions = (code.match(/function\s+\w+/g) || []).length;
        metrics.classes = (code.match(/class\s+\w+/g) || []).length;
        break;
      case 'python':
        metrics.functions = (code.match(/def\s+\w+/g) || []).length;
        metrics.classes = (code.match(/class\s+\w+/g) || []).length;
        break;
      case 'java':
      case 'csharp':
        metrics.functions = (code.match(/public\s+\w+\s+\w+\s*\(/g) || []).length;
        metrics.classes = (code.match(/public\s+class\s+\w+/g) || []).length;
        break;
    }

    metrics.complexity = metrics.functions + metrics.classes;

    // Simple readability assessment
    if (metrics.linesOfCode > 100) {
      metrics.readability = 'complex';
    } else if (metrics.linesOfCode > 50) {
      metrics.readability = 'moderate';
    } else {
      metrics.readability = 'simple';
    }

    return metrics;
  }
}
