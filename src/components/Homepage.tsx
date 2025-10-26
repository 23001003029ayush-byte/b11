import { Upload, BarChart3, BookOpen, TrendingUp, Users, FileCheck, ArrowRight, Sparkles } from 'lucide-react';

interface HomepageProps {
  onNavigate: (view: 'upload' | 'analytics' | 'browse') => void;
}

export function Homepage({ onNavigate }: HomepageProps) {
  return (
    <div className="space-y-20">
      <section className="text-center pt-12 pb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">AI-Powered Question Extraction</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Transform How You
          <span className="block text-blue-600">Analyze Exam Papers</span>
        </h1>

        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          ExamInsight helps students study smarter and teachers organize better. Upload PDFs, extract questions automatically,
          and discover trends across subjects, topics, and years.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => onNavigate('upload')}
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
          >
            <Upload className="w-5 h-5" />
            Upload Your First Paper
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onNavigate('browse')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 font-semibold rounded-lg border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
          >
            <BookOpen className="w-5 h-5" />
            Browse Resources
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
          <div className="inline-flex p-3 bg-white/20 rounded-xl mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold mb-4">For Students</h2>
          <ul className="space-y-3 text-blue-50">
            <li className="flex items-start gap-3">
              <FileCheck className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>Access thousands of past exam papers organized by subject and year</span>
            </li>
            <li className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>Identify frequently tested topics and question patterns</span>
            </li>
            <li className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>Browse curated study materials, books, and articles</span>
            </li>
            <li className="flex items-start gap-3">
              <BarChart3 className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>Track difficulty levels and focus on areas that need improvement</span>
            </li>
          </ul>
          <button
            onClick={() => onNavigate('browse')}
            className="mt-6 flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all"
          >
            Start Exploring
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-8 text-white shadow-xl">
          <div className="inline-flex p-3 bg-white/20 rounded-xl mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold mb-4">For Teachers</h2>
          <ul className="space-y-3 text-green-50">
            <li className="flex items-start gap-3">
              <Upload className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>Upload exam papers and extract questions automatically with NLP</span>
            </li>
            <li className="flex items-start gap-3">
              <BarChart3 className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>Analyze question distribution across topics and difficulty levels</span>
            </li>
            <li className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>Track exam trends over years to maintain consistency</span>
            </li>
            <li className="flex items-start gap-3">
              <FileCheck className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>Build a searchable repository of questions and materials</span>
            </li>
          </ul>
          <button
            onClick={() => onNavigate('upload')}
            className="mt-6 flex items-center gap-2 px-6 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-all"
          >
            Upload Paper
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Three simple steps to transform your exam preparation and organization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl mb-4 text-2xl font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Upload</h3>
            <p className="text-slate-600">
              Upload your exam paper PDFs. Our system accepts multiple formats and subjects.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-2xl mb-4 text-2xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Extract</h3>
            <p className="text-slate-600">
              AI automatically extracts questions, identifies topics, and categorizes by difficulty.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl mb-4 text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Analyze</h3>
            <p className="text-slate-600">
              View insights, trends, and patterns. Filter by subject, topic, year, and more.
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
          <div className="text-sm text-slate-600">Questions Extracted</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
          <div className="text-sm text-slate-600">Exam Papers</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
          <div className="text-3xl font-bold text-amber-600 mb-2">50+</div>
          <div className="text-sm text-slate-600">Subjects Covered</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">1K+</div>
          <div className="text-sm text-slate-600">Active Users</div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-12 text-center text-white shadow-xl">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
          Join thousands of students and teachers who are already using ExamInsight to improve their exam preparation and organization.
        </p>
        <button
          onClick={() => onNavigate('upload')}
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 shadow-lg transition-all"
        >
          Get Started Now
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>
    </div>
  );
}
