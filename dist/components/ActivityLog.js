'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Plus, Activity as ActivityIcon } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useCrmActivities } from '../hooks/useCrmActivities';
export function ActivityLog({ contactId, dealId, onAddActivity }) {
    const { Card, Button, Badge, Spinner, EmptyState } = useUi();
    const { data: activities, loading } = useCrmActivities({
        contactId,
        dealId,
        limit: 50,
        sortBy: 'createdOnTimestamp',
        sortOrder: 'desc',
    });
    const getActivityTypeIcon = (type) => {
        switch (type) {
            case 'Call':
                return '📞';
            case 'Meeting':
                return '🤝';
            case 'Email':
                return '📧';
            case 'Note':
                return '📝';
            default:
                return '📋';
        }
    };
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };
    return (_jsxs(Card, { children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("h3", { className: "flex items-center gap-2 text-lg font-semibold", children: [_jsx(ActivityIcon, { size: 20 }), "Activity Log"] }), _jsxs(Button, { variant: "primary", size: "sm", onClick: () => {
                            if (onAddActivity) {
                                onAddActivity();
                            }
                            else {
                                const params = new URLSearchParams();
                                if (contactId)
                                    params.set('contactId', contactId);
                                if (dealId)
                                    params.set('dealId', dealId);
                                window.location.href = `/crm/activities/new?${params.toString()}`;
                            }
                        }, children: [_jsx(Plus, { size: 16, className: "mr-2" }), "Add Activity"] })] }), loading ? (_jsx(Spinner, {})) : !activities || activities.length === 0 ? (_jsx(EmptyState, { title: "No activities yet", description: "Add an activity to get started" })) : (_jsx("ul", { className: "space-y-4", children: activities.map((activity) => (_jsxs("li", { className: "flex items-start gap-3 py-4", children: [_jsx("div", { className: "text-2xl", children: getActivityTypeIcon(activity.activityType) }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-medium mb-1", children: activity.taskDescription || activity.rawNoteText.substring(0, 150) }), _jsxs("div", { className: "text-sm text-gray-500 flex items-center gap-2", children: [activity.activityType && (_jsx(Badge, { variant: "default", children: activity.activityType })), formatDate(activity.createdOnTimestamp.toString()), activity.taskDueDate && (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u2022" }), _jsxs("span", { children: ["Due: ", new Date(activity.taskDueDate).toLocaleDateString()] })] }))] })] })] }, activity.id))) }))] }));
}
//# sourceMappingURL=ActivityLog.js.map