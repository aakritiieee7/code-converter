import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import CodeEditor from '../components/CodeEditor';

interface HistoryItem {
  id: string;
  created_at?: string;
  timestamp?: string;
  sourceLang: string;
  targetLang: string | null;
  inputCode: string;
  outputCode: string;
  analysisSummary: string[];
  useAI?: boolean;
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${apiBase}/api/history`);
        setItems(res.data.items || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <Head>
        <title>History - Code Converter AI</title>
      </Head>
      <main className="container py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Conversion History</h1>
          <Link href="/">
            <Button variant="outline">Back to Converter</Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
            <span className="ml-2 text-white/70">Loading history...</span>
          </div>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-white/70">No conversion history found.</p>
              <Link href="/">
                <Button className="mt-4">Start Converting</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {items.map((item) => (
              <Card key={item.id} className="hover:bg-white/5 transition-colors">
                <CardHeader>
                  <CardTitle className="flex gap-2 items-center justify-between">
                    <div className="flex gap-2 items-center">
                      <span className="text-white/70 text-sm">
                        {new Date(item.created_at || item.timestamp || Date.now()).toLocaleString()}
                      </span>
                      <span className="text-xs bg-white/10 px-2 py-0.5 rounded">{item.sourceLang}</span>
                      {item.targetLang ? (
                        <>
                          <span className="text-xs">→</span>
                          <span className="text-xs bg-white/10 px-2 py-0.5 rounded">{item.targetLang}</span>
                        </>
                      ) : (
                        <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded">Fix</span>
                      )}
                      {item.useAI && (
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">AI</span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                    >
                      {selectedItem?.id === item.id ? 'Hide' : 'View'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                
                {selectedItem?.id === item.id && (
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-white/70 mb-2">Input Code</h4>
                        <CodeEditor
                          value={item.inputCode}
                          onChange={() => {}}
                          language={item.sourceLang}
                          height="200px"
                          readOnly
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white/70 mb-2">Output Code</h4>
                        <CodeEditor
                          value={item.outputCode}
                          onChange={() => {}}
                          language={item.targetLang || item.sourceLang}
                          height="200px"
                          readOnly
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-white/70 mb-2">Analysis</h4>
                      <div className="bg-black/40 rounded-lg p-3 max-h-32 overflow-auto">
                        <div className="space-y-1 text-sm">
                          {(item.analysisSummary || []).map((analysis, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="flex-shrink-0 mt-0.5">
                                {analysis.startsWith('✅') ? '✅' : 
                                 analysis.startsWith('⚠️') ? '⚠️' : 
                                 analysis.startsWith('💡') ? '💡' : 
                                 analysis.startsWith('❌') ? '❌' : '•'}
                              </span>
                              <span className="text-white/90">{analysis.replace(/^[✅⚠️💡❌•]\s*/, '')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
