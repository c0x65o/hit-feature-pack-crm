'use client';

import React, { useState, useEffect } from 'react';
import { useUi } from '@hit/ui-kit';
import { useCrmDeals } from '../hooks/useCrmDeals';
import { useCrmPipelineStages } from '../hooks/useCrmPipelineStages';

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
  const [amount, setAmount] = useState('');
  const [closeDateEstimate, setCloseDateEstimate] = useState('');
  const [pipelineStage, setPipelineStage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (deal) {
      setDealName(deal.dealName || '');
      setAmount(deal.amount?.toString() || '');
      setCloseDateEstimate(deal.closeDateEstimate ? new Date(deal.closeDateEstimate).toISOString().split('T')[0] : '');
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
    if (!amount.trim()) {
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
        amount: parseFloat(amount),
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

  return (
    <Page title={dealId ? 'Edit Deal' : 'New Deal'}>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Deal Name"
            value={dealName}
            onChange={setDealName}
            required
            error={fieldErrors.dealName}
          />
          <Input
            label="Amount"
            type="number"
            value={amount}
            onChange={setAmount}
            required
            error={fieldErrors.amount}
          />
          <Input
            label="Close Date Estimate"
            type="text"
            value={closeDateEstimate}
            onChange={setCloseDateEstimate}
            placeholder="YYYY-MM-DD"
            error={fieldErrors.closeDateEstimate}
          />
          {stages && (
            <Select
              label="Pipeline Stage"
              options={stages.map((s) => ({ value: s.id, label: s.name }))}
              value={pipelineStage}
              onChange={setPipelineStage}
              required
              error={fieldErrors.pipelineStage}
            />
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

