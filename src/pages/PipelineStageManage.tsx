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
    <Page title="Pipeline Stages">
      <Card>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Sales Pipeline Stages</h2>
              <p className="text-sm text-gray-400 mt-1">
                Pipeline stages define the steps a deal goes through from initial contact to close.
              </p>
            </div>
            {stages.length === 0 && (
              <Button
                variant="primary"
                onClick={initializeStages}
                disabled={initializing}
              >
                {initializing ? 'Initializing...' : 'Initialize Default Stages'}
              </Button>
            )}
          </div>

          {stages.length === 0 ? (
            <div className="text-center py-12 border border-gray-700 rounded-lg bg-gray-800/50">
              <p className="text-gray-400 mb-4">No pipeline stages configured yet.</p>
              <p className="text-sm text-gray-500 mb-6">
                Click "Initialize Default Stages" to create the standard sales pipeline:
                <br />
                Lead → Qualified → Proposal → Negotiation → Closed Won / Closed Lost
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
            <div className="space-y-3">
              <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-400 pb-2 border-b border-gray-700">
                <div>Order</div>
                <div>Stage Name</div>
                <div>Status</div>
                <div>Closed Won</div>
                <div>Closed Lost</div>
              </div>
              {stages
                .sort((a, b) => a.order - b.order)
                .map((stage) => (
                  <div
                    key={stage.id}
                    className="grid grid-cols-5 gap-4 py-3 px-4 bg-gray-800/50 rounded-lg border border-gray-700"
                  >
                    <div className="text-white">{stage.order}</div>
                    <div className="text-white font-medium">{stage.name}</div>
                    <div className="text-gray-400">
                      {stage.isClosedWon || stage.isClosedLost ? 'Final' : 'Active'}
                    </div>
                    <div className="text-gray-400">
                      {stage.isClosedWon ? '✓' : '—'}
                    </div>
                    <div className="text-gray-400">
                      {stage.isClosedLost ? '✓' : '—'}
                    </div>
                  </div>
                ))}
            </div>
          )}

          <div className="pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              <strong>Sales Workflow:</strong> When you create a deal, you'll assign it to a pipeline stage.
              Move deals through stages using the Kanban board view. Deals in "Closed Won" or "Closed Lost"
              stages are considered final.
            </p>
          </div>
        </div>
      </Card>
    </Page>
  );
}

export default PipelineStageManage;

