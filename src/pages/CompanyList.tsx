'use client';

import React, { useState } from 'react';
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import { useUi, useAlertDialog } from '@hit/ui-kit';
import { useCrmCompanies } from '../hooks/useCrmCompanies';

interface CompanyListProps {
  onNavigate?: (path: string) => void;
}

export function CompanyList({ onNavigate }: CompanyListProps) {
  const { Page, Card, Button, DataTable, Spinner, Modal, AlertDialog } = useUi();
  const alertDialog = useAlertDialog();
  const { data, loading, refetch, deleteCompany } = useCrmCompanies({});
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
      await deleteCompany(deleteConfirm.id);
      await refetch();
      setDeleteConfirm(null);
    } catch (error: any) {
      console.error('Failed to delete company:', error);
      await alertDialog.showAlert(error?.message || 'Failed to delete company', {
        variant: 'error',
        title: 'Delete Failed'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Page
      title="Companies"
      description="Manage companies"
      actions={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" onClick={() => refetch()} disabled={loading}>
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
          <Button variant="primary" onClick={() => navigate('/crm/companies/new')}>
            <Plus size={16} className="mr-2" />
            New Company
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
              { key: 'name', label: 'Name', sortable: true },
              { key: 'website', label: 'Website' },
              { key: 'companyEmail', label: 'Email' },
              { key: 'companyPhone', label: 'Phone' },
              {
                key: 'actions',
                label: '',
                sortable: false,
                hideable: false,
                align: 'right',
                render: (_value: unknown, row: Record<string, unknown>) => (
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        setDeleteConfirm({ id: String(row.id), name: String(row.name) });
                      }}
                    >
                      <Trash2 size={16} style={{ color: 'var(--hit-error, #ef4444)' }} />
                    </Button>
                  </div>
                ),
              },
            ]}
            data={data?.items || []}
            loading={loading}
            onRowClick={(row: Record<string, unknown>) => {
              navigate(`/crm/companies/${String(row.id)}`);
            }}
            onRefresh={refetch}
            refreshing={loading}
            tableId="crm.companies"
          />
        )}
      </Card>

      {deleteConfirm && (
        <Modal
          open={true}
          onClose={() => setDeleteConfirm(null)}
          title="Delete Company"
        >
          <div style={{ padding: '16px' }}>
            <p style={{ marginBottom: '16px' }}>
              Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
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

export default CompanyList;

