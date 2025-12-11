'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useCrmActivities } from '../hooks/useCrmActivities';

export function ActivityList() {
  const { Page, Card, Button, DataTable, Spinner } = useUi();
  const { data, loading } = useCrmActivities({});

  return (
    <Page
      title="Activities"
      description="View and manage activities"
      actions={
        <Button variant="primary" onClick={() => window.location.href = '/crm/activities/new'}>
          <Plus size={16} className="mr-2" />
          New Activity
        </Button>
      }
    >
      <Card>
        {loading ? (
          <Spinner />
        ) : (
          <DataTable
            columns={[
              { key: 'activityType', label: 'Type' },
              { key: 'taskDescription', label: 'Description' },
              { key: 'taskDueDate', label: 'Due Date' },
              { key: 'createdOnTimestamp', label: 'Created', sortable: true },
            ]}
            data={data || []}
            onRowClick={(row) => {
              window.location.href = `/crm/activities/${row.id}`;
            }}
          />
        )}
      </Card>
    </Page>
  );
}

export default ActivityList;

