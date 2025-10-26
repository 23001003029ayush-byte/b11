import { useState, useEffect } from 'react';
import { FileText, BookOpen, Newspaper, GraduationCap, Search, Filter, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';

type BrowseType = 'papers' | 'materials' | 'books' | 'articles';

export function Browse() {
  const [activeTab, setActiveTab] = useState<BrowseType>('papers');
  const [subjects, setSubjects] = useState<any[]>([]);
  const [papers, setPapers] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    if (activeTab === 'papers') {
      loadPapers();
    } else {
      loadMaterials();
    }
  }, [activeTab, selectedSubject, selectedYear, searchQuery]);

  async function loadSubjects() {
    const { data } = await supabase.from('subjects').select('*').order('name');
    if (data) setSubjects(data);
  }

  async function loadPapers() {
    let query = supabase
      .from('exam_papers')
      .select('*, subjects(name, code)')
      .order('created_at', { ascending: false });

    if (selectedSubject) query = query.eq('subject_id', selectedSubject);
    if (selectedYear) query = query.eq('year', parseInt(selectedYear));
    if (searchQuery) query = query.ilike('title', `%${searchQuery}%`);

    const { data } = await query;
    if (data) setPapers(data);
  }

  async function loadMaterials() {
    let query = supabase
      .from('study_materials')
      .select('*, subjects(name, code)')
      .order('created_at', { ascending: false });

    if (selectedSubject) query = query.eq('subject_id', selectedSubject);
    if (selectedYear) query = query.eq('year', parseInt(selectedYear));
    if (searchQuery) query = query.ilike('title', `%${searchQuery}%`);

    if (activeTab === 'books') {
      query = query.eq('type', 'book');
    } else if (activeTab === 'articles') {
      query = query.eq('type', 'article');
    } else if (activeTab === 'materials') {
      query = query.eq('type', 'study_material');
    }

    const { data } = await query;
    if (data) setMaterials(data);
  }

  const tabs = [
    { id: 'papers' as BrowseType, label: 'Exam Papers', icon: FileText, color: 'blue' },
    { id: 'materials' as BrowseType, label: 'Study Materials', icon: GraduationCap, color: 'green' },
    { id: 'books' as BrowseType, label: 'Books', icon: BookOpen, color: 'amber' },
    { id: 'articles' as BrowseType, label: 'Articles', icon: Newspaper, color: 'red' }
  ];

  const displayItems = activeTab === 'papers' ? papers : materials;

  const years = Array.from(
    new Set([
      ...papers.map(p => p.year),
      ...materials.map(m => m.year).filter(Boolean)
    ])
  ).sort((a, b) => b - a);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-50 rounded-lg">
            <BookOpen className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Browse Resources</h2>
            <p className="text-slate-600 text-sm">Explore exam papers, study materials, books, and articles</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive
                    ? `bg-${tab.color}-100 text-${tab.color}-700 shadow-sm`
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {(selectedSubject || selectedYear || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedSubject('');
                  setSelectedYear('');
                  setSearchQuery('');
                }}
                className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayItems.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                <Filter className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">No items found</h3>
              <p className="text-slate-600 text-sm">Try adjusting your filters or search query</p>
            </div>
          ) : (
            displayItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${
                    activeTab === 'papers' ? 'bg-blue-50' :
                    activeTab === 'materials' ? 'bg-green-50' :
                    activeTab === 'books' ? 'bg-amber-50' :
                    'bg-red-50'
                  }`}>
                    {activeTab === 'papers' && <FileText className="w-5 h-5 text-blue-600" />}
                    {activeTab === 'materials' && <GraduationCap className="w-5 h-5 text-green-600" />}
                    {activeTab === 'books' && <BookOpen className="w-5 h-5 text-amber-600" />}
                    {activeTab === 'articles' && <Newspaper className="w-5 h-5 text-red-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{item.title}</h3>
                    <p className="text-sm text-slate-600">{item.subjects?.name}</p>
                  </div>
                </div>

                {activeTab === 'papers' ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="font-medium">Year:</span>
                      <span>{item.year}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="font-medium">Type:</span>
                      <span className="capitalize">{item.exam_type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="font-medium">Questions:</span>
                      <span>{item.total_questions}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.status === 'completed' ? 'bg-green-100 text-green-700' :
                        item.status === 'processing' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {item.author && (
                      <div className="text-sm text-slate-600">
                        <span className="font-medium">Author:</span> {item.author}
                      </div>
                    )}
                    {item.year && (
                      <div className="text-sm text-slate-600">
                        <span className="font-medium">Year:</span> {item.year}
                      </div>
                    )}
                    {item.description && (
                      <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors">
                  <Download className="w-4 h-4" />
                  View
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
