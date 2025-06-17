'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { authClient } from '@/utils/auth-client';

export default function Cadastro() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem!');
      return;
    }
    setIsLoading(true);
    try {
      await authClient.signUp.email({ email, password, name, callbackURL: 'http://localhost:3000/login' });
      toast.success('Cadastro realizado com sucesso!');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao cadastrar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-white'>
      <div className='w-full max-w-md p-6 space-y-6'>
        <div className='flex flex-col items-center justify-center'>
          <div className='bg-white p-2 rounded-xl'>
            <Image
              src='/logo.png'
              alt='AvaliaIrriga Logo'
              width={80}
              height={80}
              className='object-contain'
            />
          </div>
          <h1 className='mt-4 text-3xl font-bold text-gray-900'>
            AvaliaIrriga
          </h1>
        </div>
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <h2 className='text-2xl font-bold text-center mb-6'>Cadastro</h2>
          <form onSubmit={handleRegister} className='space-y-4'>
            <Input
              type='text'
              placeholder='Nome completo'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input
              type='email'
              placeholder='usuario@email.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input
              type='password'
              placeholder='Senha'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input
              type='password'
              placeholder='Confirmar senha'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <Button
              type='submit'
              className='w-full bg-teal-600 hover:bg-teal-700 text-white'
              disabled={isLoading}>
              {isLoading ? 'CADASTRANDO...' : 'CADASTRAR'}
            </Button>
          </form>
        </div>
        <div className='text-center'>
          <span className='text-sm text-gray-600'>Já possui conta? </span>
          <Link href='/login' className='text-sm text-teal-600 hover:underline'>
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}
