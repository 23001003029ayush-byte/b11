import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Filter, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Analytics() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [papers, setPapers] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [stats, setStats] = useState({
    totalPapers: 0,
    totalQuestions: 0,
    subjectBreakdown: [] as any[],
    topicTrends: [] as any[],
    yearlyTrends: [] as any[],
    difficultyDistribution: [] as any[]
  });

  useEffect(() => {
    loadData();
  }, [selectedSubject, selectedTopic, selectedYear]);

  async function loadData() {
    const { data: subjectsData } = await supabase
      .from('subjects')
      .select('*')
      .order('name');

    const { data: topicsData } = await supabase
      .from('topics')
      .select('*, subjects(name)')
      .order('name');

    let papersQuery = supabase
      .from('exam_papers')
      .select('*, subjects(name, code)');

    if (selectedSubject) papersQuery = papersQuery.eq('subject_id', selectedSubject);
    if (selectedYear) papersQuery = papersQuery.eq('year', parseInt(selectedYear));

    const { data: papersData } = await papersQuery;

    let questionsQuery = supabase
      .from('questions')
      .select('*, topics(name, subject_id), exam_papers(year, subject_id)');

    if (selectedTopic) questionsQuery = questionsQuery.eq('topic_id', selectedTopic);

    const { data: questionsData } = await questionsQuery;

    if (subjectsData) setSubjects(subjectsData);
    if (topicsData) setTopics(topicsData);
    if (papersData) setPapers(papersData);
    if (questionsData) setQuestions(questionsData);

    calculateStats(papersData || [], questionsData || []);
  }

  function calculateStats(papersData: any[], questionsData: any[]) {
    const subjectBreakdown = subjects.map(subject => {
      const subjectPapers = papersData.filter(p => p.subject_id === subject.id);
      const subjectQuestions = questionsData.filter(
        q => q.exam_papers?.subject_id === subject.id
      );
      return {
        name: subject.name,
        papers: subjectPapers.length,
        questions: subjectQuestions.length
      };
    }).filter(s => s.papers > 0 || s.questions > 0);

    const topicTrends = topics.map(topic => {
      const topicQuestions = questionsData.filter(q => q.topic_id === topic.id);
      return {
        name: topic.name,
        count: topicQuestions.length
      };
    }).filter(t => t.count > 0).sort((a, b) => b.count - a.count).slice(0, 10);

    const yearlyMap = new Map<number, number>();
    papersData.forEach(paper => {
      yearlyMap.set(paper.year, (yearlyMap.get(paper.year) || 0) + 1);
    });
    const yearlyTrends = Array.from(yearlyMap.entries())
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => a.year - b.year);

    const difficultyMap = new Map<string, number>();
    questionsData.forEach(q => {
      difficultyMap.set(q.difficulty, (difficultyMap.get(q.difficulty) || 0) + 1);
    });
    const difficultyDistribution = Array.from(difficultyMap.entries())
      .map(([difficulty, count]) => ({ difficulty, count }));

    setStats({
      totalPapers: papersData.length,
      totalQuestions: questionsData.length,
      subjectBreakdown,
      topicTrends,
      yearlyTrends,
      difficultyDistribution
    });
  }

  const filteredTopics = selectedSubject
    ? topics.filter(t => t.subject_id === selectedSubject)
    : topics;

  const years = Array.from(new Set(papers.map(p => p.year))).sort((a, b) => b - a);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-50 rounded-lg">
            <BarChart3 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Analytics Dashboard</h2>
            <p className="text-slate-600 text-sm">View trends and insights from exam papers</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Filters:</span>
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setSelectedTopic('');
            }}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>

          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={!selectedSubject}
          >
            <option value="">All Topics</option>
            {filteredTopics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {(selectedSubject || selectedTopic || selectedYear) && (
            <button
              onClick={() => {
                setSelectedSubject('');
                setSelectedTopic('');
                setSelectedYear('');
              }}
              className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-blue-900">Total Papers</h3>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-900">{stats.totalPapers}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-green-900">Total Questions</h3>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-900">{stats.totalQuestions}</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-amber-900">Avg Questions/Paper</h3>
              <BarChart3 className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-amber-900">
              {stats.totalPapers > 0 ? Math.round(stats.totalQuestions / stats.totalPapers) : 0}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Questions by Subject</h3>
            <div className="space-y-3">
              {stats.subjectBreakdown.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{item.name}</span>
                    <span className="text-slate-600">{item.questions} questions</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${(item.questions / Math.max(...stats.subjectBreakdown.map(s => s.questions), 1)) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
              {stats.subjectBreakdown.length === 0 && (
                <p className="text-slate-500 text-sm text-center py-4">No data available</p>
              )}
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Topics</h3>
            <div className="space-y-3">
              {stats.topicTrends.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{item.name}</span>
                    <span className="text-slate-600">{item.count} questions</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${(item.count / Math.max(...stats.topicTrends.map(t => t.count), 1)) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
              {stats.topicTrends.length === 0 && (
                <p className="text-slate-500 text-sm text-center py-4">No data available</p>
              )}
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Papers by Year</h3>
            <div className="space-y-3">
              {stats.yearlyTrends.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{item.year}</span>
                    <span className="text-slate-600">{item.count} papers</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-amber-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${(item.count / Math.max(...stats.yearlyTrends.map(y => y.count), 1)) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
              {stats.yearlyTrends.length === 0 && (
                <p className="text-slate-500 text-sm text-center py-4">No data available</p>
              )}
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Difficulty Distribution</h3>
            <div className="space-y-3">
              {stats.difficultyDistribution.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700 capitalize">{item.difficulty}</span>
                    <span className="text-slate-600">{item.count} questions</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        item.difficulty === 'easy' ? 'bg-green-600' :
                        item.difficulty === 'medium' ? 'bg-amber-600' :
                        'bg-red-600'
                      }`}
                      style={{
                        width: `${(item.count / Math.max(...stats.difficultyDistribution.map(d => d.count), 1)) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
              {stats.difficultyDistribution.length === 0 && (
                <p className="text-slate-500 text-sm text-center py-4">No data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
