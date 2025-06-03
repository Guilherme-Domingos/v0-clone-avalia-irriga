'use client';

import { useRouter } from 'next/navigation';
import { AuthenticatedPage } from '@/components/auth/authenticated-page';
import { Card } from '@/components/ui/card';
import { PageLayout } from '@/components/layout/page-layout';

export default function SelecionarTipoUnidade({
  params,
}: {
  params: { propriedadeId: string };
}) {
  const router = useRouter();

  return (
    <AuthenticatedPage>
      <PageLayout
        title='Selecionar Tipo de Unidade'
        showBackButton
        onBack={() => router.back()}>
        <div className='p-4 pb-20 space-y-6'>
          <h2 className='text-lg font-medium text-center mb-4'>
            Selecione o tipo de unidade que deseja cadastrar:
          </h2>

          <div className='space-y-4'>
            <Card
              className='p-6 bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer'
              onClick={() =>
                router.push(
                  `/unidades/${params.propriedadeId}/setor-hidraulico/nova`
                )
              }>
              <div className='text-center'>
                <h3 className='text-xl font-medium text-teal-800 mb-2'>
                  Setor Hidráulico
                </h3>
                <p className='text-gray-600'>
                  Cadastre um setor hidráulico com informações sobre emissores,
                  filtros e válvulas.
                </p>
              </div>
            </Card>
            <Card
              className='p-6 bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer'
              onClick={() =>
                router.push(
                  `/unidades/${params.propriedadeId}/pivo-central/nova`
                )
              }>
              <div className='text-center'>
                <h3 className='text-xl font-medium text-teal-800 mb-2'>
                  Sistema de Pivô Central
                </h3>
                <p className='text-gray-600'>
                  Cadastre um sistema de pivô central com informações sobre
                  torres, emissores e controle.
                </p>
              </div>
            </Card>{' '}
          </div>
        </div>
      </PageLayout>
    </AuthenticatedPage>
  );
}
