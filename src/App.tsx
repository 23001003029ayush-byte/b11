import { useState } from 'react';
import { Upload, BarChart3, BookOpen, GraduationCap, Home } from 'lucide-react';
import { Homepage } from './components/Homepage';
import { UploadPaper } from './components/UploadPaper';
import { Analytics } from './components/Analytics';
import { Browse } from './components/Browse';

type View = 'home' | 'upload' | 'analytics' | 'browse';

function App() {
  const [activeView, setActiveView] = useState<View>('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => setActiveView('home')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="p-2 bg-blue-600 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">ExamInsight</h1>
                <p className="text-xs text-slate-600">Exam Paper Analysis Platform</p>
              </div>
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveView('home')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeView === 'home'
                    ? 'bg-slate-100 text-slate-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </button>

              <button
                onClick={() => setActiveView('upload')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeView === 'upload'
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Upload</span>
              </button>

              <button
                onClick={() => setActiveView('analytics')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeView === 'analytics'
                    ? 'bg-green-100 text-green-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </button>

              <button
                onClick={() => setActiveView('browse')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeView === 'browse'
                    ? 'bg-amber-100 text-amber-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Browse</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'home' && <Homepage onNavigate={setActiveView} />}
        {activeView === 'upload' && <UploadPaper onUploadComplete={() => setActiveView('analytics')} />}
        {activeView === 'analytics' && <Analytics />}
        {activeView === 'browse' && <Browse />}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-slate-600">
            <p>ExamInsight - Analyze exam papers with NLP-powered question extraction</p>
            <p className="mt-1 text-xs text-slate-500">Browse papers, study materials, books, and articles by subject</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
