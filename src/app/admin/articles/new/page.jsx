'use client';

import { TiptapEditor } from '@/app/components/TipTapEditor';
import { ImageIcon, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { uploadCoverImage, deleteCoverImage } from '@/lib/supabase/storage';

const predefinedTags = [
  'Technology',
  'Travel',
  'Food',
  'Lifestyle',
  'Coding',
  'Next.js',
  'React',
  'Tailwind CSS',
];

export default function AddBlogPage() {
  const router = useRouter();
  const [tagsList, setTagsList] = useState([]);
  const [coverImage, setCoverImage] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch('/api/tags');
        if (res.ok) {
          const data = await res.json();
          setTagsList(data.map((tag) => tag.name));
        }
      } catch (err) {
        console.error('Error fetching tags:', err);
      }
    };
    fetchTags();
  }, []);
  console.log(tagsList);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload({ target: { files: [file] } });
    }
  };

  const handleAddTag = (tag) => {
    const newTag = tag.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleManualTagSubmit = (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      e.preventDefault();
      const newTags = tagInput
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
      newTags.forEach(handleAddTag);
      setTagInput('');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      uploadCoverImage(file)
        .then((url) => {
          if (url) {
            setCoverImage(url);
            setError(null);
          } else {
            setError('Failed to upload image');
          }
        })
        .catch((err) => {
          setError('Upload failed: ' + err.message);
        })
        .finally(() => {
          setUploading(false);
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim() || !description.trim() || !content.trim()) {
      setError('Title, description, and content are required.');
      return;
    }

    if (tags.length === 0) {
      setError('Please add at least one tag.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: coverImage, title, description, content, tags }),
      });

      if (res.ok) {
        setSuccess('Blog post created successfully!');
        setTimeout(() => {
          router.push('/admin/articles');
        }, 1500);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create blog post.');
      }
    } catch (error) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-black mb-2">
              Create Article
            </h1>
            <p className="text-slate-500">Write and publish a new blog article</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Cover Image Upload */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <label className="block text-sm font-medium text-black mb-3">Cover Image</label>
              {coverImage ? (
                <div className="relative">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-64 md:h-128 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      deleteCoverImage(coverImage);
                      setCoverImage('');
                    }}
                    disabled={loading}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium mb-4">
                    {isDragging ? 'Drop it here!' : 'Add a cover image'}
                  </p>

                  <div className="flex gap-3 justify-center">
                    <label className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50">
                      <Upload className="w-4 h-4" />
                      {uploading ? 'Uploading...' : 'Upload'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={loading || uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Title Field */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <label className="block text-sm font-medium text-black mb-3">Article Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title"
                disabled={loading}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-black placeholder-slate-400 text-sm transition-all focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black/5 disabled:opacity-50"
              />
            </div>

            {/* Description Field */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <label className="block text-sm font-medium text-black mb-3">Short Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of your article"
                disabled={loading}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-black placeholder-slate-400 text-sm transition-all focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black/5 disabled:opacity-50 resize-none"
              />
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <label className="block text-sm font-medium text-black mb-3">Article Content</label>
              <TiptapEditor value={content} onChange={setContent} />
            </div>

            {/* Tags Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-sm font-medium text-black mb-4">Tags</h3>

              {/* Manual Tag Input */}
              <div className="mb-6">
                <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">
                  Add Custom Tags
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleManualTagSubmit}
                  onBlur={handleManualTagSubmit}
                  placeholder="Enter tags separated by commas"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-black placeholder-slate-400 text-sm transition-all focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black/5 disabled:opacity-50"
                />
                <p className="text-xs text-slate-500 mt-2">Press Enter or Tab to add tags</p>
              </div>

              {/* Predefined Tags */}
              {tagsList.length > 0 && (
                <div className="mb-6">
                  <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-3">
                    Recent Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tagsList.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleAddTag(tag)}
                        disabled={tags.includes(tag) || loading}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          tags.includes(tag)
                            ? 'bg-black text-white shadow-md'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Tags Display */}
              {tags.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-3">
                    Selected Tags ({tags.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg group"
                      >
                        <span className="text-sm font-medium text-black">{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          disabled={loading}
                          className="text-slate-500 hover:text-red-600 transition-colors disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50/50 border border-red-200/50 rounded-lg text-red-700 text-sm font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-50/50 border border-green-200/50 rounded-lg text-green-700 text-sm font-medium">
                {success}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  if (coverImage) deleteCoverImage(coverImage);
                  router.back();
                }}
                disabled={loading}
                className="px-6 py-3 bg-slate-100 text-black rounded-lg font-medium hover:bg-slate-200 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-slate-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save as Draft'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
