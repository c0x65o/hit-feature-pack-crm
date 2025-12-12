'use client';

import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useCrmContacts } from '../hooks/useCrmContacts';

interface ContactListProps {
  onNavigate?: (path: string) => void;
}

export function ContactList({ onNavigate }: ContactListProps) {
  const { Page, Card, Button, DataTable, Spinner, Modal } = useUi();
  const { data, loading, refetch, deleteContact } = useCrmContacts({});
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
      await deleteContact(deleteConfirm.id);
      await refetch();
      setDeleteConfirm(null);
    } catch (error: any) {
      console.error('Failed to delete contact:', error);
      alert(error?.message || 'Failed to delete contact');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Page
      title="Contacts"
      description="Manage your contacts"
      actions={
        <Button variant="primary" onClick={() => navigate('/crm/contacts/new')}>
          <Plus size={16} className="mr-2" />
          New Contact
        </Button>
      }
    >
      <Card>
        {loading ? (
          <Spinner />
        ) : (
          <DataTable
            columns={[
              { key: 'name', label: 'Name', sortable: true },
              { key: 'email', label: 'Email', sortable: true },
              { key: 'phone', label: 'Phone' },
              { key: 'title', label: 'Title' },
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
            onRowClick={(row) => {
              navigate(`/crm/contacts/${String(row.id)}`);
            }}
          />
        )}
      </Card>

      {deleteConfirm && (
        <Modal
          open={true}
          onClose={() => setDeleteConfirm(null)}
          title="Delete Contact"
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
    </Page>
  );
}

export default ContactList;

