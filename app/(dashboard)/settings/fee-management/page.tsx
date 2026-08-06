// app/(dashboard)/settings/fee-management/page.tsx

'use client';

import React, { useState } from 'react';
import { FeeComponentTable } from '@/frontend/settings/fee-components/components/fee-component-table';
import { FeeStructureTable } from '@/frontend/settings/fee-structures/components/fee-structure-table';

export default function FeeManagementPage() {
  const [activeTab, setActiveTab] = useState<'components' | 'structures'>('components');
  const tenantId = '00000000-0000-0000-0000-000000000000';

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Fee Management Setup
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Configure baseline fee component masters and set up academic fee structures.
        </p>
      </div>

      {/* Dynamic Tab Switcher */}
      <div className="border-b border-zinc-200 dark:border-zinc-800">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('components')}
            className={`py-2.5 text-sm font-semibold border-b-2 ${
              activeTab === 'components'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
            }`}
          >
            Fee Components
          </button>
          <button
            onClick={() => setActiveTab('structures')}
            className={`py-2.5 text-sm font-semibold border-b-2 ${
              activeTab === 'structures'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
            }`}
          >
            Fee Structures
          </button>
        </nav>
      </div>

      {activeTab === 'components' ? (
        <FeeComponentTable tenantId={tenantId} />
      ) : (
        <FeeStructureTable tenantId={tenantId} />
      )}
    </div>
  );
}