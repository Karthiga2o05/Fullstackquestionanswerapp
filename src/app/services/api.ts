// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('xcyber_token');
};

// Set auth token in localStorage
const setAuthToken = (token: string): void => {
  localStorage.setItem('xcyber_token', token);
};

// Remove auth token from localStorage
const removeAuthToken = (): void => {
  localStorage.removeItem('xcyber_token');
};

// API request helper
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
};

// Authentication API
export const authAPI = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'USER';
  }) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response;
  },

  getProfile: async () => {
    return await apiRequest('/auth/profile');
  },

  logout: () => {
    removeAuthToken();
  },
};

// Section API
export const sectionAPI = {
  getAll: async () => {
    return await apiRequest('/sections');
  },

  getAllAdmin: async () => {
    return await apiRequest('/admin/sections');
  },

  create: async (sectionData: { sectionName: string }) => {
    return await apiRequest('/admin/sections', {
      method: 'POST',
      body: JSON.stringify(sectionData),
    });
  },

  delete: async (id: string) => {
    return await apiRequest(`/admin/sections/${id}`, {
      method: 'DELETE',
    });
  },
};

// Question API
export const questionAPI = {
  getBySectionId: async (sectionId: string) => {
    return await apiRequest(`/questions/${sectionId}`);
  },

  getBySectionIdAdmin: async (sectionId: string) => {
    return await apiRequest(`/admin/questions/${sectionId}`);
  },
};

// Admin API
export const adminAPI = {
  createQuestion: async (questionData: {
    sectionId: string;
    questionText: string;
    questionType: 'MCQ' | 'FILL_IN_BLANK';
    options?: { A: string; B: string; C: string; D: string };
    correctAnswer: string;
  }) => {
    return await apiRequest('/admin/questions', {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
  },

  updateQuestion: async (
    id: string,
    questionData: {
      questionText?: string;
      questionType?: 'MCQ' | 'FILL_IN_BLANK';
      options?: { A: string; B: string; C: string; D: string };
      correctAnswer?: string;
    }
  ) => {
    return await apiRequest(`/admin/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(questionData),
    });
  },

  deleteQuestion: async (id: string) => {
    return await apiRequest(`/admin/questions/${id}`, {
      method: 'DELETE',
    });
  },

  getDashboardStats: async () => {
    return await apiRequest('/admin/dashboard');
  },
};

// Answer API
export const answerAPI = {
  submit: async (answerData: { 
    sectionId: string;
    questionId: string; 
    answerText: string;
  }) => {
    return await apiRequest('/answers', {
      method: 'POST',
      body: JSON.stringify(answerData),
    });
  },

  getUserAnswers: async () => {
    return await apiRequest('/answers/user');
  },

  getUserAnswersBySection: async (sectionId: string) => {
    return await apiRequest(`/answers/section/${sectionId}`);
  },
};

export { getAuthToken, setAuthToken, removeAuthToken };
