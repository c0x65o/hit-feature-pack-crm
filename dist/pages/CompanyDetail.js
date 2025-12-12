'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useCrmCompanies } from '../hooks/useCrmCompanies';
import { useCrmContacts } from '../hooks/useCrmContacts';
import { formatPhoneNumber } from '../utils/phone';
import { formatFullAddress } from '../utils/address';
export function CompanyDetail({ id, onNavigate }) {
    const companyId = id === 'new' ? undefined : id;
    const { Page, Card, Spinner, Alert, Button, DataTable, Modal } = useUi();
    const { data: company, loading, deleteCompany } = useCrmCompanies({ id: companyId });
    const { data: contactsData, loading: contactsLoading, refetch: refetchContacts, deleteContact } = useCrmContacts({
        companyId: companyId,
        pageSize: 1000,
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteContactConfirm, setDeleteContactConfirm] = useState(null);
    const [isDeletingContact, setIsDeletingContact] = useState(false);
    const navigate = (path) => {
        if (onNavigate) {
            onNavigate(path);
        }
        else if (typeof window !== 'undefined') {
            window.location.href = path;
        }
    };
    const handleDelete = async () => {
        if (!companyId)
            return;
        setIsDeleting(true);
        try {
            await deleteCompany(companyId);
            navigate('/crm/companies');
        }
        catch (error) {
            console.error('Failed to delete company:', error);
            alert(error?.message || 'Failed to delete company');
        }
        finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };
    const handleDeleteContact = async () => {
        if (!deleteContactConfirm)
            return;
        setIsDeletingContact(true);
        try {
            await deleteContact(deleteContactConfirm.id);
            await refetchContacts();
            setDeleteContactConfirm(null);
        }
        catch (error) {
            console.error('Failed to delete contact:', error);
            alert(error?.message || 'Failed to delete contact');
        }
        finally {
            setIsDeletingContact(false);
        }
    };
    if (loading) {
        return _jsx(Spinner, {});
    }
    if (!company) {
        return (_jsx(Alert, { variant: "error", title: "Company not found", children: "The company you're looking for doesn't exist." }));
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
    return (_jsxs(Page, { title: company.name, actions: _jsxs(_Fragment, { children: [_jsx(Button, { variant: "primary", onClick: () => navigate(`/crm/companies/${companyId}/edit`), children: "Edit Company" }), _jsxs(Button, { variant: "danger", onClick: () => setShowDeleteConfirm(true), disabled: isDeleting, children: [_jsx(Trash2, { size: 16, className: "mr-2" }), "Delete"] })] }), children: [_jsx(Card, { children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Company Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("strong", { className: "text-sm text-gray-400", children: "Website:" }), _jsx("div", { className: "mt-1", children: company.website ? (_jsx("a", { href: company.website.startsWith('http') ? company.website : `https://${company.website}`, target: "_blank", rel: "noopener noreferrer", className: "text-blue-400 hover:underline", children: company.website })) : ('N/A') })] }), _jsxs("div", { children: [_jsx("strong", { className: "text-sm text-gray-400", children: "Email:" }), _jsx("div", { className: "mt-1", children: company.companyEmail ? (_jsx("a", { href: `mailto:${company.companyEmail}`, className: "text-blue-400 hover:underline", children: company.companyEmail })) : ('N/A') })] }), _jsxs("div", { children: [_jsx("strong", { className: "text-sm text-gray-400", children: "Phone:" }), _jsx("div", { className: "mt-1", children: company.companyPhone ? (_jsx("a", { href: `tel:${company.companyPhone}`, className: "text-blue-400 hover:underline", children: formatPhoneNumber(company.companyPhone, company.country || 'US') })) : ('N/A') })] }), _jsxs("div", { children: [_jsx("strong", { className: "text-sm text-gray-400", children: "Country:" }), _jsx("div", { className: "mt-1", children: company.country || 'N/A' })] })] })] }), hasAddress && (_jsxs("div", { className: "border-t border-gray-800 pt-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Address" }), _jsx("div", { className: "whitespace-pre-line text-sm", children: formattedAddress })] })), company.numEmployees && (_jsx("div", { className: "border-t border-gray-800 pt-6", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [company.numEmployees && (_jsxs("div", { children: [_jsx("strong", { className: "text-sm text-gray-400", children: "Number of Employees:" }), _jsx("div", { className: "mt-1", children: company.numEmployees.toLocaleString() })] })), company.estimatedRevenue && (_jsxs("div", { children: [_jsx("strong", { className: "text-sm text-gray-400", children: "Estimated Revenue:" }), _jsxs("div", { className: "mt-1", children: ["$", parseFloat(company.estimatedRevenue).toLocaleString(undefined, {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })] })] }))] }) }))] }) }), _jsx(Card, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Contacts" }), _jsx(Button, { variant: "primary", onClick: () => navigate(`/crm/contacts/new?companyId=${companyId}`), children: "Add Contact" })] }), contactsLoading ? (_jsx(Spinner, {})) : contactsData?.items && contactsData.items.length > 0 ? (_jsx(DataTable, { columns: [
                                { key: 'name', label: 'Name', sortable: true },
                                { key: 'title', label: 'Title' },
                                { key: 'email', label: 'Email' },
                                { key: 'phone', label: 'Phone' },
                                {
                                    key: 'actions',
                                    label: '',
                                    sortable: false,
                                    hideable: false,
                                    align: 'right',
                                    render: (_value, row) => (_jsx("div", { style: { display: 'flex', gap: '8px', justifyContent: 'flex-end' }, children: _jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                e.stopPropagation();
                                                setDeleteContactConfirm({ id: String(row.id), name: String(row.name) });
                                            }, disabled: isDeletingContact, children: _jsx(Trash2, { size: 16, style: { color: 'var(--hit-error, #ef4444)' } }) }) })),
                                },
                            ], data: contactsData.items.map((contact) => ({
                                ...contact,
                                phone: contact.phone
                                    ? formatPhoneNumber(contact.phone, contact.country || 'US')
                                    : 'N/A',
                            })), loading: contactsLoading, onRefresh: refetchContacts, onRowClick: (row) => {
                                navigate(`/crm/contacts/${String(row.id)}`);
                            } })) : (_jsxs("div", { className: "text-center py-8 text-gray-400", children: [_jsx("p", { children: "No contacts associated with this company." }), _jsx("div", { className: "mt-4", children: _jsx(Button, { variant: "primary", onClick: () => navigate(`/crm/contacts/new?companyId=${companyId}`), children: "Add First Contact" }) })] }))] }) }), showDeleteConfirm && (_jsx(Modal, { open: true, onClose: () => setShowDeleteConfirm(false), title: "Delete Company", children: _jsxs("div", { style: { padding: '16px' }, children: [_jsxs("p", { style: { marginBottom: '16px' }, children: ["Are you sure you want to delete \"", company.name, "\"? This action cannot be undone.", contactsData?.items && contactsData.items.length > 0 && (_jsxs("span", { style: { display: 'block', marginTop: '8px', color: 'var(--hit-error, #ef4444)' }, children: ["Warning: This company has ", contactsData.items.length, " associated contact", contactsData.items.length !== 1 ? 's' : '', "."] }))] }), _jsxs("div", { style: { display: 'flex', gap: '8px', justifyContent: 'flex-end' }, children: [_jsx(Button, { variant: "secondary", onClick: () => setShowDeleteConfirm(false), children: "Cancel" }), _jsx(Button, { variant: "danger", onClick: handleDelete, disabled: isDeleting, children: isDeleting ? 'Deleting...' : 'Delete' })] })] }) })), deleteContactConfirm && (_jsx(Modal, { open: true, onClose: () => setDeleteContactConfirm(null), title: "Delete Contact", children: _jsxs("div", { style: { padding: '16px' }, children: [_jsxs("p", { style: { marginBottom: '16px' }, children: ["Are you sure you want to delete \"", deleteContactConfirm.name, "\"? This action cannot be undone."] }), _jsxs("div", { style: { display: 'flex', gap: '8px', justifyContent: 'flex-end' }, children: [_jsx(Button, { variant: "secondary", onClick: () => setDeleteContactConfirm(null), children: "Cancel" }), _jsx(Button, { variant: "danger", onClick: handleDeleteContact, disabled: isDeletingContact, children: isDeletingContact ? 'Deleting...' : 'Delete' })] })] }) }))] }));
}
export default CompanyDetail;
//# sourceMappingURL=CompanyDetail.js.map