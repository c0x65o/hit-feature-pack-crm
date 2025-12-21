'use client';

import React from 'react';
import { useUi } from '@hit/ui-kit';

export function Dashboard() {
  const { Page, Card, Spinner, Button } = useUi();

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    window.location.replace('/dashboards?pack=crm');
  }, []);

  return (
    <Page
      title="CRM Dashboard"
      description="Redirecting to dashboards…"
      actions={
        <Button variant="secondary" onClick={() => (window.location.href = '/dashboards?pack=crm')}>
          Open Dashboards
        </Button>
      }
    >
      <Card>
        <div style={{ padding: 16 }}>
          <Spinner />
        </div>
      </Card>
    </Page>
  );
}

export default Dashboard;

