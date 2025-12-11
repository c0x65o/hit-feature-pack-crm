'use client';

import React, { useState, useEffect } from 'react';
import { useUi } from '@hit/ui-kit';
import { useCrmContacts } from '../hooks/useCrmContacts';

interface ContactEditProps {
  id?: string;
  onNavigate?: (path: string) => void;
}

export function ContactEdit({ id, onNavigate }: ContactEditProps) {
  const contactId = id === 'new' ? undefined : id;
  const { Page, Card, Input, Button, Spinner } = useUi();
  const { data: contact, loading, createContact, updateContact } = useCrmContacts({ id: contactId });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (contact) {
      setName(contact.name || '');
      setEmail(contact.email || '');
      setPhone(contact.phone || '');
      setTitle(contact.title || '');
    }
  }, [contact]);

  const navigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) {
      errors.name = 'Name is required';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const data = { name, email, phone, title };
      if (contactId) {
        await updateContact(contactId, data);
        navigate(`/crm/contacts/${contactId}`);
      } else {
        const newContact = await createContact(data);
        navigate(`/crm/contacts/${newContact.id}`);
      }
    } catch {
      // Error handled by hook
    }
  };

  if (loading && contactId) {
    return <Spinner />;
  }

  return (
    <Page title={contactId ? 'Edit Contact' : 'New Contact'}>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Name"
            value={name}
            onChange={setName}
            required
            error={fieldErrors.name}
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            error={fieldErrors.email}
          />
          <Input
            label="Phone"
            value={phone}
            onChange={setPhone}
            error={fieldErrors.phone}
          />
          <Input
            label="Title"
            value={title}
            onChange={setTitle}
            error={fieldErrors.title}
          />
          <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-800">
            <Button type="submit" variant="primary">
              {contactId ? 'Update' : 'Create'} Contact
            </Button>
          </div>
        </form>
      </Card>
    </Page>
  );
}

export default ContactEdit;

