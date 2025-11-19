'use client';

import StatusBadge from '@/app/components/StatusBadge';
import { ChevronLeft, ChevronRight, Plus, Search, Settings, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function AdminArticlesPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [sortBy, setSortBy] = useState('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    (async () => {
      await fetch('/api/blogs')
        .then((res) => res.json())
        .then((data) => {
          setBlogs(data);
        })
        .catch((err) => console.error(err));
    })();
  }, []);

  // Get all unique tags
  const allTags = useMemo(
    () => [...new Set(blogs.flatMap((p) => p.tags.map((p) => p.name)))].sort(),
    [blogs]
  );

  // Get all unique statuses
  const allStatuses = useMemo(() => [...new Set(blogs.map((blog) => blog.status))].sort(), [blogs]);

  // Filter and search
  const filteredBlogs = useMemo(() => {
    let filtered = blogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => blog.tags.map((tag) => tag.name).includes(tag));

      const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(blog.status);

      return matchesSearch && matchesTags && matchesStatus;
    });

    // Sort
    if (sortBy === 'date-desc') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'date-asc') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'title-asc') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'title-desc') {
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    }

    return filtered;
  }, [searchTerm, selectedTags, selectedStatus, sortBy, blogs]);

  // Pagination
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedBlogs = filteredBlogs.slice(startIdx, startIdx + itemsPerPage);

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

  const toggleStatus = (status) => {
    setSelectedStatus((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
    setCurrentPage(1);
  };

  const removeStatus = (status) => {
    setSelectedStatus((prev) => prev.filter((s) => s !== status));
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setSelectedStatus([]);
    setSortBy('date-desc');
    setCurrentPage(1);
    setShowFilterPanel(false);
  };

  const totalActiveFilters = selectedTags.length + selectedStatus.length;

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-black mb-2">
            My Articles
          </h1>
          <Link href="/admin/articles/new">
            <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-slate-800 transition-all shadow-md hover:shadow-lg whitespace-nowrap">
              <Plus className="w-5 h-5" />
              Create Article
            </button>
          </Link>
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
                showFilterPanel || totalActiveFilters > 0
                  ? 'bg-black text-white'
                  : 'bg-white border border-slate-200 text-black hover:bg-slate-50'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Filter</span>
              {totalActiveFilters > 0 && (
                <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {totalActiveFilters}
                </span>
              )}
            </button>
          </div>

          {/* Collapsible Filter Panel */}
          {showFilterPanel && (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 animate-in fade-in slide-in-from-top-2">
              {/* Status Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-black mb-3">Filter by Status</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {allStatuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => toggleStatus(status)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedStatus.includes(status)
                          ? 'bg-black text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-200 my-4"></div>

              {/* Tags Filter */}
              <div className="mb-4">
                <h3 className="font-medium text-black mb-3">Filter by Tags</h3>
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
              </div>

              {/* Active Filters Display */}
              {totalActiveFilters > 0 && (
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-600 mb-3 font-medium">Active filters:</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedStatus.map((status) => (
                      <div
                        key={`status-${status}`}
                        className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-sm"
                      >
                        <span className="text-black font-medium">{status}</span>
                        <button
                          onClick={() => removeStatus(status)}
                          className="hover:text-red-600 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {selectedTags.map((tag) => (
                      <div
                        key={`tag-${tag}`}
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
          Showing {paginatedBlogs.length > 0 ? startIdx + 1 : 0} to{' '}
          {Math.min(startIdx + itemsPerPage, filteredBlogs.length)} of {filteredBlogs.length}{' '}
          {filteredBlogs.length <= 1 ? 'blog' : 'blogs'}
        </div>

        {/* Blogs Grid */}
        {paginatedBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {paginatedBlogs.map((blog) => (
              <div
                key={blog.id}
                onClick={() => router.push(`/admin/articles/${blog.id}`)}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all p-6 flex flex-col group cursor-pointer"
              >
                <div className="mb-4 flex-1">
                  <h3 className="text-lg font-semibold text-black group-hover:text-slate-700 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <StatusBadge status={blog.status} />
                  <img
                    src={blog.imageUrl}
                    className="rounded-md my-3 object-cover h-40 md:h-80"
                  ></img>
                  <p className="text-sm text-slate-600 line-clamp-3">{blog.description}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full hover:bg-slate-200 transition-colors"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>

                {/* Date */}
                <p className="text-xs text-slate-500">
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
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
              <ChevronLeft className="w-5 h-5 text-black" />
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
              <ChevronRight className="w-5 h-5 text-black" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
