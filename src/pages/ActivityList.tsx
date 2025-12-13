'use client';

import React, { useState } from 'react';
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import { useUi, useAlertDialog } from '@hit/ui-kit';
import { useCrmActivities } from '../hooks/useCrmActivities';

interface ActivityListProps {
  onNavigate?: (path: string) => void;
}

export function ActivityList({ onNavigate }: ActivityListProps) {
  const { Page, Card, Button, DataTable, Spinner, Modal, AlertDialog } = useUi();
  const alertDialog = useAlertDialog();
  const { data, loading, deleteActivity, refetch } = useCrmActivities({});
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; description: string } | null>(null);
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
      await deleteActivity(deleteConfirm.id);
      await refetch();
      setDeleteConfirm(null);
    } catch (error: any) {
      console.error('Failed to delete activity:', error);
      await alertDialog.showAlert(error?.message || 'Failed to delete activity', {
        variant: 'error',
        title: 'Delete Failed'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Page
      title="Activities"
      description="View and manage activities"
      actions={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" onClick={() => refetch()} disabled={loading}>
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
          <Button variant="primary" onClick={() => navigate('/crm/activities/new')}>
            <Plus size={16} className="mr-2" />
            New Activity
          </Button>
        </div>
      }
    >
      <Card>
        {loading ? (
          <Spinner />
        ) : (
          <DataTable
            columns={[
              { key: 'activityType', label: 'Type' },
              { key: 'taskDescription', label: 'Description' },
              { key: 'taskDueDate', label: 'Due Date' },
              { key: 'createdOnTimestamp', label: 'Created', sortable: true },
              {
                key: 'actions',
                label: '',
                sortable: false,
                hideable: false,
                align: 'right',
                render: (_value, row) => (
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm({ 
                          id: String(row.id), 
                          description: String((row.taskDescription || row.rawNoteText || 'this activity') as unknown) 
                        });
                      }}
                    >
                      <Trash2 size={16} style={{ color: 'var(--hit-error, #ef4444)' }} />
                    </Button>
                  </div>
                ),
              },
            ]}
            data={data || []}
            onRowClick={(row) => navigate(`/crm/activities/${String(row.id)}`)}
          />
        )}
      </Card>

      {deleteConfirm && (
        <Modal
          open={true}
          onClose={() => setDeleteConfirm(null)}
          title="Delete Activity"
        >
          <div style={{ padding: '16px' }}>
            <p style={{ marginBottom: '16px' }}>
              Are you sure you want to delete this activity? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
      <AlertDialog {...alertDialog.props} />
    </Page>
  );
}

export default ActivityList;

