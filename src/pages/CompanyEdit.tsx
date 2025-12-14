'use client';

import React, { useState, useEffect } from 'react';
import { Users, Building2 } from 'lucide-react';
import { useUi, type BreadcrumbItem } from '@hit/ui-kit';
import { useCrmCompanies } from '../hooks/useCrmCompanies';
import { AddressAutocomplete } from '../components/AddressAutocomplete';
import { formatPhoneNumber, normalizePhoneNumber } from '../utils/phone';

interface CompanyEditProps {
  id?: string;
  onNavigate?: (path: string) => void;
}

export function CompanyEdit({ id, onNavigate }: CompanyEditProps) {
  const companyId = id === 'new' ? undefined : id;
  const { Page, Card, Input, Button, Spinner, Select, Alert } = useUi();
  const { data: company, loading, createCompany, updateCompany } = useCrmCompanies({ id: companyId });

  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [phoneDisplay, setPhoneDisplay] = useState('');
  
  // Detailed address fields
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('US');
  
  // Legacy fields (for backward compatibility)
  const [address, setAddress] = useState('');
  
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (company) {
      setName(company.name || '');
      setWebsite(company.website || '');
      setCompanyEmail(company.companyEmail || '');
      setCompanyPhone(company.companyPhone || '');
      setPhoneDisplay(formatPhoneNumber(company.companyPhone, company.country || 'US'));
      setAddress1(company.address1 || '');
      setAddress2(company.address2 || '');
      setCity(company.city || '');
      setState(company.state || '');
      setPostalCode(company.postalCode || '');
      setCountry(company.country || 'US');
      setAddress(company.address || '');
    }
  }, [company]);

  // Format phone number as user types
  const handlePhoneChange = (value: string) => {
    setPhoneDisplay(value);
    // Store normalized version
    const normalized = normalizePhoneNumber(value);
    setCompanyPhone(normalized);
  };

  // Handle address autocomplete selection
  const handleAddressChange = (address: {
    address1: string;
    address2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }) => {
    setAddress1(address.address1);
    setAddress2(address.address2);
    setCity(address.city);
    setState(address.state);
    setPostalCode(address.postalCode);
    setCountry(address.country);
  };

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
    setSubmitError(null);
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const data = {
        name,
        website: website || null,
        companyEmail: companyEmail || null,
        companyPhone: companyPhone || null,
        address1: address1 || null,
        address2: address2 || null,
        city: city || null,
        state: state || null,
        postalCode: postalCode || null,
        country: country || null,
        // Keep legacy address field for backward compatibility
        address: address || null,
      };
      if (companyId) {
        await updateCompany(companyId, data);
        navigate(`/crm/companies/${companyId}`);
      } else {
        const newCompany = await createCompany(data);
        if (newCompany && newCompany.id) {
          navigate(`/crm/companies/${newCompany.id}`);
        } else {
          throw new Error('Company created but no ID returned. Please refresh the page.');
        }
      }
    } catch (error: any) {
      console.error('Error saving company:', error);
      const errorMessage = error?.message || error?.error || 'Failed to save company. Please try again.';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Country options (common countries)
  const countryOptions = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'AU', label: 'Australia' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'IT', label: 'Italy' },
    { value: 'ES', label: 'Spain' },
    { value: 'NL', label: 'Netherlands' },
    { value: 'BE', label: 'Belgium' },
    { value: 'CH', label: 'Switzerland' },
    { value: 'AT', label: 'Austria' },
    { value: 'SE', label: 'Sweden' },
    { value: 'NO', label: 'Norway' },
    { value: 'DK', label: 'Denmark' },
    { value: 'FI', label: 'Finland' },
    { value: 'PL', label: 'Poland' },
    { value: 'IE', label: 'Ireland' },
    { value: 'PT', label: 'Portugal' },
    { value: 'GR', label: 'Greece' },
  ];

  if (loading && companyId) {
    return <Spinner />;
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'CRM', href: '/crm', icon: <Users size={14} /> },
    { label: 'Companies', href: '/crm/companies', icon: <Building2 size={14} /> },
    ...(companyId && company ? [{ label: company.name, href: `/crm/companies/${companyId}` }] : []),
    { label: companyId ? 'Edit' : 'New' },
  ];

  return (
    <Page 
      title={companyId ? 'Edit Company' : 'New Company'}
      breadcrumbs={breadcrumbs}
      onNavigate={navigate}
    >
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {submitError && (
            <Alert variant="error" title="Error">
              {submitError}
            </Alert>
          )}

          <Input
            label="Company Name"
            value={name}
            onChange={setName}
            required
            error={fieldErrors.name}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Website"
              value={website}
              onChange={setWebsite}
              placeholder="https://example.com"
              error={fieldErrors.website}
            />
            <Input
              label="Email"
              type="email"
              value={companyEmail}
              onChange={setCompanyEmail}
              error={fieldErrors.companyEmail}
            />
          </div>

          <div>
            <Input
              label="Phone"
              value={phoneDisplay}
              onChange={handlePhoneChange}
              placeholder="(555) 123-4567"
              error={fieldErrors.companyPhone}
            />
            {companyPhone && country && (
              <div style={{ fontSize: '12px', color: 'var(--text-muted, #888)', marginTop: '4px' }}>
                Formatted: {formatPhoneNumber(companyPhone, country)}
              </div>
            )}
          </div>

          <div className="border-t border-gray-800 pt-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Address</h3>
            
            <AddressAutocomplete
              address1={address1}
              address2={address2}
              city={city}
              state={state}
              postalCode={postalCode}
              country={country}
              onAddressChange={handleAddressChange}
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}
            />

            <Input
              label="Address Line 2"
              value={address2}
              onChange={setAddress2}
              placeholder="Suite, floor, etc. (optional)"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="City"
                value={city}
                onChange={setCity}
              />
              <Input
                label="State/Province"
                value={state}
                onChange={setState}
              />
              <Input
                label="Postal Code"
                value={postalCode}
                onChange={setPostalCode}
              />
            </div>

            <Select
              label="Country"
              value={country}
              onChange={setCountry}
              options={countryOptions}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-800">
            <Button type="submit" variant="primary" disabled={isSubmitting} loading={isSubmitting}>
              {companyId ? 'Update' : 'Create'} Company
            </Button>
          </div>
        </form>
      </Card>
    </Page>
  );
}

export default CompanyEdit;

