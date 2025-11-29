// pages/LoginPage.tsx

import React, { useState } from 'react';
import { LogIn, User, Lock } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Chuyển hướng nếu đã đăng nhập
  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(username, password);

    if (success) {
      navigate('/dashboard', { replace: true });
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 flex items-center justify-center space-x-2">
          <LogIn className="w-8 h-8 text-blue-600" />
          <span>Đăng nhập Admin LMS</span>
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tên đăng nhập"
            type="text"
            icon={<User />}
            placeholder="sManager"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            label="Mật khẩu"
            type="password"
            icon={<Lock />}
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            isLoading={loading}
            className="w-full"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;