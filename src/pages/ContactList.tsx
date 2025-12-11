'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useCrmContacts } from '../hooks/useCrmContacts';

export function ContactList() {
  const { Page, Card, Button, DataTable, Spinner } = useUi();
  const { data, loading } = useCrmContacts({});

  return (
    <Page
      title="Contacts"
      description="Manage your contacts"
      actions={
        <Button variant="primary" onClick={() => window.location.href = '/crm/contacts/new'}>
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
            ]}
            data={data?.items || []}
            onRowClick={(row) => {
              window.location.href = `/crm/contacts/${row.id}`;
            }}
          />
        )}
      </Card>
    </Page>
  );
}

export default ContactList;

