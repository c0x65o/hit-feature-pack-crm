'use client';

import React from 'react';
import { useUi } from '@hit/ui-kit';
import { TaskWidget } from '../components/TaskWidget';
import { StuckDealsWidget } from '../components/StuckDealsWidget';
import { ActivityFeed } from '../components/ActivityFeed';

export function Dashboard() {
  const { Page, Card } = useUi();

  return (
    <Page
      title="CRM Dashboard"
      description="Your CRM overview and key metrics"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Task Widget - High priority tasks due today or past due */}
        <Card>
          <TaskWidget />
        </Card>

        {/* Stuck Deals Widget - Deals in current stage > 7 days */}
        <Card>
          <StuckDealsWidget />
        </Card>

        {/* Recent Activity Feed - Last 15 activities */}
        <div className="col-span-1 md:col-span-3">
          <Card>
            <ActivityFeed limit={15} />
          </Card>
        </div>
      </div>
    </Page>
  );
}

export default Dashboard;

