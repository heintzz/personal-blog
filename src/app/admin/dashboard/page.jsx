'use client';

import StatusBadge from '@/app/components/StatusBadge';
import { ChevronRight, Eye, Trash2 } from 'lucide-react';
import { redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminArticlesPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 8;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs');
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    const fetchSummary = async () => {
      try {
        const response = await fetch('/api/blogs/summary');
        const data = await response.json();
        setSummary(data);
      } catch (error) {
        console.error('Error fetching summary:', error);
      }
    };

    Promise.all([fetchBlogs(), fetchSummary()]).then(() => setLoading(false));
  }, []);

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDelete = (id) => {
    (async (id) => {
      await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (res.ok) {
            setBlogs((prev) => prev.filter((p) => p.id !== id));
            setDeleteConfirm(null);
          } else {
            console.error('Failed to delete article');
          }
        })
        .catch((err) => console.error('Error deleting article:', err));
    })(id);
  };

  const filteredBlogs = blogs.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedBlogs = filteredBlogs.slice(startIdx, startIdx + itemsPerPage);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <>
      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <>
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-light tracking-tight text-black">
                Dashboard
              </h1>
            </div>

            {/* Search */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-black placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black/5 transition-all"
              />
            </div>

            {/* Stats */}
            <div className="my-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <p className="text-slate-600 text-sm font-medium mb-2">Total Articles</p>
                <p className="text-3xl font-light text-black">{summary?.totalBlogs || 0}</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <p className="text-slate-600 text-sm font-medium mb-2">Drafted Articles</p>
                <p className="text-3xl font-light text-black">{summary?.draftBlogs || 0}</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <p className="text-slate-600 text-sm font-medium mb-2">Unique Tags</p>
                <p className="text-3xl font-light text-black">{summary?.totalUniqueTags || 0}</p>
              </div>
            </div>

            {/* Table - Desktop */}
            {paginatedBlogs.length > 0 ? (
              <>
                <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider hidden md:table-cell">
                            Tags
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider hidden lg:table-cell">
                            Date
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedBlogs.map((blog) => (
                          <tr
                            key={blog.id}
                            onClick={() => router.push(`/admin/articles/${blog.id}`)}
                            className="cursor-pointer border-b border-slate-200 hover:bg-slate-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-black line-clamp-1">{blog.title}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 hidden md:table-cell">
                              <div className="flex flex-wrap gap-1">
                                {blog.tags.slice(0, 2).map((tag) => (
                                  <span
                                    key={tag.id}
                                    className="inline-block px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded"
                                  >
                                    {tag.name}
                                  </span>
                                ))}
                                {blog.tags.length > 2 && (
                                  <span className="inline-block px-2 py-1 text-slate-600 text-xs">
                                    +{blog.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="px-6 py-4 hidden lg:table-cell text-sm text-slate-600">
                              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge status={blog.status} />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    redirect(`/admin/articles/${blog.id}`);
                                  }}
                                  className="p-2 cursor-pointer hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                  title="Detail"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteConfirm(blog.id);
                                  }}
                                  className="p-2 cursor-pointer hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Cards - Mobile */}
                <div className="md:hidden space-y-3">
                  {paginatedBlogs.map((blog) => (
                    <div
                      key={blog.id}
                      onClick={() => router.push(`/admin/articles/${blog.id}`)}
                      className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 cursor-pointer hover:shadow-md hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-black line-clamp-2">{blog.title}</h3>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                            {blog.description}
                          </p>
                        </div>
                        <StatusBadge status={blog.status} />
                      </div>

                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {blog.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag.id}
                              className="inline-block px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded"
                            >
                              {tag.name}
                            </span>
                          ))}
                          {blog.tags.length > 3 && (
                            <span className="inline-block px-2 py-1 text-slate-600 text-xs">
                              +{blog.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500">
                          {new Date(blog.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              redirect(`/admin/articles/${blog.id}`);
                            }}
                            className="p-2 cursor-pointer hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                            title="Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirm(blog.id);
                            }}
                            className="p-2 cursor-pointer hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm px-4 md:px-6 py-4 flex items-center justify-center gap-2 flex-wrap">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-4 h-4 text-black -rotate-90" />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded-lg font-medium text-sm transition-all ${
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
                      <ChevronRight className="w-4 h-4 text-black rotate-90" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
                <p className="text-slate-500">No articles found</p>
              </div>
            )}
          </>
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-black mb-2">Delete Article?</h3>
            <p className="text-slate-600 mb-6">
              This action cannot be undone. The article will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-slate-100 text-black rounded-lg font-medium hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
