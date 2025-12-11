'use client';

import React from 'react';
import { useUi } from '@hit/ui-kit';
import { useCrmContacts } from '../hooks/useCrmContacts';
import { ContactHeader } from '../components/ContactHeader';
import { ActivityLog } from '../components/ActivityLog';

interface ContactDetailProps {
  id: string;
  onNavigate?: (path: string) => void;
}

export function ContactDetail({ id, onNavigate }: ContactDetailProps) {
  const contactId = id === 'new' ? undefined : id;
  const { Page, Spinner, Alert } = useUi();
  const { data: contact, loading } = useCrmContacts({ id: contactId });

  if (loading) {
    return <Spinner />;
  }

  if (!contact) {
    return (
      <Alert variant="error" title="Contact not found">
        The contact you're looking for doesn't exist.
      </Alert>
    );
  }

  return (
    <Page title={contact.name}>
      <ContactHeader contact={contact} />
      <ActivityLog contactId={contactId || ''} />
    </Page>
  );
}

export default ContactDetail;

