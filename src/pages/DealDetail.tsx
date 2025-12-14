'use client';

import React, { useState } from 'react';
import { Trash2, Users, Handshake } from 'lucide-react';
import { useUi, useAlertDialog, type BreadcrumbItem } from '@hit/ui-kit';
import { useCrmDeals } from '../hooks/useCrmDeals';
import { DealHeader } from '../components/DealHeader';
import { ActivityLog } from '../components/ActivityLog';

interface DealDetailProps {
  id: string;
  onNavigate?: (path: string) => void;
}

export function DealDetail({ id, onNavigate }: DealDetailProps) {
  const dealId = id === 'new' ? undefined : id;
  const { Page, Spinner, Alert, Button, Modal, AlertDialog } = useUi();
  const alertDialog = useAlertDialog();
  const { data: deal, loading, deleteDeal } = useCrmDeals({ id: dealId });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const navigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  const handleDelete = async () => {
    if (!dealId) return;
    setIsDeleting(true);
    try {
      await deleteDeal(dealId);
      navigate('/crm/deals');
    } catch (error: any) {
      console.error('Failed to delete deal:', error);
      await alertDialog.showAlert(error?.message || 'Failed to delete deal', {
        variant: 'error',
        title: 'Delete Failed'
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'CRM', href: '/crm', icon: <Users size={14} /> },
    { label: 'Deals', href: '/crm/deals', icon: <Handshake size={14} /> },
    { label: deal.dealName },
  ];

  return (
    <Page 
      title={deal.dealName}
      breadcrumbs={breadcrumbs}
      onNavigate={navigate}
      actions={
        <>
          <Button variant="primary" onClick={() => navigate(`/crm/deals/${dealId}/edit`)}>
            Edit Deal
          </Button>
          <Button 
            variant="danger" 
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </Button>
        </>
      }
    >
      <DealHeader deal={deal} />
      <ActivityLog dealId={dealId || ''} />

      {showDeleteConfirm && (
        <Modal
          open={true}
          onClose={() => setShowDeleteConfirm(false)}
          title="Delete Deal"
        >
          <div style={{ padding: '16px' }}>
            <p style={{ marginBottom: '16px' }}>
              Are you sure you want to delete "{deal.dealName}"? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
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

export default DealDetail;

