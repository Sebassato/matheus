
import React, { useState } from 'react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Admin' && password === '01020304') {
      setError('');
      onLoginSuccess();
    } else {
      setError('Usuário ou senha inválidos.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-dark-gray p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-neon-yellow mb-8">Acesso Restrito</h2>
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300">Usuário</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full bg-medium-gray border-gray-600 rounded-md shadow-sm focus:border-neon-blue focus:ring-neon-blue"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full bg-medium-gray border-gray-600 rounded-md shadow-sm focus:border-neon-blue focus:ring-neon-blue"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-neon-blue hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Entrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
