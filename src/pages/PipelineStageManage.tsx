'use client';

import React, { useState, useEffect } from 'react';
import { useUi } from '@hit/ui-kit';

interface PipelineStage {
  id: string;
  name: string;
  order: number;
  isClosedWon: boolean;
  isClosedLost: boolean;
}

export function PipelineStageManage({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const { Page, Card, Button, Spinner } = useUi();
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(false);

  const navigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  const fetchStages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/crm/pipeline-stages');
      if (!res.ok) throw new Error('Failed to fetch stages');
      const data = await res.json();
      setStages(data.items || []);
    } catch (error) {
      console.error('Failed to fetch pipeline stages', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeStages = async () => {
    try {
      setInitializing(true);
      const res = await fetch('/api/crm/pipeline-stages/init', {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to initialize stages');
      await fetchStages();
    } catch (error) {
      console.error('Failed to initialize pipeline stages', error);
      alert('Failed to initialize pipeline stages');
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    fetchStages();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Page 
      title="Pipeline Stages"
      description="Configure the stages your deals move through from initial contact to close"
      actions={
        stages.length === 0 ? (
          <Button
            variant="primary"
            onClick={initializeStages}
            disabled={initializing}
          >
            {initializing ? 'Initializing...' : 'Initialize Default Stages'}
          </Button>
        ) : undefined
      }
    >
      <Card>
        {stages.length === 0 ? (
          <div className="text-center py-12">
            <p className="mb-4" style={{ color: 'var(--hit-foreground)' }}>
              No pipeline stages configured yet.
            </p>
            <p className="text-sm mb-6" style={{ color: 'var(--hit-muted-foreground)' }}>
              Click "Initialize Default Stages" to create the standard sales pipeline:
              <br />
              <span className="font-medium">Lead → Qualified → Proposal → Negotiation → Closed Won / Closed Lost</span>
            </p>
            <Button
              variant="primary"
              onClick={initializeStages}
              disabled={initializing}
            >
              {initializing ? 'Initializing...' : 'Initialize Default Stages'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-4 text-sm font-medium pb-3 border-b" style={{ borderColor: 'var(--hit-border)', color: 'var(--hit-muted-foreground)' }}>
              <div>Order</div>
              <div>Stage Name</div>
              <div>Status</div>
              <div>Closed Won</div>
              <div>Closed Lost</div>
            </div>
            <div className="space-y-2">
              {stages
                .sort((a, b) => a.order - b.order)
                .map((stage) => (
                  <div
                    key={stage.id}
                    className="grid grid-cols-5 gap-4 py-3 px-4 rounded-lg border"
                    style={{ 
                      backgroundColor: 'var(--hit-muted)',
                      borderColor: 'var(--hit-border)'
                    }}
                  >
                    <div style={{ color: 'var(--hit-foreground)' }}>{stage.order}</div>
                    <div className="font-medium" style={{ color: 'var(--hit-foreground)' }}>{stage.name}</div>
                    <div style={{ color: 'var(--hit-muted-foreground)' }}>
                      {stage.isClosedWon || stage.isClosedLost ? 'Final' : 'Active'}
                    </div>
                    <div style={{ color: 'var(--hit-muted-foreground)' }}>
                      {stage.isClosedWon ? '✓' : '—'}
                    </div>
                    <div style={{ color: 'var(--hit-muted-foreground)' }}>
                      {stage.isClosedLost ? '✓' : '—'}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="pt-6 mt-6 border-t" style={{ borderColor: 'var(--hit-border)' }}>
          <p className="text-sm" style={{ color: 'var(--hit-muted-foreground)' }}>
            <strong style={{ color: 'var(--hit-foreground)' }}>Sales Workflow:</strong> When you create a deal, you'll assign it to a pipeline stage.
            Move deals through stages using the Kanban board view. Deals in "Closed Won" or "Closed Lost"
            stages are considered final.
          </p>
        </div>
      </Card>
    </Page>
  );
}

export default PipelineStageManage;

