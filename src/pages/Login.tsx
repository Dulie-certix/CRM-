import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';
import logo from "../assets/logo.png";
import man  from "../assets/man.png"


interface LoginForm {
  email: string;
  password: string;
}

/* ── Venture logo mark ── */
const LogoMark: React.FC<{ light?: boolean }> = ({ light }) => (
  <div className="flex items-center gap-2">
    <img src={logo} alt="Venture logo" className="w-[51px] h-[43px]" />
    <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '36.43px', lineHeight: '140%', letterSpacing: '0%' }}
          className={light ? 'text-white' : 'text-[#111827]'}>
      Venture
    </span>
  </div>
);

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const [apiError, setApiError]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const [remember, setRemember]   = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setApiError('');
    try {
      const res = await api.post('/auth/login', data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err: unknown) {
      setApiError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Invalid email or password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-col w-[55%] bg-[#0a0a2e] pl-[64px] pt-[50px] relative overflow-hidden">
        <LogoMark light />

        {/* Hero text */}
        <div style={{ position: 'absolute', width: '602px', height: '149px', top: '138px', left: '68px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div>
            <h2 style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '34px', lineHeight: '100%' }}
                className="text-white m-0">
              Sign in to
            </h2>
            <h3 style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: '24px', lineHeight: '100%' }}
                className="text-white/80 m-0">
              Lorem Ipsum is simply
            </h3>
          </div>
          <p style={{ fontFamily: 'Poppins', fontWeight: 300, fontSize: '13px', lineHeight: '100%' }}
             className="text-white/50 m-0">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
          </p>
        </div>

        {/* 3-D illustration */}
        <img
          src={man}
          alt="3D illustration"
          style={{ width: '645.76px', height: '645.76px', top: '143px', left: '169px', opacity: 1 }}
          className="absolute object-contain"
        />
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center bg-white relative">

        {/* Logo — exact position from design */}
        <div style={{ position: 'absolute', width: '209.46px', height: '51px', top: '50.25px', left: '64px', display: 'flex', alignItems: 'center', gap: '21.86px' }}>
          <img src={logo} alt="Venture logo" className="w-8 h-8" />
          <span className="font-semibold text-lg tracking-tight text-[#111827]">Venture</span>
        </div>

        <div className="w-full max-w-[380px] px-8 py-12">

          {/* Poppins 400, 24px */}
          <h1 style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: '24px', lineHeight: '100%', letterSpacing: 0 }}
              className="text-[#111827] mb-6">
            Nice to see you again
          </h1>

          {apiError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label style={{ fontFamily: 'Poppins', fontWeight: 300, fontSize: '13px', lineHeight: '100%' }}
                     className="block text-[#6B7280] mb-1.5">Login</label>
              <input
                type="email"
                placeholder="Email or phone number"
                autoComplete="email"
                className={`w-full px-4 py-3 rounded-xl bg-[#F4F5F7] text-sm text-[#111827]
                  placeholder:text-[#9CA3AF] outline-none border
                  ${errors.email ? 'border-red-400' : 'border-transparent'}
                  focus:border-[#5B5BD6] transition`}
                {...register('email', { required: true })}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ fontFamily: 'Poppins', fontWeight: 300, fontSize: '13px', lineHeight: '100%' }}
                     className="block text-[#6B7280] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className={`w-full px-4 py-3 pr-11 rounded-xl bg-[#F4F5F7] text-sm text-[#111827]
                    placeholder:text-[#9CA3AF] outline-none border
                    ${errors.password ? 'border-red-400' : 'border-transparent'}
                    focus:border-[#5B5BD6] transition`}
                  {...register('password', { required: true })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                {/* Toggle switch */}
                <button
                  type="button"
                  onClick={() => setRemember(!remember)}
                  className={`relative w-9 h-5 rounded-full transition-colors duration-200
                    ${remember ? 'bg-[#5B5BD6]' : 'bg-[#D1D5DB]'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow
                    transition-transform duration-200 ${remember ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
                <span style={{ fontFamily: 'Poppins', fontWeight: 300, fontSize: '13px' }}
                      className="text-[#374151]">Remember me</span>
              </label>
              <button type="button"
                      style={{ fontFamily: 'Poppins', fontWeight: 300, fontSize: '13px' }}
                      className="text-[#5B5BD6] hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Sign in */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#0a0a2e] text-white text-sm font-semibold
                hover:bg-[#12124a] transition disabled:opacity-60 mt-1"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5" />

          {/* Google */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl
              bg-[#2d2d2d] text-white text-sm font-medium hover:bg-[#1a1a1a] transition"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Or sign in with Google
          </button>

          {/* Sign up */}
          <p style={{ fontFamily: 'Poppins', fontWeight: 300, fontSize: '13px' }}
             className="text-center text-[#6B7280] mt-6">
            Dont have an account?{' '}
            <Link to="/register" className="text-[#5B5BD6] font-medium hover:underline">
              Sign up now
            </Link>
          </p>
        </div>
      </div> 
    </div>
  );
};

export default Login;
