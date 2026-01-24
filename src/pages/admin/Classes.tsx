// frontend/src/pages/admin/Classes.tsx
import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, Users, X } from 'lucide-react';
import { listAllClasses, getClassDetails } from '../../lib/api/admin';

const Classes: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<any>(null);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await listAllClasses({ page, limit: 20, search });
      setClasses(data.classes);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [page, search]);

  const openDetails = async (classId: string) => {
    try {
      setDetailsLoading(true);
      setDetailsOpen(true);
      const data = await getClassDetails(classId);
      setSelectedDetails(data.class);
    } catch (err) {
      console.error('Failed to load class details', err);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Classes Management</h1>
          <p className="text-gray-600 mt-1">Manage all classes across the platform</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus size={20} />
          Add Class
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search classes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          classes.map((cls) => (
            <div key={cls._id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{cls.class_name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Teacher: {cls.teacher?.name || cls.teacher_id?.username || cls.teacher_id?.fullName || 'Unknown'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <Users size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">{cls.studentCount || 0} students</span>
              </div>
              
              <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                <button onClick={() => openDetails(cls._id)} className="flex-1 py-2 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                  View Details
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                  <Edit size={18} />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.pages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-lg font-semibold">Class Details</h3>
              <button onClick={() => { setDetailsOpen(false); setSelectedDetails(null); }} className="p-1.5 rounded hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {detailsLoading ? (
                <div className="py-10 flex justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
                </div>
              ) : selectedDetails ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500">Class</div>
                    <div className="text-base font-medium">{selectedDetails.class_name}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded p-3">
                      <div className="text-sm text-gray-500">Teacher Name</div>
                      <div className="font-medium">{selectedDetails.teacher?.name || '—'}</div>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <div className="text-sm text-gray-500">Teacher Email</div>
                      <div className="font-medium">{selectedDetails.teacher?.email || '—'}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Students</div>
                    <div className="overflow-x-auto border rounded">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {(selectedDetails.students || []).map((s: any, idx: number) => (
                            <tr key={idx}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{s.name || '—'}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{s.email || '—'}</td>
                            </tr>
                          ))}
                          {(!selectedDetails.students || selectedDetails.students.length === 0) && (
                            <tr>
                              <td colSpan={2} className="px-4 py-6 text-center text-sm text-gray-500">No students found</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-600">No details available.</div>
              )}
            </div>
            <div className="px-4 py-3 border-t flex justify-end">
              <button onClick={() => { setDetailsOpen(false); setSelectedDetails(null); }} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;
