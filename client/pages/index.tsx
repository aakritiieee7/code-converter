// pages/index.tsx
import { useState } from "react";
import { Select } from "../components/ui/select";
import CodeEditor from "../components/CodeEditor";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Copy, Loader2 } from "lucide-react";

const languages = ["Python", "Java", "JavaScript", "C#", "C++", "Go"];

export default function Home() {
  const [sourceLang, setSourceLang] = useState("Python");
  const [targetLang, setTargetLang] = useState("JavaScript");
  const [sourceCode, setSourceCode] = useState("");
  const [convertedCode, setConvertedCode] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [explanation, setExplanation] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleConvert = async () => {
    setLoading(true);
    setConvertedCode("");
    setAnalysis("");
    setExplanation("");
    setSuggestions("");

    try {
      // mock API call (replace with your backend)
      await new Promise((r) => setTimeout(r, 1500));
      setConvertedCode("// converted code result here...");
      setAnalysis("✅ No major issues detected in source code.");
      setExplanation("This code was successfully translated to the target language.");
      setSuggestions("Consider refactoring loops into functions for clarity.");
    } catch (err) {
      setConvertedCode("// ❌ Error during conversion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-6 py-8">
      {/* Top Language Selector Bar */}
      <div className="flex items-center justify-center gap-6 mb-10">
        <Select value={sourceLang} onValueChange={setSourceLang}>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </Select>
        <span className="text-3xl">→</span>
        <Select value={targetLang} onValueChange={setTargetLang}>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </Select>
      </div>

      {/* Editors Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Code */}
        <Card className="bg-[#1e1e1e] border border-white/10 shadow-lg">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-white">Source Code</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy(sourceCode)}
              className="text-gray-400 hover:text-white"
            >
              <Copy size={18} />
            </Button>
          </CardHeader>
          <CardContent>
            <CodeEditor value={sourceCode} onChange={setSourceCode} language={sourceLang} />
          </CardContent>
        </Card>

        {/* Converted Code */}
        <Card className="bg-[#1e1e1e] border border-white/10 shadow-lg">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-white">Converted Code</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy(convertedCode)}
              className="text-gray-400 hover:text-white"
            >
              <Copy size={18} />
            </Button>
          </CardHeader>
          <CardContent>
            <CodeEditor value={convertedCode} onChange={() => {}} language={targetLang} readOnly />
          </CardContent>
        </Card>
      </div>

      {/* Action Button */}
      <div className="mt-8 flex justify-center">
        <Button
          onClick={handleConvert}
          disabled={loading || !sourceCode}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg text-lg"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} /> Converting...
            </>
          ) : (
            "Analyze & Convert"
          )}
        </Button>
      </div>

      {/* AI Results Section */}
      <div className="mt-10 space-y-6">
        {analysis && (
          <Card className="bg-[#121212] border border-green-600/40">
            <CardHeader>
              <CardTitle className="text-green-400">Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">{analysis}</p>
            </CardContent>
          </Card>
        )}
        {explanation && (
          <Card className="bg-[#121212] border border-blue-600/40">
            <CardHeader>
              <CardTitle className="text-blue-400">Explanation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">{explanation}</p>
            </CardContent>
          </Card>
        )}
        {suggestions && (
          <Card className="bg-[#121212] border border-yellow-600/40">
            <CardHeader>
              <CardTitle className="text-yellow-400">Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">{suggestions}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
