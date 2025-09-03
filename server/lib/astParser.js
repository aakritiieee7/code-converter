import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';
import { Parser } from 'acorn';
import { simple as walk } from 'acorn-walk';

export class ASTParser {
  constructor() {
    this.supportedLanguages = ['javascript', 'typescript', 'python', 'java', 'csharp'];
  }

  // Parse JavaScript/TypeScript code into AST
  parseJavaScript(code, isTypeScript = false) {
    try {
      const ast = parse(code, {
        sourceType: 'module',
        allowImportExportEverywhere: true,
        allowReturnOutsideFunction: true,
        plugins: isTypeScript ? ['typescript', 'jsx'] : ['jsx', 'flow']
      });
      return { ast, success: true, error: null };
    } catch (error) {
      return { ast: null, success: false, error: error.message };
    }
  }

  // Parse Python-like syntax (simplified)
  parsePython(code) {
    const lines = code.split('\n');
    const ast = {
      type: 'Program',
      body: [],
      sourceType: 'script'
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;

      // Simple function detection
      if (trimmed.startsWith('def ')) {
        const match = trimmed.match(/def\s+(\w+)\s*\((.*?)\)/);
        if (match) {
          ast.body.push({
            type: 'FunctionDeclaration',
            id: { type: 'Identifier', name: match[1] },
            params: match[2] ? match[2].split(',').map(p => ({
              type: 'Identifier',
              name: p.trim()
            })) : [],
            body: { type: 'BlockStatement', body: [] }
          });
        }
      }
      // Simple class detection
      else if (trimmed.startsWith('class ')) {
        const match = trimmed.match(/class\s+(\w+)/);
        if (match) {
          ast.body.push({
            type: 'ClassDeclaration',
            id: { type: 'Identifier', name: match[1] },
            body: { type: 'ClassBody', body: [] }
          });
        }
      }
    });

    return { ast, success: true, error: null };
  }

  // Parse Java-like syntax (simplified)
  parseJava(code) {
    const ast = {
      type: 'Program',
      body: [],
      sourceType: 'script'
    };

    // Simple class detection
    const classMatch = code.match(/public\s+class\s+(\w+)/);
    if (classMatch) {
      ast.body.push({
        type: 'ClassDeclaration',
        id: { type: 'Identifier', name: classMatch[1] },
        body: { type: 'ClassBody', body: [] }
      });
    }

    return { ast, success: true, error: null };
  }

  // Generate code from AST
  generateCode(ast, targetLanguage) {
    try {
      if (targetLanguage === 'javascript' || targetLanguage === 'typescript') {
        const output = generate(ast, {
          compact: false,
          comments: true
        });
        return { code: output.code, success: true, error: null };
      }
      
      // For other languages, we'll use a simple transformation
      return this.transformASTToString(ast, targetLanguage);
    } catch (error) {
      return { code: '', success: false, error: error.message };
    }
  }

  // Transform AST to string representation for non-JS languages
  transformASTToString(ast, targetLanguage) {
    let code = '';
    
    if (targetLanguage === 'python') {
      code = this.astToPython(ast);
    } else if (targetLanguage === 'java') {
      code = this.astToJava(ast);
    } else if (targetLanguage === 'csharp') {
      code = this.astToCSharp(ast);
    }

    return { code, success: true, error: null };
  }

  astToPython(ast) {
    let code = '';
    
    ast.body.forEach(node => {
      if (node.type === 'FunctionDeclaration') {
        code += `def ${node.id.name}(${node.params.map(p => p.name).join(', ')}):\n`;
        code += '    pass\n\n';
      } else if (node.type === 'ClassDeclaration') {
        code += `class ${node.id.name}:\n`;
        code += '    pass\n\n';
      }
    });

    return code;
  }

  astToJava(ast) {
    let code = '';
    
    ast.body.forEach(node => {
      if (node.type === 'ClassDeclaration') {
        code += `public class ${node.id.name} {\n`;
        code += '    // Class implementation\n';
        code += '}\n\n';
      }
    });

    return code;
  }

  astToCSharp(ast) {
    let code = '';
    
    ast.body.forEach(node => {
      if (node.type === 'ClassDeclaration') {
        code += `public class ${node.id.name}\n`;
        code += '{\n';
        code += '    // Class implementation\n';
        code += '}\n\n';
      }
    });

    return code;
  }

  // Analyze code structure and extract metadata
  analyzeCode(ast) {
    const analysis = {
      functions: [],
      classes: [],
      imports: [],
      variables: [],
      complexity: 0
    };

    if (!ast || !ast.body) return analysis;

    ast.body.forEach(node => {
      if (node.type === 'FunctionDeclaration') {
        analysis.functions.push({
          name: node.id.name,
          params: node.params.length,
          line: node.loc?.start?.line || 0
        });
      } else if (node.type === 'ClassDeclaration') {
        analysis.classes.push({
          name: node.id.name,
          line: node.loc?.start?.line || 0
        });
      } else if (node.type === 'ImportDeclaration') {
        analysis.imports.push(node.source.value);
      }
    });

    analysis.complexity = analysis.functions.length + analysis.classes.length;
    return analysis;
  }
}
