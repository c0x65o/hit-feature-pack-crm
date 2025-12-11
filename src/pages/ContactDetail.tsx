'use client';

import React from 'react';
import { useUi } from '@hit/ui-kit';
import { useCrmContacts } from '../hooks/useCrmContacts';
import { useCrmCompanies } from '../hooks/useCrmCompanies';
import { ContactHeader } from '../components/ContactHeader';
import { ActivityLog } from '../components/ActivityLog';
import { formatPhoneNumber } from '../utils/phone';
import { formatFullAddress } from '../utils/address';

interface ContactDetailProps {
  id: string;
  onNavigate?: (path: string) => void;
}

export function ContactDetail({ id, onNavigate }: ContactDetailProps) {
  const contactId = id === 'new' ? undefined : id;
  const { Page, Spinner, Alert, Card, Button } = useUi();
  const { data: contact, loading } = useCrmContacts({ id: contactId });
  const { data: company } = useCrmCompanies({
    id: contact?.companyId,
  });

  const navigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

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

  const hasAddress = contact.address1 || contact.city || contact.state || contact.postalCode;
  const formattedAddress = hasAddress
    ? formatFullAddress({
        address1: contact.address1,
        address2: contact.address2,
        city: contact.city,
        state: contact.state,
        postalCode: contact.postalCode,
        country: contact.country,
      })
    : null;

  return (
    <Page
      title={contact.name}
      actions={
        <Button variant="primary" onClick={() => navigate(`/crm/contacts/${contactId}/edit`)}>
          Edit Contact
        </Button>
      }
    >
      <ContactHeader contact={contact} companyName={company?.name} />

      <Card>
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contact.title && (
                <div>
                  <strong className="text-sm text-gray-400">Title:</strong>
                  <div className="mt-1">{contact.title}</div>
                </div>
              )}
              {contact.email && (
                <div>
                  <strong className="text-sm text-gray-400">Email:</strong>
                  <div className="mt-1">
                    <a href={`mailto:${contact.email}`} className="text-blue-400 hover:underline">
                      {contact.email}
                    </a>
                  </div>
                </div>
              )}
              {contact.phone && (
                <div>
                  <strong className="text-sm text-gray-400">Phone:</strong>
                  <div className="mt-1">
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-blue-400 hover:underline"
                    >
                      {formatPhoneNumber(contact.phone, contact.country || 'US')}
                    </a>
                  </div>
                </div>
              )}
              {contact.companyId && company && (
                <div>
                  <strong className="text-sm text-gray-400">Company:</strong>
                  <div className="mt-1">
                    <a
                      href={`/crm/companies/${contact.companyId}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/crm/companies/${contact.companyId}`);
                      }}
                      className="text-blue-400 hover:underline"
                    >
                      {company.name}
                    </a>
                  </div>
                </div>
              )}
              {contact.country && (
                <div>
                  <strong className="text-sm text-gray-400">Country:</strong>
                  <div className="mt-1">{contact.country}</div>
                </div>
              )}
            </div>
          </div>

          {formattedAddress && (
            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-lg font-semibold mb-4">Address</h3>
              <div className="whitespace-pre-line text-sm">{formattedAddress}</div>
            </div>
          )}
        </div>
      </Card>

      <ActivityLog contactId={contactId || ''} />
    </Page>
  );
}

export default ContactDetail;

