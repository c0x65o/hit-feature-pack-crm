'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUi } from '@hit/ui-kit';
import { StuckDealsWidget } from '../components/StuckDealsWidget';
import { ActivityFeed } from '../components/ActivityFeed';
import { SummaryCards } from '../components/SummaryCards';
import { PipelineMetrics } from '../components/PipelineMetrics';
import { OpportunitiesByStageChart } from '../components/OpportunitiesByStageChart';
import { LeadsByStatusChart } from '../components/LeadsByStatusChart';
import { DealsWeeklyChart } from '../components/DealsWeeklyChart';

export function Dashboard() {
  const router = useRouter();
  const { Page, Card, Button } = useUi();

  const navigate = (path: string) => router.push(path);

  return (
    <Page
      title="CRM Dashboard"
      description="Manage companies, contacts, and deals"
      actions={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/crm/companies/new')}>
            New Company
          </Button>
          <Button variant="secondary" onClick={() => navigate('/crm/contacts/new')}>
            New Contact
          </Button>
          <Button variant="primary" onClick={() => navigate('/crm/deals/new')}>
            New Deal
          </Button>
        </div>
      }
    >
      {/* Summary Cards - Companies, Contacts, Deals */}
      <div className="mb-6">
        <SummaryCards />
      </div>

      {/* Pipeline Metrics - Pipeline Value, Won Value */}
      <div className="mb-6">
        <PipelineMetrics />
      </div>

      {/* Deals Weekly Progress Chart */}
      <div className="mb-6">
        <DealsWeeklyChart />
      </div>

      {/* Stuck Deals Widget and Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Stuck Deals Widget - Deals in current stage > 7 days */}
        <Card>
          <StuckDealsWidget />
        </Card>

        {/* Opportunities by Stage */}
        <OpportunitiesByStageChart />

        {/* Leads by Status */}
        <LeadsByStatusChart />
      </div>

      {/* Recent Activity Feed - Last 15 activities */}
      <Card>
        <ActivityFeed limit={15} />
      </Card>
    </Page>
  );
}

export default Dashboard;

