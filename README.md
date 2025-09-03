# ⚡ Code Converter AI - Powered by Google Gemini

A sophisticated full-stack application for AI-powered code conversion, analysis, and fixing. Built with Next.js, Express, Supabase, and Google Gemini AI.

## 🚀 Features

### Core Functionality
- **Multi-language Conversion**: Python ↔ Java, JavaScript ↔ C#, and more
- **AI-Powered Analysis**: Google Gemini 1.5 Flash integration for advanced code understanding
- **Syntax Error Detection**: Automated fixing with detailed analysis
- **Code Quality Metrics**: Complexity analysis, readability assessment
- **Real-time Syntax Highlighting**: Monaco Editor with language-specific highlighting
- **Conversion History**: Persistent storage with Supabase integration

### Advanced AI Features (Powered by Gemini)
- **Intelligent Code Conversion**: Context-aware language translation
- **Smart Code Fixing**: AI-powered error detection and correction
- **Code Explanation**: Detailed explanations of how code works
- **Improvement Suggestions**: AI recommendations for better code quality
- **Quality Analysis**: Comprehensive code assessment with actionable insights

### Professional Features
- **AST-based Transformation**: Compiler principles for accurate code conversion
- **Rule-based Fallback**: Works without AI when Gemini is not configured
- **Batch Analysis**: Comprehensive code quality assessment
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works on desktop and mobile

## 🏗️ Architecture

### Frontend (Next.js + TypeScript)
- **Pages Router**: Landing page, converter, history
- **Monaco Editor**: Professional code editing experience
- **Tailwind CSS**: Modern, responsive styling
- **Framer Motion**: Smooth animations and transitions
- **shadcn/ui**: Consistent component library

### Backend (Express + Node.js)
- **REST API**: `/api/convert`, `/api/fix`, `/api/analyze`, `/api/explain`, `/api/suggest`, `/api/history`
- **AST Parser**: Babel-based JavaScript/TypeScript parsing
- **Code Transformer**: Rule-based language conversion
- **Gemini Integration**: Google Gemini 1.5 Flash powered code analysis
- **Supabase**: Persistent history storage

### Database (Supabase)
- **History Table**: Stores all conversions and fixes
- **Real-time**: Optional real-time updates
- **Row Level Security**: Secure data access

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Babel, Acorn
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini 1.5 Flash
- **Editor**: Monaco Editor
- **Animations**: Framer Motion

## 📋 Prerequisites

- Node.js 18+
- Supabase account and project
- Google AI Studio API key (for Gemini features)

## 🗄️ Database Setup

Create a table named `history` in your Supabase project:

```sql
create table if not exists public.history (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  "sourceLang" text not null,
  "targetLang" text null,
  "inputCode" text not null,
  "outputCode" text not null,
  "analysisSummary" text[] not null,
  "useAI" boolean default false
);
```

## 🔧 Environment Variables

