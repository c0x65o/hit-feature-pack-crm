'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Trash2, Users, User } from 'lucide-react';
import { useUi, useAlertDialog } from '@hit/ui-kit';
import { useCrmContacts } from '../hooks/useCrmContacts';
import { useCrmCompanies } from '../hooks/useCrmCompanies';
import { ContactHeader } from '../components/ContactHeader';
import { ActivityLog } from '../components/ActivityLog';
import { formatPhoneNumber } from '../utils/phone';
import { formatFullAddress } from '../utils/address';
export function ContactDetail({ id, onNavigate }) {
    const contactId = id === 'new' ? undefined : id;
    const { Page, Spinner, Alert, Card, Button, Modal, AlertDialog } = useUi();
    const alertDialog = useAlertDialog();
    const { data: contact, loading, deleteContact, refetch } = useCrmContacts({ id: contactId });
    const { data: company } = useCrmCompanies({
        id: contact?.companyId,
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = (path) => {
        if (onNavigate) {
            onNavigate(path);
        }
        else if (typeof window !== 'undefined') {
            window.location.href = path;
        }
    };
    const handleDelete = async () => {
        if (!contactId)
            return;
        setIsDeleting(true);
        try {
            await deleteContact(contactId);
            navigate('/crm/contacts');
        }
        catch (error) {
            console.error('Failed to delete contact:', error);
            await alertDialog.showAlert(error?.message || 'Failed to delete contact', {
                variant: 'error',
                title: 'Delete Failed'
            });
        }
        finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };
    if (loading) {
        return _jsx(Spinner, {});
    }
    if (!contact) {
        return (_jsx(Alert, { variant: "error", title: "Contact not found", children: "The contact you're looking for doesn't exist." }));
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
    const breadcrumbs = [
        { label: 'CRM', href: '/crm', icon: _jsx(Users, { size: 14 }) },
        { label: 'Contacts', href: '/crm/contacts', icon: _jsx(User, { size: 14 }) },
        { label: contact.name },
    ];
    return (_jsxs(Page, { title: contact.name, breadcrumbs: breadcrumbs, onNavigate: navigate, actions: _jsxs(_Fragment, { children: [_jsx(Button, { variant: "primary", onClick: () => navigate(`/crm/contacts/${contactId}/edit`), children: "Edit Contact" }), _jsxs(Button, { variant: "danger", onClick: () => setShowDeleteConfirm(true), disabled: isDeleting, children: [_jsx(Trash2, { size: 16, className: "mr-2" }), "Delete"] })] }), children: [_jsx(ContactHeader, { contact: contact, companyName: company?.name }), _jsx(Card, { children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Contact Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [contact.title && (_jsxs("div", { children: [_jsx("strong", { className: "text-sm text-gray-400", children: "Title:" }), _jsx("div", { className: "mt-1", children: contact.title })] })), contact.email && (_jsxs("div", { children: [_jsx("strong", { className: "text-sm text-gray-400", children: "Email:" }), _jsx("div", { className: "mt-1", children: _jsx("a", { href: `mailto:${contact.email}`, className: "text-blue-400 hover:underline", children: contact.email }) })] })), contact.phone && (_jsxs("div", { children: [_jsx("strong", { className: "text-sm text-gray-400", children: "Phone:" }), _jsx("div", { className: "mt-1", children: _jsx("a", { href: `tel:${contact.phone}`, className: "text-blue-400 hover:underline", children: formatPhoneNumber(contact.phone, contact.country || 'US') }) })] })), contact.companyId && company && (_jsxs("div", { children: [_jsx("strong", { className: "text-sm text-gray-400", children: "Company:" }), _jsx("div", { className: "mt-1", children: _jsx("a", { href: `/crm/companies/${contact.companyId}`, onClick: (e) => {
                                                            e.preventDefault();
                                                            navigate(`/crm/companies/${contact.companyId}`);
                                                        }, className: "text-blue-400 hover:underline", children: company.name }) })] })), contact.country && (_jsxs("div", { children: [_jsx("strong", { className: "text-sm text-gray-400", children: "Country:" }), _jsx("div", { className: "mt-1", children: contact.country })] }))] })] }), formattedAddress && (_jsxs("div", { className: "border-t border-gray-800 pt-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Address" }), _jsx("div", { className: "whitespace-pre-line text-sm", children: formattedAddress })] }))] }) }), _jsx(ActivityLog, { contactId: contactId || '' }), showDeleteConfirm && (_jsx(Modal, { open: true, onClose: () => setShowDeleteConfirm(false), title: "Delete Contact", children: _jsxs("div", { style: { padding: '16px' }, children: [_jsxs("p", { style: { marginBottom: '16px' }, children: ["Are you sure you want to delete \"", contact.name, "\"? This action cannot be undone."] }), _jsxs("div", { style: { display: 'flex', gap: '8px', justifyContent: 'flex-end' }, children: [_jsx(Button, { variant: "secondary", onClick: () => setShowDeleteConfirm(false), children: "Cancel" }), _jsx(Button, { variant: "danger", onClick: handleDelete, disabled: isDeleting, children: isDeleting ? 'Deleting...' : 'Delete' })] })] }) })), _jsx(AlertDialog, { ...alertDialog.props })] }));
}
export default ContactDetail;
//# sourceMappingURL=ContactDetail.js.map