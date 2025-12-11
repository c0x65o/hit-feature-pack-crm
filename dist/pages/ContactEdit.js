'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useUi } from '@hit/ui-kit';
import { useCrmContacts } from '../hooks/useCrmContacts';
export function ContactEdit({ id, onNavigate }) {
    const contactId = id === 'new' ? undefined : id;
    const { Page, Card, Input, Button, Spinner } = useUi();
    const { data: contact, loading, createContact, updateContact } = useCrmContacts({ id: contactId });
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [title, setTitle] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    useEffect(() => {
        if (contact) {
            setName(contact.name || '');
            setEmail(contact.email || '');
            setPhone(contact.phone || '');
            setTitle(contact.title || '');
        }
    }, [contact]);
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
            const data = { name, email, phone, title };
            if (contactId) {
                await updateContact(contactId, data);
                navigate(`/crm/contacts/${contactId}`);
            }
            else {
                const newContact = await createContact(data);
                navigate(`/crm/contacts/${newContact.id}`);
            }
        }
        catch {
            // Error handled by hook
        }
    };
    if (loading && contactId) {
        return _jsx(Spinner, {});
    }
    return (_jsx(Page, { title: contactId ? 'Edit Contact' : 'New Contact', children: _jsx(Card, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsx(Input, { label: "Name", value: name, onChange: setName, required: true, error: fieldErrors.name }), _jsx(Input, { label: "Email", type: "email", value: email, onChange: setEmail, error: fieldErrors.email }), _jsx(Input, { label: "Phone", value: phone, onChange: setPhone, error: fieldErrors.phone }), _jsx(Input, { label: "Title", value: title, onChange: setTitle, error: fieldErrors.title }), _jsx("div", { className: "flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-800", children: _jsxs(Button, { type: "submit", variant: "primary", children: [contactId ? 'Update' : 'Create', " Contact"] }) })] }) }) }));
}
export default ContactEdit;
//# sourceMappingURL=ContactEdit.js.map