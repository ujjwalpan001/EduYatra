// frontend/src/pages/admin/Sliders.tsx
import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { listSliders, createSlider, updateSlider, deleteSlider } from '../../lib/api/admin';

const Sliders: React.FC = () => {
  const [sliders, setSliders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const data = await listSliders({ page: 1, limit: 50 });
      setSliders(data.sliders);
    } catch (error) {
      console.error('Error fetching sliders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleDelete = async (sliderId: string) => {
    if (window.confirm('Are you sure you want to delete this slider?')) {
      try {
        await deleteSlider(sliderId);
        fetchSliders();
      } catch (error) {
        console.error('Error deleting slider:', error);
      }
    }
  };

  const toggleActive = async (sliderId: string, currentStatus: boolean) => {
    try {
      await updateSlider(sliderId, { is_active: !currentStatus });
      fetchSliders();
    } catch (error) {
      console.error('Error updating slider:', error);
    }
  };

  return (
    <AdminPageLayout>
      <AdminPageHeader
        title="Slider Management"
        description="Manage homepage sliders and banners"
        action={
          <AdminButton onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Add Slider
          </AdminButton>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {loading ? (
          <div className="col-span-full">
            <AdminLoading />
          </div>
        ) : (
          sliders.map((slider) => (
            <div key={slider._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative h-48 bg-gray-200">
                <img
                  src={slider.image_url || '/placeholder.jpg'}
                  alt={slider.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  {slider.is_active ? (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-500 text-white text-xs font-semibold rounded">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">{slider.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{slider.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Order: {slider.display_order}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleActive(slider._id, slider.is_active)}
                      className="p-2 text-gray-600 hover:text-gray-900"
                      title={slider.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {slider.is_active ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button className="p-2 text-blue-600 hover:text-blue-900" title="Edit">
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(slider._id)}
                      className="p-2 text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminPageLayout>
  );
};

export default Sliders;
