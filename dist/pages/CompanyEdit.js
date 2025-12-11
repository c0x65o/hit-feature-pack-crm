'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useUi } from '@hit/ui-kit';
import { useCrmCompanies } from '../hooks/useCrmCompanies';
export function CompanyEdit({ id, onNavigate }) {
    const companyId = id === 'new' ? undefined : id;
    const { Page, Card, Input, Button, Spinner } = useUi();
    const { data: company, loading, createCompany, updateCompany } = useCrmCompanies({ id: companyId });
    const [name, setName] = useState('');
    const [website, setWebsite] = useState('');
    const [companyEmail, setCompanyEmail] = useState('');
    const [companyPhone, setCompanyPhone] = useState('');
    const [address, setAddress] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    useEffect(() => {
        if (company) {
            setName(company.name || '');
            setWebsite(company.website || '');
            setCompanyEmail(company.companyEmail || '');
            setCompanyPhone(company.companyPhone || '');
            setAddress(company.address || '');
        }
    }, [company]);
    const navigate = (path) => {
        if (onNavigate) {
            onNavigate(path);
        }
        else if (typeof window !== 'undefined') {
            window.location.href = path;
        }
    };
    const validateForm = () => {
        const errors = {};
        if (!name.trim()) {
            errors.name = 'Name is required';
        }
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm())
            return;
        try {
            const data = { name, website, companyEmail, companyPhone, address };
            if (companyId) {
                await updateCompany(companyId, data);
                navigate(`/crm/companies/${companyId}`);
            }
            else {
                const newCompany = await createCompany(data);
                navigate(`/crm/companies/${newCompany.id}`);
            }
        }
        catch {
            // Error handled by hook
        }
    };
    if (loading && companyId) {
        return _jsx(Spinner, {});
    }
    return (_jsx(Page, { title: companyId ? 'Edit Company' : 'New Company', children: _jsx(Card, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsx(Input, { label: "Name", value: name, onChange: setName, required: true, error: fieldErrors.name }), _jsx(Input, { label: "Website", value: website, onChange: setWebsite, error: fieldErrors.website }), _jsx(Input, { label: "Email", type: "email", value: companyEmail, onChange: setCompanyEmail, error: fieldErrors.companyEmail }), _jsx(Input, { label: "Phone", value: companyPhone, onChange: setCompanyPhone, error: fieldErrors.companyPhone }), _jsx(Input, { label: "Address", value: address, onChange: setAddress, error: fieldErrors.address }), _jsx("div", { className: "flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-800", children: _jsxs(Button, { type: "submit", variant: "primary", children: [companyId ? 'Update' : 'Create', " Company"] }) })] }) }) }));
}
export default CompanyEdit;
//# sourceMappingURL=CompanyEdit.js.map