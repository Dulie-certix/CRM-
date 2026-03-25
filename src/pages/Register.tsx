import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';
import logo from '../assets/logo.png';
import man from '../assets/man.png';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    setApiError('');
    try {
      const res = await api.post('/auth/register', data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err: unknown) {
      setApiError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-xl bg-[#F4F5F7] text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none border ${hasError ? 'border-red-400' : 'border-transparent'} focus:border-[#5B5BD6] transition`;

  return (
    <div className="min-h-screen flex font-sans">

      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-[55%] bg-[#0a0a2e] pl-[64px] pt-[50px] relative overflow-hidden">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Venture logo" className="w-[51px] h-[43px]" />
          <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '36.43px', lineHeight: '140%' }} className="text-white">
            Venture
          </span>
        </div>
        <div style={{ position: 'absolute', width: '602px', top: '138px', left: '68px' }}>
          <h2 style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '34px' }} className="text-white m-0">Create your</h2>
          <h3 style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: '24px' }} className="text-white/80 m-0">free account today</h3>
          <p style={{ fontFamily: 'Poppins', fontWeight: 300, fontSize: '13px' }} className="text-white/50 mt-4">
            Join thousands of users managing their notes and contacts with Venture CRM.
          </p>
        </div>
        <img src={man} alt="3D illustration"
          style={{ width: '645.76px', height: '645.76px', top: '143px', left: '169px', opacity: 1 }}
          className="absolute object-contain" />
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-white relative">
        <div style={{ position: 'absolute', top: '50.25px', left: '64px', display: 'flex', alignItems: 'center', gap: '21.86px' }}>
          <img src={logo} alt="Venture logo" className="w-8 h-8" />
          <span className="font-semibold text-lg tracking-tight text-[#111827]">Venture</span>
        </div>

        <div className="w-full max-w-[380px] px-8 py-12">
          <h1 style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: '24px', lineHeight: '100%' }}
            className="text-[#111827] mb-6">
            Create an account
          </h1>

          {apiError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label style={{ fontFamily: 'Poppins', fontWeight: 300, fontSize: '13px' }} className="block text-[#6B7280] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className={inputClass(!!errors.name)}
                {...register('name', { required: true })}
              />
            </div>

            <div>
              <label style={{ fontFamily: 'Poppins', fontWeight: 300, fontSize: '13px' }} className="block text-[#6B7280] mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                className={inputClass(!!errors.email)}
                {...register('email', { required: true })}
              />
            </div>

            <div>
              <label style={{ fontFamily: 'Poppins', fontWeight: 300, fontSize: '13px' }} className="block text-[#6B7280] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  className={inputClass(!!errors.password)}
                  {...register('password', { required: true, minLength: 6 })}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password?.type === 'minLength' && (
                <p className="text-xs text-red-500 mt-1">Password must be at least 6 characters</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#0a0a2e] text-white text-sm font-semibold hover:bg-[#12124a] transition disabled:opacity-60 mt-1"
            >
              {loading ? 'Creating account…' : 'Sign up'}
            </button>
          </form>

          <p style={{ fontFamily: 'Poppins', fontWeight: 300, fontSize: '13px' }}
            className="text-center text-[#6B7280] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#5B5BD6] font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
