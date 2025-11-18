'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronRight, Settings, X } from 'lucide-react';

const SAMPLE_PROJECTS = [
  {
    id: 1,
    title: 'Building a Real-time Chat App',
    description:
      'Learn how to create a scalable chat application using WebSockets and React for real-time communication.',
    tags: ['React', 'WebSocket', 'Backend'],
    date: '2024-01-15',
  },
  {
    id: 2,
    title: 'Mastering CSS Grid Layouts',
    description:
      'Deep dive into CSS Grid with practical examples and advanced techniques for responsive design.',
    tags: ['CSS', 'Frontend', 'Design'],
    date: '2024-01-10',
  },
  {
    id: 3,
    title: 'Authentication Best Practices',
    description:
      'Explore secure authentication methods including JWT, OAuth, and session management strategies.',
    tags: ['Security', 'Backend', 'Auth'],
    date: '2024-01-08',
  },
  {
    id: 4,
    title: 'React Performance Optimization',
    description:
      'Optimize your React applications with memoization, code splitting, and lazy loading techniques.',
    tags: ['React', 'Performance', 'Frontend'],
    date: '2024-01-05',
  },
  {
    id: 5,
    title: 'Database Design Fundamentals',
    description:
      'Master relational database design principles, normalization, and query optimization.',
    tags: ['Database', 'Backend', 'SQL'],
    date: '2024-01-01',
  },
  {
    id: 6,
    title: 'Mobile-First Responsive Design',
    description: 'Create mobile-friendly websites that adapt seamlessly across all device sizes.',
    tags: ['CSS', 'Frontend', 'Design'],
    date: '2023-12-28',
  },
  {
    id: 7,
    title: 'GraphQL vs REST APIs',
    description: 'Compare GraphQL and REST APIs with practical examples and use case scenarios.',
    tags: ['API', 'Backend', 'GraphQL'],
    date: '2023-12-25',
  },
  {
    id: 8,
    title: 'Testing React Components',
    description:
      'Write comprehensive unit and integration tests for React applications using Jest and Testing Library.',
    tags: ['React', 'Testing', 'Frontend'],
    date: '2023-12-20',
  },
];

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const itemsPerPage = 6;

  // Get all unique tags
  const allTags = [...new Set(SAMPLE_PROJECTS.flatMap((p) => p.tags))].sort();

  // Filter and search
  const filteredProjects = useMemo(() => {
    let filtered = SAMPLE_PROJECTS.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTags =
        selectedTags.length === 0 || selectedTags.some((tag) => project.tags.includes(tag));

      return matchesSearch && matchesTags;
    });

    // Sort
    if (sortBy === 'date-desc') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'date-asc') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'title-asc') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'title-desc') {
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    }

    return filtered;
  }, [searchTerm, selectedTags, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIdx, startIdx + itemsPerPage);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const removeTag = (tag) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setSortBy('date-desc');
    setCurrentPage(1);
    setShowFilterPanel(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-black mb-2">
            Blog & Projects
          </h1>
          <p className="text-slate-500">Explore articles, tutorials, and project showcases</p>
        </div>

        {/* Search + Sort + Filter Bar */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex gap-3">
            {/* Search Bar */}
            <div className="flex-1 w-full relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-black placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black/5 transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-fit h-[50.24px] sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-black text-sm appearance-none focus:outline-none focus:border-black focus:ring-1 focus:ring-black/5 transition-all pr-10"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none rotate-90" />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                showFilterPanel || selectedTags.length > 0
                  ? 'bg-black text-white'
                  : 'bg-white border border-slate-200 text-black hover:bg-slate-50'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Filter</span>
              {selectedTags.length > 0 && (
                <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {selectedTags.length}
                </span>
              )}
            </button>
          </div>

          {/* Collapsible Filter Panel */}
          {showFilterPanel && (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-black">Filter by Tags</h3>
                <button
                  onClick={() => setShowFilterPanel(false)}
                  className="p-1 hover:bg-slate-100 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-black text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Active Tags Display */}
              {selectedTags.length > 0 && (
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-600 mb-3 font-medium">Active filters:</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedTags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-sm"
                      >
                        <span className="text-black font-medium">{tag}</span>
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-600 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleClearAllFilters}
                    className="w-full px-3 py-2 text-sm font-medium text-slate-600 hover:text-black hover:bg-slate-100 rounded-lg transition-all"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="mb-6 text-sm text-slate-600">
          Showing {paginatedProjects.length > 0 ? startIdx + 1 : 0} to{' '}
          {Math.min(startIdx + itemsPerPage, filteredProjects.length)} of {filteredProjects.length}{' '}
          blogs
        </div>

        {/* Projects Grid */}
        {paginatedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {paginatedProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all p-6 flex flex-col group cursor-pointer"
              >
                <div className="mb-4 flex-1">
                  <h3 className="text-lg font-semibold text-black mb-3 group-hover:text-slate-700 transition-colors line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-3">{project.description}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full hover:bg-slate-200 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Date */}
                <p className="text-xs text-slate-500">
                  {new Date(project.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-500 mb-4">No articles found matching your filters.</p>
            <button
              onClick={handleClearAllFilters}
              className="px-4 py-2 text-sm font-medium text-black hover:bg-slate-100 rounded-lg transition-all"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5 text-black -rotate-90" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                    currentPage === page
                      ? 'bg-black text-white'
                      : 'border border-slate-200 text-black hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5 text-black rotate-90" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
