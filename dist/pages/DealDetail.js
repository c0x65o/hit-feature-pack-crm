'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useCrmDeals } from '../hooks/useCrmDeals';
import { DealHeader } from '../components/DealHeader';
import { ActivityLog } from '../components/ActivityLog';
export function DealDetail({ id, onNavigate }) {
    const dealId = id === 'new' ? undefined : id;
    const { Page, Spinner, Alert, Button, Modal } = useUi();
    const { data: deal, loading, deleteDeal } = useCrmDeals({ id: dealId });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    if (loading) {
        return _jsx(Spinner, {});
    }
    if (!deal) {
        return (_jsx(Alert, { variant: "error", title: "Deal not found", children: "The deal you're looking for doesn't exist." }));
    }
    const navigate = (path) => {
        if (onNavigate) {
            onNavigate(path);
        }
        else if (typeof window !== 'undefined') {
            window.location.href = path;
        }
    };
    const handleDelete = async () => {
        if (!dealId)
            return;
        setIsDeleting(true);
        try {
            await deleteDeal(dealId);
            navigate('/crm/deals');
        }
        catch (error) {
            console.error('Failed to delete deal:', error);
            alert(error?.message || 'Failed to delete deal');
        }
        finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };
    return (_jsxs(Page, { title: deal.dealName, actions: _jsxs(_Fragment, { children: [_jsx(Button, { variant: "primary", onClick: () => navigate(`/crm/deals/${dealId}/edit`), children: "Edit Deal" }), _jsxs(Button, { variant: "danger", onClick: () => setShowDeleteConfirm(true), disabled: isDeleting, children: [_jsx(Trash2, { size: 16, className: "mr-2" }), "Delete"] })] }), children: [_jsx(DealHeader, { deal: deal }), _jsx(ActivityLog, { dealId: dealId || '' }), showDeleteConfirm && (_jsx(Modal, { open: true, onClose: () => setShowDeleteConfirm(false), title: "Delete Deal", children: _jsxs("div", { style: { padding: '16px' }, children: [_jsxs("p", { style: { marginBottom: '16px' }, children: ["Are you sure you want to delete \"", deal.dealName, "\"? This action cannot be undone."] }), _jsxs("div", { style: { display: 'flex', gap: '8px', justifyContent: 'flex-end' }, children: [_jsx(Button, { variant: "secondary", onClick: () => setShowDeleteConfirm(false), children: "Cancel" }), _jsx(Button, { variant: "danger", onClick: handleDelete, disabled: isDeleting, children: isDeleting ? 'Deleting...' : 'Delete' })] })] }) }))] }));
}
export default DealDetail;
//# sourceMappingURL=DealDetail.js.map