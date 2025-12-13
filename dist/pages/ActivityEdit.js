'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { useUi, useAlertDialog } from '@hit/ui-kit';
import { useCrmActivities } from '../hooks/useCrmActivities';
import { ContactAutocomplete } from '../components/ContactAutocomplete';
import { DealAutocomplete } from '../components/DealAutocomplete';
import { DateInput } from '../components/fields';
const ACTIVITY_TYPES = [
    { value: 'Call', label: 'Call' },
    { value: 'Meeting', label: 'Meeting' },
    { value: 'Note', label: 'Note' },
    { value: 'Email', label: 'Email' },
    { value: 'Task', label: 'Task' },
];
export function ActivityEdit({ id, contactId, dealId, onNavigate }) {
    const activityId = id === 'new' ? undefined : id;
    const { Page, Card, Input, Button, Select, Spinner, TextArea, Modal, AlertDialog } = useUi();
    const alertDialog = useAlertDialog();
    const { data: activityData, loading, createActivity, updateActivity, deleteActivity } = useCrmActivities({ id: activityId });
    // Hook returns array - get first item when fetching by ID
    const activity = activityData && activityData.length > 0 ? activityData[0] : null;
    const [rawNoteText, setRawNoteText] = useState('');
    const [activityType, setActivityType] = useState('');
    const [taskDueDate, setTaskDueDate] = useState(null);
    const [taskDescription, setTaskDescription] = useState('');
    const [relatedContactId, setRelatedContactId] = useState(contactId || '');
    const [relatedDealId, setRelatedDealId] = useState(dealId || '');
    const [fieldErrors, setFieldErrors] = useState({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    useEffect(() => {
        if (activity) {
            setRawNoteText(activity.rawNoteText || '');
            setActivityType(activity.activityType || '');
            setTaskDueDate(activity.taskDueDate ? new Date(activity.taskDueDate).toISOString().split('T')[0] : '');
            setTaskDescription(activity.taskDescription || '');
            setRelatedContactId(activity.relatedContactId || '');
            setRelatedDealId(activity.relatedDealId || '');
        }
    }, [activity]);
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
        if (!rawNoteText.trim()) {
            errors.rawNoteText = 'Note text is required';
        }
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm())
            return;
        try {
            const data = {
                rawNoteText,
                activityType: activityType || undefined,
                taskDueDate: taskDueDate || undefined,
                taskDescription: taskDescription || undefined,
                relatedContactId: relatedContactId || undefined,
                relatedDealId: relatedDealId || undefined,
            };
            if (activityId) {
                await updateActivity(activityId, data);
                navigate('/crm/activities');
            }
            else {
                await createActivity(data);
                navigate('/crm/activities');
            }
        }
        catch {
            // Error handled by hook
        }
    };
    const handleDelete = async () => {
        if (!activityId)
            return;
        setIsDeleting(true);
        try {
            await deleteActivity(activityId);
            navigate('/crm/activities');
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
            setShowDeleteConfirm(false);
        }
    };
    if (loading && activityId) {
        return _jsx(Spinner, {});
    }
    return (_jsxs(Page, { title: activityId ? 'Edit Activity' : 'New Activity', actions: activityId ? (_jsxs(Button, { variant: "danger", onClick: () => setShowDeleteConfirm(true), disabled: isDeleting, children: [_jsx(Trash2, { size: 16, className: "mr-2" }), "Delete"] })) : undefined, children: [_jsx(Card, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsx(Select, { label: "Activity Type", options: ACTIVITY_TYPES, value: activityType, onChange: setActivityType }), _jsx(TextArea, { label: "Note / Description", value: rawNoteText, onChange: setRawNoteText, placeholder: "Enter activity notes...", required: true, error: fieldErrors.rawNoteText, rows: 6 }), _jsx(DateInput, { label: "Task Due Date", value: taskDueDate, onChange: setTaskDueDate }), _jsx(Input, { label: "Task Description", value: taskDescription, onChange: setTaskDescription, placeholder: "Brief task description" }), _jsx(ContactAutocomplete, { label: "Related Contact", value: relatedContactId, onChange: setRelatedContactId, placeholder: "Search for a contact (optional)" }), _jsx(DealAutocomplete, { label: "Related Deal", value: relatedDealId, onChange: setRelatedDealId, placeholder: "Search for a deal (optional)" }), _jsxs("div", { className: "flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-200 dark:border-gray-800", children: [_jsx(Button, { type: "button", variant: "secondary", onClick: () => navigate('/crm/activities'), children: "Cancel" }), _jsxs(Button, { type: "submit", variant: "primary", children: [activityId ? 'Update' : 'Create', " Activity"] })] })] }) }), showDeleteConfirm && (_jsx(Modal, { open: true, onClose: () => setShowDeleteConfirm(false), title: "Delete Activity", children: _jsxs("div", { style: { padding: '16px' }, children: [_jsx("p", { style: { marginBottom: '16px' }, children: "Are you sure you want to delete this activity? This action cannot be undone." }), _jsxs("div", { style: { display: 'flex', gap: '8px', justifyContent: 'flex-end' }, children: [_jsx(Button, { variant: "secondary", onClick: () => setShowDeleteConfirm(false), children: "Cancel" }), _jsx(Button, { variant: "danger", onClick: handleDelete, disabled: isDeleting, children: isDeleting ? 'Deleting...' : 'Delete' })] })] }) })), _jsx(AlertDialog, { ...alertDialog.props })] }));
}
export default ActivityEdit;
//# sourceMappingURL=ActivityEdit.js.map