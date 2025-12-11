'use client';

import React, { useState, useEffect } from 'react';
import { useUi } from '@hit/ui-kit';
import { useCrmCompanies } from '../hooks/useCrmCompanies';

interface CompanyEditProps {
  id?: string;
  onNavigate?: (path: string) => void;
}

export function CompanyEdit({ id, onNavigate }: CompanyEditProps) {
  const companyId = id === 'new' ? undefined : id;
  const { Page, Card, Input, Button, Spinner } = useUi();
  const { data: company, loading, createCompany, updateCompany } = useCrmCompanies({ id: companyId });

  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [address, setAddress] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (company) {
      setName(company.name || '');
      setWebsite(company.website || '');
      setCompanyEmail(company.companyEmail || '');
      setCompanyPhone(company.companyPhone || '');
      setAddress(company.address || '');
    }
  }, [company]);

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
      const data = { name, website, companyEmail, companyPhone, address };
      if (companyId) {
        await updateCompany(companyId, data);
        navigate(`/crm/companies/${companyId}`);
      } else {
        const newCompany = await createCompany(data);
        navigate(`/crm/companies/${newCompany.id}`);
      }
    } catch {
      // Error handled by hook
    }
  };

  if (loading && companyId) {
    return <Spinner />;
  }

  return (
    <Page title={companyId ? 'Edit Company' : 'New Company'}>
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
            label="Website"
            value={website}
            onChange={setWebsite}
            error={fieldErrors.website}
          />
          <Input
            label="Email"
            type="email"
            value={companyEmail}
            onChange={setCompanyEmail}
            error={fieldErrors.companyEmail}
          />
          <Input
            label="Phone"
            value={companyPhone}
            onChange={setCompanyPhone}
            error={fieldErrors.companyPhone}
          />
          <Input
            label="Address"
            value={address}
            onChange={setAddress}
            error={fieldErrors.address}
          />
          <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-800">
            <Button type="submit" variant="primary">
              {companyId ? 'Update' : 'Create'} Company
            </Button>
          </div>
        </form>
      </Card>
    </Page>
  );
}

export default CompanyEdit;

