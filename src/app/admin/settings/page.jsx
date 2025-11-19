'use client';

import { useAdminHeader } from '@/app/hooks/AdminHeaderContext';
import { Camera, User } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function AdminSettingsPage() {
  const { setName } = useAdminHeader();
  const [profileName, setProfileName] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState('/profile-placeholder.png');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load profile name from localStorage
    const savedProfileName = localStorage.getItem('profileName') || 'Your Name';
    setProfileName(savedProfileName);

    // Load profile picture from localStorage
    const savedProfilePicture = localStorage.getItem('profilePicture');
    if (savedProfilePicture) {
      setProfilePicturePreview(savedProfilePicture);
    }
  }, []);

  const handleNameChange = (e) => {
    setProfileName(e.target.value);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(file);
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      localStorage.setItem('profileName', profileName);
      if (profilePicturePreview !== '/profile-placeholder.png') {
        localStorage.setItem('profilePicture', profilePicturePreview);
      }
      setSuccess('Profile updated successfully!');
      setName(profileName);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update profile');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setProfilePicturePreview('/profile-placeholder.png');
    localStorage.removeItem('profilePicture');
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-black mb-2">
            Settings
          </h1>
          <p className="text-slate-500">Manage your profile and preferences</p>
        </div>

        {/* Profile Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-black mb-6">Profile</h3>

            <div className="space-y-6">
              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-medium text-black mb-4">Profile Picture</label>
                <div className="flex items-end gap-6">
                  {/* Image Preview */}
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-50 flex items-center justify-center">
                    {profilePicturePreview !== '/profile-placeholder.png' ? (
                      <>
                        <Image
                          src={profilePicturePreview}
                          alt="Profile"
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                        />
                        <label
                          htmlFor="profile-picture-upload"
                          className="absolute inset-0 flex items-center justify-center bg-black/60 text-white cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                        >
                          <Camera size={28} />
                        </label>
                      </>
                    ) : (
                      <User size={48} className="text-slate-300" />
                    )}
                    <input
                      id="profile-picture-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePictureChange}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label htmlFor="profile-name" className="block text-sm font-medium text-black mb-3">
                  Display Name
                </label>
                <input
                  type="text"
                  id="profile-name"
                  value={profileName}
                  onChange={handleNameChange}
                  placeholder="Enter your name"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-black placeholder-slate-400 text-sm transition-all focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black/5 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="mt-6 p-4 bg-red-50/50 border border-red-200/50 rounded-lg text-red-700 text-sm font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="mt-6 p-4 bg-green-50/50 border border-green-200/50 rounded-lg text-green-700 text-sm font-medium">
                {success}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end mt-8">
              <button
                type="button"
                onClick={() => {
                  setProfileName(localStorage.getItem('profileName') || 'Your Name');
                  setProfilePicturePreview(
                    localStorage.getItem('profilePicture') || '/profile-placeholder.png'
                  );
                }}
                disabled={loading}
                className="px-6 py-3 bg-slate-100 text-black rounded-lg font-medium hover:bg-slate-200 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-slate-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
