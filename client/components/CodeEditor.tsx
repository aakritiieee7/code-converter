import React, { useRef } from 'react';
import { Editor } from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  height?: string;
  readOnly?: boolean;
  placeholder?: string;
  fontSize?: number;
}

export default function CodeEditor({ 
  value, 
  onChange, 
  language, 
  height = '440px',
  readOnly = false,
  placeholder = 'Enter your code here...',
  fontSize = 16
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;

    editor.updateOptions({
      fontSize,
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      minimap: { enabled: false },
      wordWrap: 'on',
      theme: 'vs-dark'
    });

    if (!value && placeholder) {
      editor.setValue(placeholder);
      editor.setSelection(editor.getModel()?.getFullModelRange());
    }
  };

  const handleEditorChange = (val: string | undefined) => {
    if (val !== undefined) onChange(val);
  };

  const getMonacoLanguage = (lang: string) => {
    const mappings: { [key: string]: string } = {
      'JavaScript': 'javascript',
      'TypeScript': 'typescript',
      'Python': 'python',
      'Java': 'java',
      'C#': 'csharp'
    };
    return mappings[lang] || 'plaintext';
  };

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden shadow-lg">
      <Editor
        height={height}
        language={getMonacoLanguage(language)}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          selectOnLineNumbers: true,
          renderLineHighlight: 'line',
          cursorStyle: 'line',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          fontSize,
          lineNumbers: 'on',
          minimap: { enabled: false },
          wordWrap: 'on',
          theme: 'vs-dark',
          padding: { top: 18, bottom: 18 }
        }}
      />
    </div>
  );
}
