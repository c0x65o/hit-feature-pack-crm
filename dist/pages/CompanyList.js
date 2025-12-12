'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useCrmCompanies } from '../hooks/useCrmCompanies';
export function CompanyList({ onNavigate }) {
    const { Page, Card, Button, DataTable, Spinner, Modal } = useUi();
    const { data, loading, refetch, deleteCompany } = useCrmCompanies({});
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
            await deleteCompany(deleteConfirm.id);
            await refetch();
            setDeleteConfirm(null);
        }
        catch (error) {
            console.error('Failed to delete company:', error);
            alert(error?.message || 'Failed to delete company');
        }
        finally {
            setIsDeleting(false);
        }
    };
    return (_jsxs(Page, { title: "Companies", description: "Manage companies", actions: _jsxs("div", { style: { display: 'flex', gap: '8px' }, children: [_jsxs(Button, { variant: "secondary", onClick: () => refetch(), disabled: loading, children: [_jsx(RefreshCw, { size: 16, className: "mr-2" }), "Refresh"] }), _jsxs(Button, { variant: "primary", onClick: () => navigate('/crm/companies/new'), children: [_jsx(Plus, { size: 16, className: "mr-2" }), "New Company"] })] }), children: [_jsx(Card, { children: loading ? (_jsx(Spinner, {})) : (_jsx(DataTable, { columns: [
                        { key: 'name', label: 'Name', sortable: true },
                        { key: 'website', label: 'Website' },
                        { key: 'companyEmail', label: 'Email' },
                        { key: 'companyPhone', label: 'Phone' },
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
                        navigate(`/crm/companies/${String(row.id)}`);
                    } })) }), deleteConfirm && (_jsx(Modal, { open: true, onClose: () => setDeleteConfirm(null), title: "Delete Company", children: _jsxs("div", { style: { padding: '16px' }, children: [_jsxs("p", { style: { marginBottom: '16px' }, children: ["Are you sure you want to delete \"", deleteConfirm.name, "\"? This action cannot be undone."] }), _jsxs("div", { style: { display: 'flex', gap: '8px', justifyContent: 'flex-end' }, children: [_jsx(Button, { variant: "secondary", onClick: () => setDeleteConfirm(null), children: "Cancel" }), _jsx(Button, { variant: "danger", onClick: handleDelete, disabled: isDeleting, children: isDeleting ? 'Deleting...' : 'Delete' })] })] }) }))] }));
}
export default CompanyList;
//# sourceMappingURL=CompanyList.js.map