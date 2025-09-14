// Modo demo estático: autenticación simulada en localStorage

interface LoginResponse {
  token: string;
  user_id: number;
  username: string;
  is_staff: boolean;
}

export const login = async (username: string, _password: string): Promise<LoginResponse> => {
  // Usuario "admin" será administrador en el demo
  const isStaff = username.trim().toLowerCase() === 'admin';
  const response: LoginResponse = {
    token: Math.random().toString(36).slice(2),
    user_id: 1,
    username,
    is_staff: isStaff
  };
  localStorage.setItem('token', response.token);
  localStorage.setItem('user', JSON.stringify({
    id: response.user_id,
    username: response.username,
    isStaff: response.is_staff
  }));
  return response;
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('token') !== null;
};

export const isAdmin = (): boolean => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return false;
  try {
    const user = JSON.parse(userStr);
    return user.isStaff === true;
  } catch (e) {
    return false;
  }
};

export const getAuthHeader = () => {
  return {};
};