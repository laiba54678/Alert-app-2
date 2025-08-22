import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const { authenticateWithToken } = useAuth();


  return (
    <div className="min-h-screen grid place-items-center">
      <div className="w-full max-w-sm bg-white border rounded-lg p-6">
        <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
                 <form
           className="space-y-4"
           onSubmit={(e) => {
             e.preventDefault();
             setError('');
             
             // Dummy login for demo
             if (email === 'admin@gmail.com' && password === '1234') {
               const base64UrlEncode = (obj) => {
                 const json = JSON.stringify(obj);
                 const b64 = btoa(json);
                 return b64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
               };
               const header = { alg: 'none', typ: 'JWT' };
               const payload = {
                 sub: 'admin-user-id',
                 email: 'admin@gmail.com',
                 is_admin: true,
                 roles: ['admin'],
                 exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
               };
               const fakeToken = `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.`;
               authenticateWithToken(fakeToken);
               navigate(from, { replace: true });
             } else {
               setError('Invalid credentials. Use admin@gmail.com / 1234');
             }
           }}
         >
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input className="w-full border rounded-md px-3 py-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input className="w-full border rounded-md px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-sidebar-primary text-white rounded-md px-3 py-2">Sign in</button>
        </form>
      </div>
    </div>
  );
}


