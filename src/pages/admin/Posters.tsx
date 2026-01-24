// frontend/src/pages/admin/Posters.tsx
import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { listPosters, deletePoster, updatePoster } from '../../lib/api/admin';

const Posters: React.FC = () => {
  const [posters, setPosters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosters = async () => {
    try {
      setLoading(true);
      const data = await listPosters({ page: 1, limit: 50 });
      setPosters(data.posters);
    } catch (error) {
      console.error('Error fetching posters:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosters();
  }, []);

  const handleDelete = async (posterId: string) => {
    if (window.confirm('Are you sure you want to delete this poster?')) {
      try {
        await deletePoster(posterId);
        fetchPosters();
      } catch (error) {
        console.error('Error deleting poster:', error);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  return (
    <AdminPageLayout>
      <AdminPageHeader
        title="Posters & Announcements"
        description="Manage important announcements and notices"
        action={
          <AdminButton>
            <Plus size={18} />
            Create Poster
          </AdminButton>
        }
      />

      <div className="space-y-3 sm:space-y-4">
        {loading ? (
          <AdminLoading />
        ) : (
          posters.map((poster) => (
            <div key={poster._id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{poster.title}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${getPriorityColor(poster.priority)}`}>
                      {poster.priority}
                    </span>
                    {poster.is_active ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{poster.content}</p>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                    <span>Type: {poster.poster_type}</span>
                    <span>•</span>
                    <span>Views: {poster.view_count}</span>
                    <span>•</span>
                    <span>Created: {new Date(poster.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="View">
                    <Eye size={18} />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="Edit">
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(poster._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminPageLayout>
  );
};

export default Posters;
