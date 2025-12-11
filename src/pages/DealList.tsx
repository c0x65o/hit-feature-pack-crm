'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useCrmDeals } from '../hooks/useCrmDeals';
import { KanbanView } from '../components/KanbanView';

export function DealList() {
  const { Page, Button, Tabs } = useUi();
  const [view, setView] = useState<'list' | 'kanban'>('kanban');

  return (
    <Page
      title="Deals"
      description="Manage your sales pipeline"
      actions={
        <Button variant="primary" onClick={() => window.location.href = '/crm/deals/new'}>
          <Plus size={16} className="mr-2" />
          New Deal
        </Button>
      }
    >
      <Tabs
        activeTab={view}
        onChange={(tabId) => setView(tabId as 'list' | 'kanban')}
        tabs={[
          { id: 'kanban', label: 'Kanban', content: <KanbanView /> },
          { id: 'list', label: 'List', content: <DealListView /> },
        ]}
      />
    </Page>
  );
}

function DealListView() {
  const { Card, DataTable, Spinner } = useUi();
  const { data, loading } = useCrmDeals({});

  return (
    <Card>
      {loading ? (
        <Spinner />
      ) : (
        <DataTable
          columns={[
            { key: 'dealName', label: 'Deal Name', sortable: true },
            { key: 'amount', label: 'Amount', sortable: true },
            { key: 'closeDateEstimate', label: 'Close Date' },
          ]}
          data={data?.items || []}
          onRowClick={(row) => {
            window.location.href = `/crm/deals/${row.id}`;
          }}
        />
      )}
    </Card>
  );
}

export default DealList;

