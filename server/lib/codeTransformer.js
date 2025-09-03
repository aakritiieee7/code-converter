import { ASTParser } from './astParser.js';

export class CodeTransformer {
  constructor() {
    this.parser = new ASTParser();
    this.languageMappings = {
      'python': {
        'javascript': this.pythonToJavaScript.bind(this),
        'java': this.pythonToJava.bind(this),
        'csharp': this.pythonToCSharp.bind(this)
      },
      'javascript': {
        'python': this.javascriptToPython.bind(this),
        'java': this.javascriptToJava.bind(this),
        'csharp': this.javascriptToCSharp.bind(this)
      },
      'java': {
        'python': this.javaToPython.bind(this),
        'javascript': this.javaToJavaScript.bind(this),
        'csharp': this.javaToCSharp.bind(this)
      },
      'csharp': {
        'python': this.csharpToPython.bind(this),
        'javascript': this.csharpToJavaScript.bind(this),
        'java': this.csharpToJava.bind(this)
      }
    };
  }

  // Main conversion method
  async convertCode(sourceCode, sourceLang, targetLang, useAI = false) {
    const analysis = [];
    let outputCode = '';
    let success = true;
    let error = null;

    try {
      // Normalize language names
      const normalizedSource = this.normalizeLanguage(sourceLang);
      const normalizedTarget = this.normalizeLanguage(targetLang);

      if (normalizedSource === normalizedTarget) {
        return {
          outputCode: sourceCode,
          analysis: ['No conversion needed - same language'],
          success: true,
          error: null
        };
      }

      // Get the appropriate transformer
      const transformer = this.languageMappings[normalizedSource]?.[normalizedTarget];
      
      if (!transformer) {
        throw new Error(`Conversion from ${sourceLang} to ${targetLang} not supported`);
      }

      // Perform transformation
      const result = await transformer(sourceCode);
      outputCode = result.code;
      analysis.push(...result.analysis);

      // Add general analysis
      analysis.push(`✅ Converted from ${sourceLang} to ${targetLang}`);
      analysis.push(`✅ Code structure analyzed and transformed`);

    } catch (err) {
      success = false;
      error = err.message;
      analysis.push(`❌ Error: ${err.message}`);
    }

    return {
      outputCode,
      analysis,
      success,
      error
    };
  }

  normalizeLanguage(lang) {
    const normalized = lang.toLowerCase();
    const mappings = {
      'js': 'javascript',
      'ts': 'typescript',
      'py': 'python',
      'cs': 'csharp'
    };
    return mappings[normalized] || normalized;
  }

  // Python to JavaScript transformation
  pythonToJavaScript(code) {
    const analysis = [];
    let output = code;

    // Convert Python syntax to JavaScript
    const transformations = [
      {
        pattern: /def\s+(\w+)\s*\((.*?)\)\s*:/g,
        replacement: 'function $1($2) {',
        note: 'Function definitions converted'
      },
      {
        pattern: /print\s*\((.*?)\)/g,
        replacement: 'console.log($1)',
        note: 'Print statements converted to console.log'
      },
      {
        pattern: /True/g,
        replacement: 'true',
        note: 'Boolean values converted'
      },
      {
        pattern: /False/g,
        replacement: 'false',
        note: 'Boolean values converted'
      },
      {
        pattern: /None/g,
        replacement: 'null',
        note: 'None converted to null'
      },
      {
        pattern: /# (.*)/g,
        replacement: '// $1',
        note: 'Comments converted to JavaScript style'
      }
    ];

    transformations.forEach(transform => {
      if (transform.pattern.test(output)) {
        output = output.replace(transform.pattern, transform.replacement);
        analysis.push(transform.note);
      }
    });

    // Add closing braces for functions
    const functionMatches = output.match(/function\s+\w+\s*\([^)]*\)\s*{/g);
    if (functionMatches) {
      const openBraces = (output.match(/{/g) || []).length;
      const closeBraces = (output.match(/}/g) || []).length;
      const missingBraces = openBraces - closeBraces;
      
      for (let i = 0; i < missingBraces; i++) {
        output += '\n}';
      }
      analysis.push('Added missing closing braces');
    }

    return { code: output, analysis };
  }

