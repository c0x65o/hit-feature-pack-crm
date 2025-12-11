'use client';

import React, { useState, useEffect } from 'react';
import { useUi } from '@hit/ui-kit';
import { useCrmContacts } from '../hooks/useCrmContacts';
import { useCrmCompanies } from '../hooks/useCrmCompanies';
import { AddressAutocomplete } from '../components/AddressAutocomplete';
import { formatPhoneNumber, normalizePhoneNumber } from '../utils/phone';

interface ContactEditProps {
  id?: string;
  onNavigate?: (path: string) => void;
}

export function ContactEdit({ id, onNavigate }: ContactEditProps) {
  const contactId = id === 'new' ? undefined : id;
  const { Page, Card, Input, Button, Spinner, Select, Alert } = useUi();
  const { data: contact, loading, createContact, updateContact } = useCrmContacts({ id: contactId });
  const { data: companiesData } = useCrmCompanies({ pageSize: 1000 }); // Get all companies for dropdown

  // Get companyId from URL query parameter if creating new contact
  const getInitialCompanyId = () => {
    if (typeof window !== 'undefined' && contactId === undefined) {
      const params = new URLSearchParams(window.location.search);
      return params.get('companyId') || '';
    }
    return '';
  };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneDisplay, setPhoneDisplay] = useState('');
  const [title, setTitle] = useState('');
  const [companyId, setCompanyId] = useState<string>(getInitialCompanyId());
  
  // Address fields
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('US');
  
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (contact) {
      setName(contact.name || '');
      setEmail(contact.email || '');
      setPhone(contact.phone || '');
      setPhoneDisplay(formatPhoneNumber(contact.phone, contact.country || 'US'));
      setTitle(contact.title || '');
      setCompanyId(contact.companyId || '');
      setAddress1(contact.address1 || '');
      setAddress2(contact.address2 || '');
      setCity(contact.city || '');
      setState(contact.state || '');
      setPostalCode(contact.postalCode || '');
      setCountry(contact.country || 'US');
    } else if (!contactId) {
      // When creating new contact, check URL for companyId
      const initialCompanyId = getInitialCompanyId();
      if (initialCompanyId) {
        setCompanyId(initialCompanyId);
      }
    }
  }, [contact, contactId]);

  // Format phone number as user types
  const handlePhoneChange = (value: string) => {
    setPhoneDisplay(value);
    // Store normalized version
    const normalized = normalizePhoneNumber(value);
    setPhone(normalized);
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
        email,
        phone: phone || null,
        title: title || null,
        companyId: companyId || null,
        address1: address1 || null,
        address2: address2 || null,
        city: city || null,
        state: state || null,
        postalCode: postalCode || null,
        country: country || null,
      };
      
      let result;
      if (contactId) {
        result = await updateContact(contactId, data);
        navigate(`/crm/contacts/${contactId}`);
      } else {
        result = await createContact(data);
        if (result && result.id) {
          navigate(`/crm/contacts/${result.id}`);
        } else {
          throw new Error('Contact created but no ID returned');
        }
      }
    } catch (error: any) {
      console.error('Error saving contact:', error);
      const errorMessage = error?.message || error?.error || 'Failed to save contact. Please try again.';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prepare company options for dropdown
  const companyOptions = [
    { value: '', label: 'No Company' },
    ...(companiesData?.items || []).map((company: any) => ({
      value: company.id,
      label: company.name,
    })),
  ];

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

  if (loading && contactId) {
    return <Spinner />;
  }

  return (
    <Page title={contactId ? 'Edit Contact' : 'New Contact'}>
      {submitError && (
        <Alert variant="error" title="Error">
          {submitError}
        </Alert>
      )}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name"
              value={name}
              onChange={setName}
              required
              error={fieldErrors.name}
            />
            <Input
              label="Title"
              value={title}
              onChange={setTitle}
              error={fieldErrors.title}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              error={fieldErrors.email}
            />
            <div>
              <Input
                label="Phone"
                value={phoneDisplay}
                onChange={handlePhoneChange}
                placeholder="(555) 123-4567"
                error={fieldErrors.phone}
              />
              {phone && country && (
                <div style={{ fontSize: '12px', color: 'var(--text-muted, #888)', marginTop: '4px' }}>
                  Formatted: {formatPhoneNumber(phone, country)}
                </div>
              )}
            </div>
          </div>

          <Select
            label="Company"
            value={companyId}
            onChange={setCompanyId}
            options={companyOptions}
            placeholder="Select a company (optional)"
          />

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
              placeholder="Apartment, suite, etc. (optional)"
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
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : contactId ? 'Update' : 'Create'} Contact
            </Button>
          </div>
        </form>
      </Card>
    </Page>
  );
}

export default ContactEdit;