### Client (`client/.env.local`)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Server (`server/.env`)
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_TABLE=history
```

## 🚀 Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

1. Copy the environment files:
   ```bash
   cp client/.env.local.example client/.env.local
   cp server/.env.example server/.env
   ```

2. Add your Supabase credentials to both files
3. Add your Gemini API key to `server/.env`

### 3. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 4. Access the Application

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 API Keys Setup

### Google Gemini API Key (Required for AI Features)
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Add it to `server/.env` as `GEMINI_API_KEY=your_key_here`
4. AI features will be automatically enabled

### Supabase Setup
1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Get your project URL and anon key from Settings > API
4. For server-side operations, use the service role key (keep it secure)

## 📚 API Endpoints

### POST `/api/convert`
Convert code between languages using AI or rule-based methods.

**Request:**
```json
{
  "sourceLang": "Python",
  "targetLang": "JavaScript",
  "inputCode": "def hello(): print('Hello')",
  "useAI": true
}
```

**Response:**
```json
{
  "outputCode": "function hello() { console.log('Hello'); }",
  "analysis": ["✅ AI-powered conversion from Python to JavaScript", "..."],
  "qualityMetrics": {
    "linesOfCode": 1,
    "functions": 1,
    "classes": 0,
    "complexity": 1,
    "readability": "simple"
  }
}
```

### POST `/api/fix`
Fix syntax errors and improve code quality.

### POST `/api/analyze`
Analyze code quality and provide recommendations.

### POST `/api/explain` (New - AI Only)
Get detailed explanation of how the code works.

### POST `/api/suggest` (New - AI Only)
Get AI-powered improvement suggestions.

### GET `/api/history`
Retrieve conversion history.

### GET `/api/health`
Check service status and configuration.

## 🎯 Usage Examples

### Basic Conversion
1. Select source language (e.g., Python)
2. Select target language (e.g., JavaScript)
3. Paste your code
4. Enable "Use Gemini AI" toggle
5. Click "Convert"
6. View the converted code and analysis

### AI-Powered Analysis
1. Enable "Use Gemini AI" toggle (requires Gemini API key)
2. Paste your code
3. Click "Analyze" for quality assessment
4. Click "Explain" for code explanation
5. Click "Get AI Suggestions" for improvements

### Code Fixing
1. Paste code with syntax errors
2. Enable AI mode for advanced fixing
3. Click "Check & Fix"
4. Review the fixes and analysis
5. Click "Accept Fix" to apply changes

## 🔧 Development

### Project Structure
```
cursor-conver/
├── client/                 # Next.js frontend
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── CodeEditor.tsx # Monaco Editor wrapper
│   │   └── AnalysisPanel.tsx
│   ├── pages/             # Next.js pages
│   ├── lib/               # Utilities and Supabase client
│   └── styles/            # Global styles
├── server/                # Express backend
│   ├── lib/               # Core libraries
│   │   ├── astParser.js   # AST parsing logic
│   │   ├── codeTransformer.js # Language conversion
│   │   ├── geminiService.js   # Gemini AI integration
│   │   └── codeAnalyzer.js    # Code analysis
│   ├── routes/            # API routes
│   └── index.js           # Express server
└── README.md
```

### Adding New Languages
1. Update `languages` array in frontend
2. Add transformation methods in `CodeTransformer`
3. Add analysis rules in `CodeAnalyzer`
4. Update Monaco Editor language mappings

### Extending AI Features
1. Modify prompts in `GeminiService`
2. Add new analysis types
3. Implement custom AI models
4. Add batch processing capabilities

## 🐛 Troubleshooting

### Common Issues

**Monaco Editor not loading:**
- Ensure all dependencies are installed
- Check browser console for errors
- Verify Next.js configuration

**Supabase connection errors:**
- Verify environment variables
- Check Supabase project status
- Ensure table exists with correct schema

**Gemini API errors:**
- Verify API key is correct
- Check API quota and billing
- Ensure model access permissions

**Conversion not working:**
- Check server logs for errors
- Verify language names match exactly
- Test with simple code examples

## 📈 Performance

- **Frontend**: Optimized with Next.js 14, code splitting
- **Backend**: Efficient AST parsing, caching for repeated conversions
- **Database**: Indexed queries, pagination for history
- **AI**: Rate limiting, error handling, fallback to rule-based

## 🔒 Security

- Environment variables for sensitive data
- Supabase Row Level Security
- Input validation and sanitization
- CORS configuration
- API rate limiting (recommended for production)

## 🚀 Deployment

### Vercel (Frontend)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Railway/Heroku (Backend)
1. Connect repository
2. Set environment variables
3. Deploy with automatic builds

### Supabase (Database)
- Already hosted, just configure environment variables

## 📄 License

MIT License - feel free to use and modify for your projects.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review server logs
- Test with minimal examples
- Open an issue on GitHub

---

**Built with ❤️ using Google Gemini AI and modern web technologies**
