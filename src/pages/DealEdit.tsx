'use client';

import React, { useState, useEffect } from 'react';
import { Users, Handshake } from 'lucide-react';
import { useUi, type BreadcrumbItem } from '@hit/ui-kit';
import { useCrmDeals } from '../hooks/useCrmDeals';
import { useCrmPipelineStages } from '../hooks/useCrmPipelineStages';
import { CurrencyInput, DateInput } from '../components/fields';

interface DealEditProps {
  id?: string;
  onNavigate?: (path: string) => void;
}

export function DealEdit({ id, onNavigate }: DealEditProps) {
  const dealId = id === 'new' ? undefined : id;
  const { Page, Card, Input, Button, Select, Spinner } = useUi();
  const { data: deal, loading, createDeal, updateDeal } = useCrmDeals({ id: dealId });
  const { data: stages } = useCrmPipelineStages();

  const [dealName, setDealName] = useState('');
  const [amount, setAmount] = useState<number | null>(null);
  const [closeDateEstimate, setCloseDateEstimate] = useState<string | null>(null);
  const [pipelineStage, setPipelineStage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (deal) {
      setDealName(deal.dealName || '');
      setAmount(deal.amount ? (typeof deal.amount === 'string' ? parseFloat(deal.amount) : deal.amount) : null);
      setCloseDateEstimate(deal.closeDateEstimate ? new Date(deal.closeDateEstimate).toISOString().split('T')[0] : null);
      setPipelineStage(deal.pipelineStage || '');
    }
  }, [deal]);

  const navigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!dealName.trim()) {
      errors.dealName = 'Deal Name is required';
    }
    if (amount === null || Number.isNaN(amount)) {
      errors.amount = 'Amount is required';
    }
    if (!pipelineStage) {
      errors.pipelineStage = 'Pipeline Stage is required';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const data = {
        dealName,
        amount: amount!,
        closeDateEstimate: closeDateEstimate || undefined,
        pipelineStage,
      };
      if (dealId) {
        await updateDeal(dealId, data);
        navigate(`/crm/deals/${dealId}`);
      } else {
        const newDeal = await createDeal(data);
        navigate(`/crm/deals/${newDeal.id}`);
      }
    } catch {
      // Error handled by hook
    }
  };

  if (loading && dealId) {
    return <Spinner />;
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'CRM', href: '/crm', icon: <Users size={14} /> },
    { label: 'Deals', href: '/crm/deals', icon: <Handshake size={14} /> },
    ...(dealId && deal ? [{ label: deal.dealName, href: `/crm/deals/${dealId}` }] : []),
    { label: dealId ? 'Edit' : 'New' },
  ];

  return (
    <Page 
      title={dealId ? 'Edit Deal' : 'New Deal'}
      breadcrumbs={breadcrumbs}
      onNavigate={navigate}
    >
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Deal Name"
            value={dealName}
            onChange={setDealName}
            required
            error={fieldErrors.dealName}
          />
          <CurrencyInput
            label="Amount"
            value={amount}
            onChange={setAmount}
            required
            error={fieldErrors.amount}
          />
          <DateInput
            label="Close Date Estimate"
            value={closeDateEstimate}
            onChange={setCloseDateEstimate}
            error={fieldErrors.closeDateEstimate}
          />
          {stages && stages.length > 0 ? (
            <Select
              label="Pipeline Stage"
              options={stages.map((s) => ({ value: s.id, label: s.name }))}
              value={pipelineStage}
              onChange={setPipelineStage}
              required
              error={fieldErrors.pipelineStage}
            />
          ) : (
            <div className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
              <p className="text-yellow-400 text-sm mb-3">
                No pipeline stages configured. You need to set up pipeline stages before creating deals.
              </p>
              <button
                type="button"
                onClick={() => navigate('/crm/pipeline-stages')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Setup Pipeline Stages
              </button>
            </div>
          )}
          <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-800">
            <Button type="submit" variant="primary">
              {dealId ? 'Update' : 'Create'} Deal
            </Button>
          </div>
        </form>
      </Card>
    </Page>
  );
}

export default DealEdit;

