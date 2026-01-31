import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router';
import { useAuth } from '@/app/contexts/AuthContext';
import { useSections } from '@/app/contexts/SectionContext';
import { adminAPI } from '@/app/services/api';
import {
  LayoutDashboard,
  FolderOpen,
  FileQuestion,
  LogOut,
  Users,
  BarChart3,
  Plus,
  Trash2,
  Edit2,
  Building2,
} from 'lucide-react';
import SectionManager from './SectionManager';
import QuestionManager from './QuestionManager';

interface DashboardStats {
  totalSections: number;
  totalQuestions: number;
  totalUsers: number;
  totalAnswers: number;
  mcqQuestions: number;
  fillBlankQuestions: number;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderDashboard = () => (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-slate-400">Manage exam sections and questions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/10 rounded-lg">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-blue-100 text-sm font-medium">Sections</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats?.totalSections || 0}
          </div>
          <p className="text-blue-100 text-sm">Total exam sections</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/10 rounded-lg">
              <FileQuestion className="w-6 h-6 text-white" />
            </div>
            <span className="text-purple-100 text-sm font-medium">Questions</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats?.totalQuestions || 0}
          </div>
          <p className="text-purple-100 text-sm">Total questions added</p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/10 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-green-100 text-sm font-medium">Users</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats?.totalUsers || 0}
          </div>
          <p className="text-green-100 text-sm">Registered students</p>
        </div>

        <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-orange-100 text-sm font-medium">Responses</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats?.totalAnswers || 0}
          </div>
          <p className="text-orange-100 text-sm">Total answers submitted</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/10 rounded-lg">
              <FileQuestion className="w-6 h-6 text-white" />
            </div>
            <span className="text-indigo-100 text-sm font-medium">MCQ</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats?.mcqQuestions || 0}
          </div>
          <p className="text-indigo-100 text-sm">Multiple choice questions</p>
        </div>

        <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/10 rounded-lg">
              <Edit2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-pink-100 text-sm font-medium">Fill Blank</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats?.fillBlankQuestions || 0}
          </div>
          <p className="text-pink-100 text-sm">Fill in the blank questions</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setCurrentView('sections')}
            className="flex items-center gap-3 p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg hover:bg-blue-600/20 transition-colors text-left"
          >
            <div className="p-2 bg-blue-600 rounded-lg">
              <FolderOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-medium">Manage Sections</div>
              <div className="text-slate-400 text-sm">Create and organize exam sections</div>
            </div>
          </button>

          <button
            onClick={() => setCurrentView('questions')}
            className="flex items-center gap-3 p-4 bg-purple-600/10 border border-purple-500/20 rounded-lg hover:bg-purple-600/20 transition-colors text-left"
          >
            <div className="p-2 bg-purple-600 rounded-lg">
              <FileQuestion className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-medium">Manage Questions</div>
              <div className="text-slate-400 text-sm">Add, edit, and delete questions</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-slate-800/90 backdrop-blur-sm border-r border-slate-700/50 p-6 z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">XCyber</h1>
            <p className="text-xs text-blue-300">Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-2 mb-8">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentView('sections')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'sections'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            <FolderOpen className="w-5 h-5" />
            <span className="font-medium">Sections</span>
          </button>

          <button
            onClick={() => setCurrentView('questions')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'questions'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            <FileQuestion className="w-5 h-5" />
            <span className="font-medium">Questions</span>
          </button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
            <p className="text-xs text-slate-400 mb-1">Logged in as</p>
            <p className="text-white font-medium">{user?.name}</p>
            <p className="text-xs text-blue-300">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {currentView === 'dashboard' && renderDashboard()}
          {currentView === 'sections' && <SectionManager />}
          {currentView === 'questions' && <QuestionManager />}
        </div>
      </div>
    </div>
  );
}
