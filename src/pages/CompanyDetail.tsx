'use client';

import React from 'react';
import { useUi } from '@hit/ui-kit';
import { useCrmCompanies } from '../hooks/useCrmCompanies';
import { useCrmContacts } from '../hooks/useCrmContacts';
import { formatPhoneNumber } from '../utils/phone';
import { formatFullAddress } from '../utils/address';

interface CompanyDetailProps {
  id: string;
  onNavigate?: (path: string) => void;
}

export function CompanyDetail({ id, onNavigate }: CompanyDetailProps) {
  const companyId = id === 'new' ? undefined : id;
  const { Page, Card, Spinner, Alert, Button, DataTable } = useUi();
  const { data: company, loading } = useCrmCompanies({ id: companyId });
  const { data: contactsData, loading: contactsLoading, refetch: refetchContacts } = useCrmContacts({
    companyId: companyId,
    pageSize: 1000,
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

  if (!company) {
    return (
      <Alert variant="error" title="Company not found">
        The company you're looking for doesn't exist.
      </Alert>
    );
  }

  const hasAddress = company.address1 || company.city || company.state || company.postalCode;
  const formattedAddress = hasAddress
    ? formatFullAddress({
        address1: company.address1,
        address2: company.address2,
        city: company.city,
        state: company.state,
        postalCode: company.postalCode,
        country: company.country,
      })
    : company.address || 'N/A';

  return (
    <Page
      title={company.name}
      actions={
        <Button variant="primary" onClick={() => navigate(`/crm/companies/${companyId}/edit`)}>
          Edit Company
        </Button>
      }
    >
      <Card>
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong className="text-sm text-gray-400">Website:</strong>
                <div className="mt-1">
                  {company.website ? (
                    <a
                      href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {company.website}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </div>
              </div>
              <div>
                <strong className="text-sm text-gray-400">Email:</strong>
                <div className="mt-1">
                  {company.companyEmail ? (
                    <a href={`mailto:${company.companyEmail}`} className="text-blue-400 hover:underline">
                      {company.companyEmail}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </div>
              </div>
              <div>
                <strong className="text-sm text-gray-400">Phone:</strong>
                <div className="mt-1">
                  {company.companyPhone ? (
                    <a
                      href={`tel:${company.companyPhone}`}
                      className="text-blue-400 hover:underline"
                    >
                      {formatPhoneNumber(company.companyPhone, company.country || 'US')}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </div>
              </div>
              <div>
                <strong className="text-sm text-gray-400">Country:</strong>
                <div className="mt-1">{company.country || 'N/A'}</div>
              </div>
            </div>
          </div>

          {hasAddress && (
            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-lg font-semibold mb-4">Address</h3>
              <div className="whitespace-pre-line text-sm">{formattedAddress}</div>
            </div>
          )}

          {company.numEmployees && (
            <div className="border-t border-gray-800 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.numEmployees && (
                  <div>
                    <strong className="text-sm text-gray-400">Number of Employees:</strong>
                    <div className="mt-1">{company.numEmployees.toLocaleString()}</div>
                  </div>
                )}
                {company.estimatedRevenue && (
                  <div>
                    <strong className="text-sm text-gray-400">Estimated Revenue:</strong>
                    <div className="mt-1">
                      ${parseFloat(company.estimatedRevenue).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Contacts</h2>
            <Button
              variant="primary"
              onClick={() => navigate(`/crm/contacts/new?companyId=${companyId}`)}
            >
              Add Contact
            </Button>
          </div>

          {contactsLoading ? (
            <Spinner />
          ) : contactsData?.items && contactsData.items.length > 0 ? (
            <DataTable
              columns={[
                { key: 'name', label: 'Name', sortable: true },
                { key: 'title', label: 'Title' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
              ]}
              data={contactsData.items.map((contact: any) => ({
                ...contact,
                phone: contact.phone
                  ? formatPhoneNumber(contact.phone, contact.country || 'US')
                  : 'N/A',
              }))}
              loading={contactsLoading}
              onRefresh={refetchContacts}
              onRowClick={(row) => {
                navigate(`/crm/contacts/${row.id}`);
              }}
            />
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No contacts associated with this company.</p>
            <div className="mt-4">
              <Button
                variant="primary"
                onClick={() => navigate(`/crm/contacts/new?companyId=${companyId}`)}
              >
                Add First Contact
              </Button>
            </div>
            </div>
          )}
        </div>
      </Card>
    </Page>
  );
}

export default CompanyDetail;

