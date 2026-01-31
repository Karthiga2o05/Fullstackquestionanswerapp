import { useState, useEffect } from 'react';
import { sectionAPI } from '@/app/services/api';
import { Plus, Trash2, Building2, AlertCircle } from 'lucide-react';

interface Section {
  _id: string;
  sectionName: string;
  createdAt: string;
}

export default function SectionManager() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      setLoading(true);
      const response = await sectionAPI.getAll();
      if (response.success) {
        setSections(response.data);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newSectionName.trim()) {
      setError('Section name is required');
      return;
    }

    try {
      const response = await sectionAPI.create({ sectionName: newSectionName });
      if (response.success) {
        setSuccess('Section created successfully');
        setNewSectionName('');
        setShowModal(false);
        loadSections();
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDeleteSection = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" section? This will also delete all questions in this section.`)) {
      return;
    }

    try {
      const response = await sectionAPI.delete(id);
      if (response.success) {
        setSuccess('Section deleted successfully');
        loadSections();
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Predefined bank/insurance options
  const bankOptions = [
    'State Bank of India (SBI)',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Punjab National Bank (PNB)',
    'Bank of Baroda',
    'Canara Bank',
    'Union Bank of India',
    'IDBI Bank',
    'Indian Bank',
  ];

  const insuranceOptions = [
    'Life Insurance Corporation (LIC)',
    'HDFC Life Insurance',
    'ICICI Prudential',
    'SBI Life Insurance',
    'Max Life Insurance',
    'Bajaj Allianz Life',
    'Kotak Mahindra Life',
    'Birla Sun Life Insurance',
    'Tata AIA Life Insurance',
    'PNB MetLife',
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Section Management</h2>
          <p className="text-slate-400">Create and manage exam sections for different banks and insurance companies</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all shadow-lg font-medium"
        >
          <Plus className="w-5 h-5" />
          Create Section
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-medium">Error</p>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-500/10 border border-green-500/50 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-400 font-medium">Success</p>
            <p className="text-green-300 text-sm">{success}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-slate-800/50 border border-slate-700/50 rounded-xl">
              <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg mb-2">No sections created yet</p>
              <p className="text-slate-500 text-sm">Click "Create Section" to add your first section</p>
            </div>
          ) : (
            sections.map((section) => (
              <div
                key={section._id}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all hover:border-blue-500/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-400" />
                  </div>
                  <button
                    onClick={() => handleDeleteSection(section._id, section.sectionName)}
                    className="p-2 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-all"
                    title="Delete section"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{section.sectionName}</h3>
                <p className="text-slate-400 text-sm">
                  Created: {new Date(section.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Section Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-700/50">
              <h3 className="text-2xl font-bold text-white">Create New Section</h3>
              <p className="text-slate-400 text-sm mt-1">Add a new bank or insurance section for exam preparation</p>
            </div>

            <form onSubmit={handleCreateSection} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Section Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., State Bank of India (SBI)"
                  required
                />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-300 mb-3">Quick Select (Banks)</p>
                <div className="grid grid-cols-2 gap-2">
                  {bankOptions.map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setNewSectionName(bank)}
                      className="px-3 py-2 bg-slate-700/50 hover:bg-blue-600/20 border border-slate-600 hover:border-blue-500/50 rounded-lg text-slate-300 hover:text-white text-sm text-left transition-all"
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-300 mb-3">Quick Select (Insurance)</p>
                <div className="grid grid-cols-2 gap-2">
                  {insuranceOptions.map((insurance) => (
                    <button
                      key={insurance}
                      type="button"
                      onClick={() => setNewSectionName(insurance)}
                      className="px-3 py-2 bg-slate-700/50 hover:bg-blue-600/20 border border-slate-600 hover:border-blue-500/50 rounded-lg text-slate-300 hover:text-white text-sm text-left transition-all"
                    >
                      {insurance}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all shadow-lg"
                >
                  Create Section
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setNewSectionName('');
                    setError('');
                  }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
