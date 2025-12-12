'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Plus } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useCrmContacts } from '../hooks/useCrmContacts';
export function ContactList() {
    const { Page, Card, Button, DataTable, Spinner } = useUi();
    const { data, loading, refetch } = useCrmContacts({});
    return (_jsx(Page, { title: "Contacts", description: "Manage your contacts", actions: _jsxs(Button, { variant: "primary", onClick: () => window.location.href = '/crm/contacts/new', children: [_jsx(Plus, { size: 16, className: "mr-2" }), "New Contact"] }), children: _jsx(Card, { children: loading ? (_jsx(Spinner, {})) : (_jsx(DataTable, { columns: [
                    { key: 'name', label: 'Name', sortable: true },
                    { key: 'email', label: 'Email', sortable: true },
                    { key: 'phone', label: 'Phone' },
                    { key: 'title', label: 'Title' },
                ], data: data?.items || [], loading: loading, onRefresh: refetch, onRowClick: (row) => {
                    window.location.href = `/crm/contacts/${row.id}`;
                } })) }) }));
}
export default ContactList;
//# sourceMappingURL=ContactList.js.map