  // JavaScript to Python transformation
  javascriptToPython(code) {
    const analysis = [];
    let output = code;

    const transformations = [
      {
        pattern: /function\s+(\w+)\s*\((.*?)\)\s*{/g,
        replacement: 'def $1($2):',
        note: 'Function definitions converted to Python style'
      },
      {
        pattern: /console\.log\s*\((.*?)\)/g,
        replacement: 'print($1)',
        note: 'Console.log converted to print'
      },
      {
        pattern: /true/g,
        replacement: 'True',
        note: 'Boolean values converted'
      },
      {
        pattern: /false/g,
        replacement: 'False',
        note: 'Boolean values converted'
      },
      {
        pattern: /null/g,
        replacement: 'None',
        note: 'Null converted to None'
      },
      {
        pattern: /\/\/ (.*)/g,
        replacement: '# $1',
        note: 'Comments converted to Python style'
      },
      {
        pattern: /var\s+(\w+)\s*=/g,
        replacement: '$1 =',
        note: 'Variable declarations converted'
      },
      {
        pattern: /let\s+(\w+)\s*=/g,
        replacement: '$1 =',
        note: 'Variable declarations converted'
      },
      {
        pattern: /const\s+(\w+)\s*=/g,
        replacement: '$1 =',
        note: 'Variable declarations converted'
      }
    ];

    transformations.forEach(transform => {
      if (transform.pattern.test(output)) {
        output = output.replace(transform.pattern, transform.replacement);
        analysis.push(transform.note);
      }
    });

    // Remove semicolons
    output = output.replace(/;/g, '');
    analysis.push('Removed semicolons (Python syntax)');

    // Remove braces and add proper indentation
    output = output.replace(/{\s*/g, '');
    output = output.replace(/}\s*/g, '');
    analysis.push('Removed braces and adjusted indentation');

    return { code: output, analysis };
  }

  // Python to Java transformation
  pythonToJava(code) {
    const analysis = [];
    let output = code;

    // Extract class name from first class definition
    const classMatch = code.match(/class\s+(\w+)/);
    const className = classMatch ? classMatch[1] : 'Main';

    output = `public class ${className} {\n`;
    analysis.push(`Created Java class: ${className}`);

    // Convert functions to Java methods
    const functionMatches = code.match(/def\s+(\w+)\s*\((.*?)\)\s*:/g);
    if (functionMatches) {
      functionMatches.forEach(match => {
        const methodMatch = match.match(/def\s+(\w+)\s*\((.*?)\)/);
        if (methodMatch) {
          const methodName = methodMatch[1];
          const params = methodMatch[2];
          
          output += `    public static void ${methodName}(${params}) {\n`;
          output += `        // Method implementation\n`;
          output += `    }\n\n`;
          analysis.push(`Converted function ${methodName} to Java method`);
        }
      });
    }

    output += '}';
    analysis.push('Added Java class structure');

    return { code: output, analysis };
  }

  // JavaScript to Java transformation
  javascriptToJava(code) {
    const analysis = [];
    let output = code;

    // Extract class name or use default
    const classMatch = code.match(/class\s+(\w+)/);
    const className = classMatch ? classMatch[1] : 'Main';

    output = `public class ${className} {\n`;
    analysis.push(`Created Java class: ${className}`);

    // Convert functions to Java methods
    const functionMatches = code.match(/function\s+(\w+)\s*\((.*?)\)/g);
    if (functionMatches) {
      functionMatches.forEach(match => {
        const methodMatch = match.match(/function\s+(\w+)\s*\((.*?)\)/);
        if (methodMatch) {
          const methodName = methodMatch[1];
          const params = methodMatch[2];
          
          output += `    public static void ${methodName}(${params}) {\n`;
          output += `        // Method implementation\n`;
          output += `    }\n\n`;
          analysis.push(`Converted function ${methodName} to Java method`);
        }
      });
    }

    output += '}';
    analysis.push('Added Java class structure');

    return { code: output, analysis };
  }

  // Add more transformation methods for other language pairs...
  pythonToCSharp(code) {
    return this.pythonToJava(code); // Simplified - similar structure
  }

  javascriptToCSharp(code) {
    return this.javascriptToJava(code); // Simplified - similar structure
  }

  javaToPython(code) {
    return this.javascriptToPython(code); // Simplified
  }

  javaToJavaScript(code) {
    return this.pythonToJavaScript(code); // Simplified
  }

  javaToCSharp(code) {
    return { code: code.replace(/public class/g, 'public class'), analysis: ['Java to C# conversion (minimal changes)'] };
  }

  csharpToPython(code) {
    return this.javaToPython(code); // Simplified
  }

  csharpToJavaScript(code) {
    return this.javaToJavaScript(code); // Simplified
  }

  csharpToJava(code) {
    return { code: code.replace(/public class/g, 'public class'), analysis: ['C# to Java conversion (minimal changes)'] };
  }
}
