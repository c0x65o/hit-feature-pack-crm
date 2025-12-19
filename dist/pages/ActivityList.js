'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import { useUi, useAlertDialog } from '@hit/ui-kit';
import { useCrmActivities } from '../hooks/useCrmActivities';
export function ActivityList({ onNavigate }) {
    const { Page, Card, Button, DataTable, Spinner, Modal, AlertDialog } = useUi();
    const alertDialog = useAlertDialog();
    const { data, loading, deleteActivity, refetch } = useCrmActivities({});
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
            await deleteActivity(deleteConfirm.id);
            await refetch();
            setDeleteConfirm(null);
        }
        catch (error) {
            console.error('Failed to delete activity:', error);
            await alertDialog.showAlert(error?.message || 'Failed to delete activity', {
                variant: 'error',
                title: 'Delete Failed'
            });
        }
        finally {
            setIsDeleting(false);
        }
    };
    return (_jsxs(Page, { title: "Activities", description: "View and manage activities", actions: _jsxs("div", { style: { display: 'flex', gap: '8px' }, children: [_jsxs(Button, { variant: "secondary", onClick: () => refetch(), disabled: loading, children: [_jsx(RefreshCw, { size: 16, className: "mr-2" }), "Refresh"] }), _jsxs(Button, { variant: "primary", onClick: () => navigate('/crm/activities/new'), children: [_jsx(Plus, { size: 16, className: "mr-2" }), "New Activity"] })] }), children: [_jsx(Card, { children: loading ? (_jsx(Spinner, {})) : (_jsx(DataTable, { columns: [
                        { key: 'activityType', label: 'Type' },
                        { key: 'taskDescription', label: 'Description' },
                        { key: 'taskDueDate', label: 'Due Date' },
                        { key: 'createdOnTimestamp', label: 'Created', sortable: true },
                        {
                            key: 'actions',
                            label: '',
                            sortable: false,
                            hideable: false,
                            align: 'right',
                            render: (_value, row) => (_jsx("div", { style: { display: 'flex', gap: '8px', justifyContent: 'flex-end' }, children: _jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                        e.stopPropagation();
                                        setDeleteConfirm({
                                            id: String(row.id),
                                            description: String((row.taskDescription || row.rawNoteText || 'this activity'))
                                        });
                                    }, children: _jsx(Trash2, { size: 16, style: { color: 'var(--hit-error, #ef4444)' } }) }) })),
                        },
                    ], data: data || [], loading: loading, onRowClick: (row) => navigate(`/crm/activities/${String(row.id)}`), onRefresh: refetch, refreshing: loading, tableId: "crm.activities" })) }), deleteConfirm && (_jsx(Modal, { open: true, onClose: () => setDeleteConfirm(null), title: "Delete Activity", children: _jsxs("div", { style: { padding: '16px' }, children: [_jsx("p", { style: { marginBottom: '16px' }, children: "Are you sure you want to delete this activity? This action cannot be undone." }), _jsxs("div", { style: { display: 'flex', gap: '8px', justifyContent: 'flex-end' }, children: [_jsx(Button, { variant: "secondary", onClick: () => setDeleteConfirm(null), children: "Cancel" }), _jsx(Button, { variant: "danger", onClick: handleDelete, disabled: isDeleting, children: isDeleting ? 'Deleting...' : 'Delete' })] })] }) })), _jsx(AlertDialog, { ...alertDialog.props })] }));
}
export default ActivityList;
//# sourceMappingURL=ActivityList.js.map