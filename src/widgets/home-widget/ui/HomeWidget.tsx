'use client';

import { useTranslations } from 'next-intl';

export function HomeWidget() {
  const t = useTranslations('HomePage');

  return (
    <main
      id="main-content"
      className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-slate-100"
    >
      <div className="container mx-auto px-4 py-8 text-center">
        <header className="mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">{t('welcome')}</h1>
          <p className="text-xl text-slate-600 mb-8">{t('subtitle')}</p>
        </header>

        <section className="bg-white rounded-lg shadow-lg p-8 mb-8 max-w-2xl mx-auto">
          <p className="text-lg text-slate-700 leading-relaxed mb-6">{t('description')}</p>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-green-600">
              <span className="text-2xl">✓</span>
              <span className="text-lg font-medium">{t('feature1')}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-green-600">
              <span className="text-2xl">✓</span>
              <span className="text-lg font-medium">{t('feature2')}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-green-600">
              <span className="text-2xl">✓</span>
              <span className="text-lg font-medium">{t('feature3')}</span>
            </div>
          </div>
        </section>

        <footer className="text-slate-600 text-sm">
          <p>{t('footer')}</p>
        </footer>
      </div>
    </main>
  );
}
