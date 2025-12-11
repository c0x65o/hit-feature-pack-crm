'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUi } from '@hit/ui-kit';
import { useCrmContacts } from '../hooks/useCrmContacts';
import { ContactHeader } from '../components/ContactHeader';
import { ActivityLog } from '../components/ActivityLog';
export function ContactDetail({ id, onNavigate }) {
    const contactId = id === 'new' ? undefined : id;
    const { Page, Spinner, Alert } = useUi();
    const { data: contact, loading } = useCrmContacts({ id: contactId });
    if (loading) {
        return _jsx(Spinner, {});
    }
    if (!contact) {
        return (_jsx(Alert, { variant: "error", title: "Contact not found", children: "The contact you're looking for doesn't exist." }));
    }
    return (_jsxs(Page, { title: contact.name, children: [_jsx(ContactHeader, { contact: contact }), _jsx(ActivityLog, { contactId: contactId || '' })] }));
}
export default ContactDetail;
//# sourceMappingURL=ContactDetail.js.map