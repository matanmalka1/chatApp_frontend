
import React, { useState } from 'react';
import Layout from '../components/common/Layout';
import { useAuthStore } from '../store/authStore';
import { updateUser } from '../api/users';
import Avatar from '../components/common/Avatar';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { user, updateUser: updateStoreUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    avatar: user?.avatar || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;

    setLoading(true);
    try {
      const { data } = await updateUser(user._id, formData);
      updateStoreUser(data);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6 custom-scrollbar">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
            <p className="text-gray-500 text-sm">Manage your account information and how others see you</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-32 bg-indigo-600 relative">
              <div className="absolute -bottom-10 left-8">
                <Avatar src={formData.avatar || user?.avatar} name={user?.username || 'User'} size="xl" className="border-4 border-white shadow-lg" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 pt-16 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    className="w-full bg-gray-50 border-gray-200 rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className="w-full bg-gray-50 border-gray-200 rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">Avatar URL</label>
                <input
                  type="text"
                  name="avatar"
                  className="w-full bg-gray-50 border-gray-200 rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.avatar}
                  onChange={handleChange}
                />
                <p className="mt-2 text-[10px] text-gray-400 ml-1 italic">Provide a link to an image for your profile picture</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">Email Address (Read only)</label>
                <input
                  type="email"
                  disabled
                  className="w-full bg-gray-100 border-gray-200 rounded-2xl py-3 px-4 text-sm text-gray-500 cursor-not-allowed"
                  value={user?.email}
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
