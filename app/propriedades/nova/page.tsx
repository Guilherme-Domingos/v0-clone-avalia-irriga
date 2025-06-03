'use client';

import { useRouter } from 'next/navigation';
import { AuthenticatedPage } from '@/components/auth/authenticated-page';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { PageLayout } from '@/components/layout/page-layout';
import { PropriedadeForm } from '@/components/forms/propriedade-form';
import { useCreatePropriedade } from '@/lib/hooks/use-propriedades';
import { LoadingSpinner } from '@/components/ui/feedback';
import toast from 'react-hot-toast';

export default function NovaPropriedade() {
  const router = useRouter();
  const createPropriedade = useCreatePropriedade();

  const handleSubmit = async (data: any) => {
    try {
      await createPropriedade.mutateAsync(data);
      toast.success('Propriedade criada com sucesso!');
      router.push('/fazendas');
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <AuthenticatedPage>
      <PageLayout title='Nova Propriedade' showBackButton onBack={handleCancel}>
        <div className='p-4 pb-20'>
          <div className='relative'>
            {createPropriedade.isPending && (
              <div className='absolute inset-0 bg-white/50 flex items-center justify-center z-10'>
                <LoadingSpinner />
              </div>
            )}
            <PropriedadeForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              submitLabel='Criar Propriedade'
              isLoading={createPropriedade.isPending}
            />
          </div>
        </div>
      </PageLayout>
    </AuthenticatedPage>
  );
}
