'use client';

import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useCrmDeals } from '../hooks/useCrmDeals';
import { KanbanView } from '../components/KanbanView';

interface DealListProps {
  onNavigate?: (path: string) => void;
}

export function DealList({ onNavigate }: DealListProps) {
  const { Page, Button, Tabs } = useUi();
  const [view, setView] = useState<'list' | 'kanban'>('kanban');

  const navigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  return (
    <Page
      title="Deals"
      description="Manage your sales pipeline"
      actions={
        <Button variant="primary" onClick={() => navigate('/crm/deals/new')}>
          <Plus size={16} className="mr-2" />
          New Deal
        </Button>
      }
    >
      <Tabs
        activeTab={view}
        onChange={(tabId) => setView(tabId as 'list' | 'kanban')}
        tabs={[
          { id: 'kanban', label: 'Kanban', content: <KanbanView /> },
          { id: 'list', label: 'List', content: <DealListView onNavigate={onNavigate} /> },
        ]}
      />
    </Page>
  );
}

function DealListView({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const { Card, DataTable, Spinner, Modal, Button: UIButton } = useUi();
  const { data, loading, deleteDeal, refetch } = useCrmDeals({});
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    try {
      await deleteDeal(deleteConfirm.id);
      await refetch();
      setDeleteConfirm(null);
    } catch (error: any) {
      console.error('Failed to delete deal:', error);
      alert(error?.message || 'Failed to delete deal');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card>
        {loading ? (
          <Spinner />
        ) : (
          <DataTable
            columns={[
              { key: 'dealName', label: 'Deal Name', sortable: true },
              { key: 'amount', label: 'Amount', sortable: true },
              { key: 'closeDateEstimate', label: 'Close Date' },
              {
                key: 'actions',
                label: '',
                sortable: false,
                hideable: false,
                align: 'right',
                render: (_value, row) => (
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <UIButton
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm({ id: String(row.id), name: String(row.dealName) });
                      }}
                    >
                      <Trash2 size={16} style={{ color: 'var(--hit-error, #ef4444)' }} />
                    </UIButton>
                  </div>
                ),
              },
            ]}
            data={data?.items || []}
            onRefresh={refetch}
            onRowClick={(row) => navigate(`/crm/deals/${String(row.id)}`)}
          />
        )}
      </Card>

      {deleteConfirm && (
        <Modal
          open={true}
          onClose={() => setDeleteConfirm(null)}
          title="Delete Deal"
        >
          <div style={{ padding: '16px' }}>
            <p style={{ marginBottom: '16px' }}>
              Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <UIButton variant="secondary" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </UIButton>
              <UIButton variant="danger" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </UIButton>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default DealList;

