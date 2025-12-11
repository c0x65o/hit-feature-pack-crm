'use client';

import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
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

  const tasks = activities?.filter((activity: { taskDueDate?: string | Date }) => {
    if (!activity.taskDueDate) return false;
    const dueDate = new Date(activity.taskDueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate <= today;
  }) || [];

  return (
    <div>
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <Clock size={20} />
        Tasks Due
      </h3>

      {loading ? (
        <Spinner />
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No tasks due"
          description="You're all caught up!"
        />
      ) : (
        <ul className="space-y-2">
          {tasks.map((task: { id: string; taskDescription?: string; taskDueDate: string | Date; relatedContactId?: string | null; relatedDealId?: string | null }) => (
            <li
              key={task.id}
              className="flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="font-medium">{task.taskDescription || 'Task'}</div>
                <div className="text-sm text-gray-500">
                  {task.relatedContactId ? 'Contact' : task.relatedDealId ? 'Deal' : 'Activity'}
                </div>
              </div>
              <Badge
                variant={new Date(task.taskDueDate) < today ? 'error' : 'warning'}
              >
                {new Date(task.taskDueDate).toLocaleDateString()}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

