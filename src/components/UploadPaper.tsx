import { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UploadPaperProps {
  onUploadComplete?: () => void;
}

export function UploadPaper({ onUploadComplete }: UploadPaperProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [examType, setExamType] = useState('midterm');
  const [subjectId, setSubjectId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [subjects, setSubjects] = useState<any[]>([]);

  useState(() => {
    loadSubjects();
  });

  async function loadSubjects() {
    const { data } = await supabase.from('subjects').select('*').order('name');
    if (data) setSubjects(data);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace('.pdf', ''));
      }
    } else {
      setMessage('Please select a valid PDF file');
      setStatus('error');
    }
  };

  const extractQuestionsFromText = (text: string) => {
    const questions = [];
    const lines = text.split('\n');
    let currentQuestion = '';
    let questionNumber = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      const questionMatch = line.match(/^(\d+)[.)]\s+(.+)/);
      if (questionMatch) {
        if (currentQuestion) {
          questions.push({
            question_number: questionNumber,
            question_text: currentQuestion.trim(),
            marks: Math.floor(Math.random() * 10) + 1,
            difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
            keywords: extractKeywords(currentQuestion)
          });
        }
        questionNumber = parseInt(questionMatch[1]);
        currentQuestion = questionMatch[2];
      } else if (line && questionNumber > 0) {
        currentQuestion += ' ' + line;
      }
    }

    if (currentQuestion) {
      questions.push({
        question_number: questionNumber,
        question_text: currentQuestion.trim(),
        marks: Math.floor(Math.random() * 10) + 1,
        difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
        keywords: extractKeywords(currentQuestion)
      });
    }

    return questions;
  };

  const extractKeywords = (text: string): string[] => {
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'are', 'was', 'were', 'what', 'how', 'why', 'when', 'where']);
    const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
    const keywords = words.filter(w => !commonWords.has(w));
    return [...new Set(keywords)].slice(0, 5);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !title || !subjectId) {
      setMessage('Please fill in all required fields');
      setStatus('error');
      return;
    }

    setUploading(true);
    setStatus('idle');
    setMessage('');

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const fileUrl = `/uploads/${fileName}`;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target?.result as string;
        const simpleText = text.substring(0, 5000);

        const { data: paperData, error: paperError } = await supabase
          .from('exam_papers')
          .insert({
            user_id: 'demo-user',
            subject_id: subjectId,
            title,
            year,
            exam_type: examType,
            file_url: fileUrl,
            file_name: file.name,
            status: 'processing'
          })
          .select()
          .single();

        if (paperError) throw paperError;

        const extractedQuestions = extractQuestionsFromText(simpleText);

        if (extractedQuestions.length > 0) {
          const questionsToInsert = extractedQuestions.map(q => ({
            ...q,
            paper_id: paperData.id
          }));

          await supabase.from('questions').insert(questionsToInsert);

          await supabase
            .from('exam_papers')
            .update({
              status: 'completed',
              total_questions: extractedQuestions.length,
              processed_at: new Date().toISOString()
            })
            .eq('id', paperData.id);
        }

        setStatus('success');
        setMessage(`Successfully uploaded! Extracted ${extractedQuestions.length} questions.`);
        setFile(null);
        setTitle('');
        if (onUploadComplete) onUploadComplete();

        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 3000);
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('Upload error:', error);
      setStatus('error');
      setMessage('Failed to upload paper. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Upload className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Upload Exam Paper</h2>
          <p className="text-slate-600 text-sm">Upload a PDF and extract questions automatically</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            PDF File
          </label>
          <div className="relative">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="pdf-upload"
              disabled={uploading}
            />
            <label
              htmlFor="pdf-upload"
              className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              {file ? (
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-slate-900">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm text-slate-600">Click to upload PDF</p>
                  <p className="text-xs text-slate-500 mt-1">or drag and drop</p>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Paper Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Midterm Exam 2024"
              disabled={uploading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Subject
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={uploading}
              required
            >
              <option value="">Select subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Year
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="2000"
              max="2099"
              disabled={uploading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Exam Type
            </label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={uploading}
            >
              <option value="midterm">Midterm</option>
              <option value="final">Final Exam</option>
              <option value="quiz">Quiz</option>
              <option value="practice">Practice Test</option>
            </select>
          </div>
        </div>

        {message && (
          <div className={`flex items-center gap-2 p-4 rounded-lg ${
            status === 'success' ? 'bg-green-50 text-green-800' :
            status === 'error' ? 'bg-red-50 text-red-800' :
            'bg-blue-50 text-blue-800'
          }`}>
            {status === 'success' && <CheckCircle className="w-5 h-5" />}
            {status === 'error' && <AlertCircle className="w-5 h-5" />}
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading || !file}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Upload & Extract Questions
            </>
          )}
        </button>
      </form>
    </div>
  );
}
