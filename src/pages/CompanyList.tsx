'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useCrmCompanies } from '../hooks/useCrmCompanies';

export function CompanyList() {
  const { Page, Card, Button, DataTable, Spinner } = useUi();
  const { data, loading, refetch } = useCrmCompanies({});

  return (
    <Page
      title="Companies"
      description="Manage companies"
      actions={
        <Button variant="primary" onClick={() => window.location.href = '/crm/companies/new'}>
          <Plus size={16} className="mr-2" />
          New Company
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
              { key: 'website', label: 'Website' },
              { key: 'companyEmail', label: 'Email' },
              { key: 'companyPhone', label: 'Phone' },
            ]}
            data={data?.items || []}
            loading={loading}
            onRefresh={refetch}
            onRowClick={(row) => {
              window.location.href = `/crm/companies/${row.id}`;
            }}
          />
        )}
      </Card>
    </Page>
  );
}

export default CompanyList;

