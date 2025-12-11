'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUi } from '@hit/ui-kit';
import { useCrmContacts } from '../hooks/useCrmContacts';
import { useCrmCompanies } from '../hooks/useCrmCompanies';
import { ContactHeader } from '../components/ContactHeader';
import { ActivityLog } from '../components/ActivityLog';
import { formatPhoneNumber } from '../utils/phone';
import { formatFullAddress } from '../utils/address';
export function ContactDetail({ id, onNavigate }) {
    const contactId = id === 'new' ? undefined : id;
    const { Page, Spinner, Alert, Card, Button } = useUi();
    const { data: contact, loading } = useCrmContacts({ id: contactId });
    const { data: company } = useCrmCompanies({
        id: contact?.companyId,
    });
    const navigate = (path) => {
        if (onNavigate) {
            onNavigate(path);
        }
        else if (typeof window !== 'undefined') {
            window.location.href = path;
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
    return (_jsxs(Page, { title: contact.name, actions: _jsx(Button, { variant: "primary", onClick: () => navigate(`/crm/contacts/${contactId}/edit`), children: "Edit Contact" }), children: [_jsx(ContactHeader, { contact: contact, companyName: company?.name }), _jsx(Card, { children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Contact Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [contact.title && (_jsxs("div", { children: [_jsx("strong", { className: "text-sm text-gray-400", children: "Title:" }), _jsx("div", { className: "mt-1", children: contact.title })] })), contact.email && (_jsxs("div", { children: [_jsx("strong", { className: "text-sm text-gray-400", children: "Email:" }), _jsx("div", { className: "mt-1", children: _jsx("a", { href: `mailto:${contact.email}`, className: "text-blue-400 hover:underline", children: contact.email }) })] })), contact.phone && (_jsxs("div", { children: [_jsx("strong", { className: "text-sm text-gray-400", children: "Phone:" }), _jsx("div", { className: "mt-1", children: _jsx("a", { href: `tel:${contact.phone}`, className: "text-blue-400 hover:underline", children: formatPhoneNumber(contact.phone, contact.country || 'US') }) })] })), contact.companyId && company && (_jsxs("div", { children: [_jsx("strong", { className: "text-sm text-gray-400", children: "Company:" }), _jsx("div", { className: "mt-1", children: _jsx("a", { href: `/crm/companies/${contact.companyId}`, onClick: (e) => {
                                                            e.preventDefault();
                                                            navigate(`/crm/companies/${contact.companyId}`);
                                                        }, className: "text-blue-400 hover:underline", children: company.name }) })] })), contact.country && (_jsxs("div", { children: [_jsx("strong", { className: "text-sm text-gray-400", children: "Country:" }), _jsx("div", { className: "mt-1", children: contact.country })] }))] })] }), formattedAddress && (_jsxs("div", { className: "border-t border-gray-800 pt-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Address" }), _jsx("div", { className: "whitespace-pre-line text-sm", children: formattedAddress })] }))] }) }), _jsx(ActivityLog, { contactId: contactId || '' })] }));
}
export default ContactDetail;
//# sourceMappingURL=ContactDetail.js.map