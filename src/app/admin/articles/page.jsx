'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, X, ChevronRight, Menu, Home, FileText, Settings } from 'lucide-react';

const INITIAL_PROJECTS = [
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
];

export default function AdminArticlesPage() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const openModal = (project = null) => {
    if (project) {
      setEditingId(project.id);
      setFormData({
        title: project.title,
        description: project.description,
        tags: project.tags.join(', '),
        date: project.date,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        tags: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.tags.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const tagsArray = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    if (editingId) {
      setProjects(
        projects.map((p) =>
          p.id === editingId
            ? {
                ...p,
                title: formData.title,
                description: formData.description,
                tags: tagsArray,
                date: formData.date,
              }
            : p
        )
      );
    } else {
      const newProject = {
        id: Math.max(...projects.map((p) => p.id), 0) + 1,
        title: formData.title,
        description: formData.description,
        tags: tagsArray,
        date: formData.date,
      };
      setProjects([newProject, ...projects]);
    }

    closeModal();
  };

  const handleDelete = (id) => {
    setProjects(projects.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIdx, startIdx + itemsPerPage);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'articles', label: 'Articles', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <>
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-light tracking-tight text-black mb-2">
                  Blog Management
                </h1>
                <p className="text-slate-500">Create, edit, and manage your blog articles</p>
              </div>
              <button
                onClick={() => openModal()}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>New Article</span>
              </button>
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

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {paginatedProjects.length > 0 ? (
                <>
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
                          <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedProjects.map((project) => (
                          <tr
                            key={project.id}
                            className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-black line-clamp-1">
                                  {project.title}
                                </p>
                                <p className="text-sm text-slate-600 line-clamp-1 md:hidden">
                                  {project.description}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4 hidden md:table-cell">
                              <div className="flex flex-wrap gap-1">
                                {project.tags.slice(0, 2).map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-block px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {project.tags.length > 2 && (
                                  <span className="inline-block px-2 py-1 text-slate-600 text-xs">
                                    +{project.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 hidden lg:table-cell text-sm text-slate-600">
                              {new Date(project.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => openModal(project)}
                                  className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(project.id)}
                                  className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-center gap-2">
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
                <div className="p-12 text-center">
                  <p className="text-slate-500 mb-4">No articles found</p>
                  <button
                    onClick={() => openModal()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-slate-800 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Create First Article
                  </button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <p className="text-slate-600 text-sm font-medium mb-2">Total Articles</p>
                <p className="text-3xl font-light text-black">{projects.length}</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <p className="text-slate-600 text-sm font-medium mb-2">Displayed</p>
                <p className="text-3xl font-light text-black">{paginatedProjects.length}</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <p className="text-slate-600 text-sm font-medium mb-2">Unique Tags</p>
                <p className="text-3xl font-light text-black">
                  {new Set(projects.flatMap((p) => p.tags)).size}
                </p>
              </div>
            </div>
          </>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
              <h2 className="text-2xl font-light text-black">
                {editingId ? 'Edit Article' : 'Create New Article'}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Modal Form */}
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black/5 transition-all"
                  placeholder="Article title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black/5 transition-all resize-none"
                  placeholder="Article description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black/5 transition-all"
                  placeholder="e.g. React, CSS, Frontend"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black/5 transition-all"
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-slate-100 text-black rounded-lg font-medium hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-slate-800 transition-all"
                >
                  {editingId ? 'Update Article' : 'Create Article'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
