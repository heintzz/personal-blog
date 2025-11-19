'use client';

import { useAdminHeader } from '@/app/hooks/AdminHeaderContext';

import { ChevronLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TopBar() {
  const { name } = useAdminHeader();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-white border-b border-slate-200 p-4 md:p-6 flex items-center justify-between">
      {isMobile ? (
        <div></div>
      ) : (
        <div className="flex items-center gap-4">
          {pathname.split('/').length > 3 && (
            <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-lg">
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
          )}
        </div>
      )}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-medium text-sm">
          {name
            ? name
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase())
                .join('')
                .slice(0, 2)
            : 'AD'}
        </div>
      </div>
    </div>
  );
}
