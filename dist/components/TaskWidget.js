'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Clock } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useCrmActivities } from '../hooks/useCrmActivities';
export function TaskWidget() {
    const { Card, Badge, Spinner, EmptyState } = useUi();
    const { data: activities, loading } = useCrmActivities({
        filter: 'tasks_due',
        limit: 10,
    });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tasks = activities?.filter((activity) => {
        if (!activity.taskDueDate)
            return false;
        const dueDate = new Date(activity.taskDueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate <= today;
    }) || [];
    return (_jsxs("div", { children: [_jsxs("h3", { className: "mb-4 flex items-center gap-2 text-lg font-semibold", children: [_jsx(Clock, { size: 20 }), "Tasks Due"] }), loading ? (_jsx(Spinner, {})) : tasks.length === 0 ? (_jsx(EmptyState, { title: "No tasks due", description: "You're all caught up!" })) : (_jsx("ul", { className: "space-y-2", children: tasks.map((task) => (_jsxs("li", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-medium", children: task.taskDescription || 'Task' }), _jsx("div", { className: "text-sm text-gray-500", children: task.relatedContactId ? 'Contact' : task.relatedDealId ? 'Deal' : 'Activity' })] }), _jsx(Badge, { variant: new Date(task.taskDueDate) < today ? 'error' : 'warning', children: new Date(task.taskDueDate).toLocaleDateString() })] }, task.id))) }))] }));
}
//# sourceMappingURL=TaskWidget.js.map