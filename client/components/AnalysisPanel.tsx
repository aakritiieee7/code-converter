import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface AnalysisPanelProps {
  analysis: string[];
  qualityMetrics?: {
    linesOfCode: number;
    functions: number;
    classes: number;
    complexity: number;
    readability: string;
  };
  loading?: boolean;
  onCopyAnalysis?: () => void;
}

export default function AnalysisPanel({ analysis, qualityMetrics, loading, onCopyAnalysis }: AnalysisPanelProps) {
  const categorized = React.useMemo(() => {
    const result = { errors: [] as string[], warnings: [] as string[], suggestions: [] as string[], successes: [] as string[] };
    (analysis || []).forEach(item => {
      if (item.startsWith('❌') || /Error:/i.test(item)) result.errors.push(item);
      else if (item.startsWith('⚠️')) result.warnings.push(item);
      else if (item.startsWith('💡')) result.suggestions.push(item);
      else result.successes.push(item);
    });
    return result;
  }, [analysis]);

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-400"></div>
            <span className="text-white/70">Analyzing code...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const copyText = () => {
    const text = (analysis || []).join('\n');
    navigator.clipboard.writeText(text);
    onCopyAnalysis?.();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Analysis</CardTitle>
          <Button size="sm" variant="outline" onClick={copyText}>Copy</Button>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-white/80 font-medium">Errors & Warnings</h4>
              <div className="max-h-48 overflow-auto space-y-2 text-sm">
                {categorized.errors.length === 0 && categorized.warnings.length === 0 ? (
                  <p className="text-white/60">No errors detected.</p>
                ) : (
                  <>
                    {categorized.errors.map((item, idx) => (
                      <div key={`e-${idx}`} className="flex items-start gap-2"><span>❌</span><span>{item.replace(/^❌\s*/, '')}</span></div>
                    ))}
                    {categorized.warnings.map((item, idx) => (
                      <div key={`w-${idx}`} className="flex items-start gap-2"><span>⚠️</span><span>{item.replace(/^⚠️\s*/, '')}</span></div>
                    ))}
                  </>
                )}
              </div>
              <h4 className="text-white/80 font-medium">Fixes & Suggestions</h4>
              <div className="max-h-48 overflow-auto space-y-2 text-sm">
                {categorized.suggestions.length === 0 && categorized.successes.length === 0 ? (
                  <p className="text-white/60">No suggestions yet.</p>
                ) : (
                  <>
                    {categorized.successes.map((item, idx) => (
                      <div key={`s-${idx}`} className="flex items-start gap-2"><span>✅</span><span>{item.replace(/^✅\s*/, '')}</span></div>
                    ))}
                    {categorized.suggestions.map((item, idx) => (
                      <div key={`i-${idx}`} className="flex items-start gap-2"><span>💡</span><span>{item.replace(/^💡\s*/, '')}</span></div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {qualityMetrics && (
              <div>
                <h4 className="text-white/80 font-medium">Quality Metrics</h4>
                <div className="grid grid-cols-2 gap-3 text-sm mt-2">
                  <div className="flex justify-between"><span className="text-white/70">Lines of Code</span><span>{qualityMetrics.linesOfCode}</span></div>
                  <div className="flex justify-between"><span className="text-white/70">Functions</span><span>{qualityMetrics.functions}</span></div>
                  <div className="flex justify-between"><span className="text-white/70">Classes</span><span>{qualityMetrics.classes}</span></div>
                  <div className="flex justify-between"><span className="text-white/70">Complexity</span><span>{qualityMetrics.complexity}</span></div>
                  <div className="flex justify-between"><span className="text-white/70">Readability</span><span className="px-2 py-0.5 rounded bg-white/10">{qualityMetrics.readability}</span></div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
