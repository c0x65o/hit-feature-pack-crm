'use client';

import React from 'react';
import { useUi } from '@hit/ui-kit';
import { useCrmCompanies } from '../hooks/useCrmCompanies';

interface CompanyDetailProps {
  id: string;
  onNavigate?: (path: string) => void;
}

export function CompanyDetail({ id, onNavigate }: CompanyDetailProps) {
  const companyId = id === 'new' ? undefined : id;
  const { Page, Card, Spinner, Alert } = useUi();
  const { data: company, loading } = useCrmCompanies({ id: companyId });

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

  return (
    <Page title={company.name}>
      <Card>
        <div className="space-y-4">
          <div>
            <strong>Website:</strong> {company.website || 'N/A'}
          </div>
          <div>
            <strong>Email:</strong> {company.companyEmail || 'N/A'}
          </div>
          <div>
            <strong>Phone:</strong> {company.companyPhone || 'N/A'}
          </div>
          {company.address && (
            <div>
              <strong>Address:</strong> {company.address}
            </div>
          )}
        </div>
      </Card>
    </Page>
  );
}

export default CompanyDetail;

