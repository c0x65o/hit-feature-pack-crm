'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useCrmContacts } from '../hooks/useCrmContacts';
export function ContactList({ onNavigate }) {
    const { Page, Card, Button, DataTable, Spinner, Modal } = useUi();
    const { data, loading, refetch, deleteContact } = useCrmContacts({});
    const [deleteConfirm, setDeleteConfirm] = useState(null);
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
        if (!deleteConfirm)
            return;
        setIsDeleting(true);
        try {
            await deleteContact(deleteConfirm.id);
            await refetch();
            setDeleteConfirm(null);
        }
        catch (error) {
            console.error('Failed to delete contact:', error);
            alert(error?.message || 'Failed to delete contact');
        }
        finally {
            setIsDeleting(false);
        }
    };
    return (_jsxs(Page, { title: "Contacts", description: "Manage your contacts", actions: _jsxs(Button, { variant: "primary", onClick: () => navigate('/crm/contacts/new'), children: [_jsx(Plus, { size: 16, className: "mr-2" }), "New Contact"] }), children: [_jsx(Card, { children: loading ? (_jsx(Spinner, {})) : (_jsx(DataTable, { columns: [
                        { key: 'name', label: 'Name', sortable: true },
                        { key: 'email', label: 'Email', sortable: true },
                        { key: 'phone', label: 'Phone' },
                        { key: 'title', label: 'Title' },
                        {
                            key: 'actions',
                            label: '',
                            sortable: false,
                            hideable: false,
                            align: 'right',
                            render: (_value, row) => (_jsx("div", { style: { display: 'flex', gap: '8px', justifyContent: 'flex-end' }, children: _jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                        e.stopPropagation();
                                        setDeleteConfirm({ id: String(row.id), name: String(row.name) });
                                    }, children: _jsx(Trash2, { size: 16, style: { color: 'var(--hit-error, #ef4444)' } }) }) })),
                        },
                    ], data: data?.items || [], loading: loading, onRowClick: (row) => {
                        navigate(`/crm/contacts/${String(row.id)}`);
                    } })) }), deleteConfirm && (_jsx(Modal, { open: true, onClose: () => setDeleteConfirm(null), title: "Delete Contact", children: _jsxs("div", { style: { padding: '16px' }, children: [_jsxs("p", { style: { marginBottom: '16px' }, children: ["Are you sure you want to delete \"", deleteConfirm.name, "\"? This action cannot be undone."] }), _jsxs("div", { style: { display: 'flex', gap: '8px', justifyContent: 'flex-end' }, children: [_jsx(Button, { variant: "secondary", onClick: () => setDeleteConfirm(null), children: "Cancel" }), _jsx(Button, { variant: "danger", onClick: handleDelete, disabled: isDeleting, children: isDeleting ? 'Deleting...' : 'Delete' })] })] }) }))] }));
}
export default ContactList;
//# sourceMappingURL=ContactList.js.map