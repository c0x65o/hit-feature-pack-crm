'use client';

import React from 'react';
import { useUi } from '@hit/ui-kit';
import { TaskWidget } from '../components/TaskWidget';
import { StuckDealsWidget } from '../components/StuckDealsWidget';
import { ActivityFeed } from '../components/ActivityFeed';
import { SummaryCards } from '../components/SummaryCards';
import { PipelineMetrics } from '../components/PipelineMetrics';
import { OpportunitiesByStageChart } from '../components/OpportunitiesByStageChart';
import { LeadsByStatusChart } from '../components/LeadsByStatusChart';

interface DashboardProps {
  onNavigate?: (path: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { Page, Card, Button, Alert, Spinner } = useUi();

  const navigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  return (
    <Page
      title="CRM Dashboard"
      description="Manage leads, opportunities, contacts, and accounts"
      actions={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/crm/contacts/new')}>
            New Contact
          </Button>
          <Button variant="primary" onClick={() => navigate('/crm/deals/new')}>
            New Deal
          </Button>
        </div>
      }
    >
      {/* Summary Cards - Leads, Opportunities, Contacts, Accounts, Activities */}
      <div className="mb-6">
        <SummaryCards onNavigate={onNavigate} />
      </div>

      {/* Pipeline Metrics - Pipeline Value, Won Value, Recent Conversions */}
      <div className="mb-6">
        <PipelineMetrics />
      </div>

      {/* Task Widget and Stuck Deals Widget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Task Widget - High priority tasks due today or past due */}
        <Card>
          <TaskWidget />
        </Card>

        {/* Stuck Deals Widget - Deals in current stage > 7 days */}
        <Card>
          <StuckDealsWidget />
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
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

