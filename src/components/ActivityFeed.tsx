'use client';

import React from 'react';
import { Activity } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useCrmActivities } from '../hooks/useCrmActivities';

interface ActivityFeedProps {
  limit?: number;
}

export function ActivityFeed({ limit = 15 }: ActivityFeedProps) {
  const { Card, Badge, Spinner, EmptyState } = useUi();
  const { data: activities, loading } = useCrmActivities({
    limit,
    sortBy: 'createdOnTimestamp',
    sortOrder: 'desc',
  });

  const getActivityTypeIcon = (type: string | null) => {
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div>
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <Activity size={20} />
        Recent Activity
      </h3>

      {loading ? (
        <Spinner />
      ) : !activities || activities.length === 0 ? (
        <EmptyState
          title="No recent activity"
          description="Activities will appear here as you work"
        />
      ) : (
        <ul className="space-y-3">
          {activities.map((activity) => (
            <li key={activity.id} className="flex items-start gap-3">
              <div className="text-2xl">{getActivityTypeIcon(activity.activityType)}</div>
              <div className="flex-1">
                <div className="font-medium">
                  {activity.taskDescription || activity.rawNoteText.substring(0, 100)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {activity.activityType && (
                    <span className="mr-2">
                      <Badge variant="default">
                        {activity.activityType}
                      </Badge>
                    </span>
                  )}
                  {formatDate(activity.createdOnTimestamp.toString())}
                </div>

              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


