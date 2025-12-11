'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Activity } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useCrmActivities } from '../hooks/useCrmActivities';
export function ActivityFeed({ limit = 15 }) {
    const { Card, Badge, Spinner, EmptyState } = useUi();
    const { data: activities, loading } = useCrmActivities({
        limit,
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
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffMins < 1)
            return 'Just now';
        if (diffMins < 60)
            return `${diffMins}m ago`;
        if (diffHours < 24)
            return `${diffHours}h ago`;
        if (diffDays < 7)
            return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };
    return (_jsxs("div", { children: [_jsxs("h3", { className: "mb-4 flex items-center gap-2 text-lg font-semibold", children: [_jsx(Activity, { size: 20 }), "Recent Activity"] }), loading ? (_jsx(Spinner, {})) : !activities || activities.length === 0 ? (_jsx(EmptyState, { title: "No recent activity", description: "Activities will appear here as you work" })) : (_jsx("ul", { className: "space-y-3", children: activities.map((activity) => (_jsxs("li", { className: "flex items-start gap-3", children: [_jsx("div", { className: "text-2xl", children: getActivityTypeIcon(activity.activityType) }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-medium", children: activity.taskDescription || activity.rawNoteText.substring(0, 100) }), _jsxs("div", { className: "text-sm text-gray-500 mt-1", children: [activity.activityType && (_jsx("span", { className: "mr-2", children: _jsx(Badge, { variant: "default", children: activity.activityType }) })), formatDate(activity.createdOnTimestamp.toString())] })] })] }, activity.id))) }))] }));
}
//# sourceMappingURL=ActivityFeed.js.map