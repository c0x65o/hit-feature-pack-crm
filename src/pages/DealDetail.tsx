'use client';

import React from 'react';
import { useUi } from '@hit/ui-kit';
import { useCrmDeals } from '../hooks/useCrmDeals';
import { DealHeader } from '../components/DealHeader';
import { ActivityLog } from '../components/ActivityLog';

interface DealDetailProps {
  id: string;
  onNavigate?: (path: string) => void;
}

export function DealDetail({ id, onNavigate }: DealDetailProps) {
  const dealId = id === 'new' ? undefined : id;
  const { Page, Spinner, Alert } = useUi();
  const { data: deal, loading } = useCrmDeals({ id: dealId });

  if (loading) {
    return <Spinner />;
  }

  if (!deal) {
    return (
      <Alert variant="error" title="Deal not found">
        The deal you're looking for doesn't exist.
      </Alert>
    );
  }

  return (
    <Page title={deal.dealName}>
      <DealHeader deal={deal} />
      <ActivityLog dealId={dealId || ''} />
    </Page>
  );
}

export default DealDetail;

