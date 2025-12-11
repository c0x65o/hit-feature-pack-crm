'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useUi } from '@hit/ui-kit';
import { useCrmActivities } from '../hooks/useCrmActivities';
import { ContactAutocomplete } from '../components/ContactAutocomplete';
import { DealAutocomplete } from '../components/DealAutocomplete';
const ACTIVITY_TYPES = [
    { value: 'Call', label: 'Call' },
    { value: 'Meeting', label: 'Meeting' },
    { value: 'Note', label: 'Note' },
    { value: 'Email', label: 'Email' },
    { value: 'Task', label: 'Task' },
];
export function ActivityEdit({ id, contactId, dealId, onNavigate }) {
    const activityId = id === 'new' ? undefined : id;
    const { Page, Card, Input, Button, Select, Spinner, TextArea } = useUi();
    const { data: activityData, loading, createActivity, updateActivity } = useCrmActivities({ id: activityId });
    // Hook returns array - get first item when fetching by ID
    const activity = activityData && activityData.length > 0 ? activityData[0] : null;
    const [rawNoteText, setRawNoteText] = useState('');
    const [activityType, setActivityType] = useState('');
    const [taskDueDate, setTaskDueDate] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [relatedContactId, setRelatedContactId] = useState(contactId || '');
    const [relatedDealId, setRelatedDealId] = useState(dealId || '');
    const [fieldErrors, setFieldErrors] = useState({});
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
    if (loading && activityId) {
        return _jsx(Spinner, {});
    }
    return (_jsx(Page, { title: activityId ? 'Edit Activity' : 'New Activity', children: _jsx(Card, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsx(Select, { label: "Activity Type", options: ACTIVITY_TYPES, value: activityType, onChange: setActivityType }), _jsx(TextArea, { label: "Note / Description", value: rawNoteText, onChange: setRawNoteText, placeholder: "Enter activity notes...", required: true, error: fieldErrors.rawNoteText, rows: 6 }), _jsx(Input, { label: "Task Due Date", type: "text", value: taskDueDate, onChange: setTaskDueDate, placeholder: "YYYY-MM-DD" }), _jsx(Input, { label: "Task Description", value: taskDescription, onChange: setTaskDescription, placeholder: "Brief task description" }), _jsx(ContactAutocomplete, { label: "Related Contact", value: relatedContactId, onChange: setRelatedContactId, placeholder: "Search for a contact (optional)" }), _jsx(DealAutocomplete, { label: "Related Deal", value: relatedDealId, onChange: setRelatedDealId, placeholder: "Search for a deal (optional)" }), _jsxs("div", { className: "flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-200 dark:border-gray-800", children: [_jsx(Button, { type: "button", variant: "secondary", onClick: () => navigate('/crm/activities'), children: "Cancel" }), _jsxs(Button, { type: "submit", variant: "primary", children: [activityId ? 'Update' : 'Create', " Activity"] })] })] }) }) }));
}
export default ActivityEdit;
//# sourceMappingURL=ActivityEdit.js.map