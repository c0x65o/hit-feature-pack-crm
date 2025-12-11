'use client';

import React, { useState } from 'react';
import { Plus, Activity as ActivityIcon } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useCrmActivities } from '../hooks/useCrmActivities';

interface ActivityLogProps {
  contactId?: string;
  dealId?: string;
  onAddActivity?: () => void;
}

export function ActivityLog({ contactId, dealId, onAddActivity }: ActivityLogProps) {
  const { Card, Button, Badge, Spinner, EmptyState } = useUi();
  const { data: activities, loading } = useCrmActivities({
    contactId,
    dealId,
    limit: 50,
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
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <ActivityIcon size={20} />
          Activity Log
        </h3>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            if (onAddActivity) {
              onAddActivity();
            } else {
              const params = new URLSearchParams();
              if (contactId) params.set('contactId', contactId);
              if (dealId) params.set('dealId', dealId);
              window.location.href = `/crm/activities/new?${params.toString()}`;
            }
          }}
        >
          <Plus size={16} className="mr-2" />
          Add Activity
        </Button>
      </div>

      {loading ? (
        <Spinner />
      ) : !activities || activities.length === 0 ? (
        <EmptyState
          title="No activities yet"
          description="Add an activity to get started"
        />
      ) : (
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity.id} className="flex items-start gap-3 py-4">
              <div className="text-2xl">{getActivityTypeIcon(activity.activityType)}</div>
              <div className="flex-1">
                <div className="font-medium mb-1">
                  {activity.taskDescription || activity.rawNoteText.substring(0, 150)}
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  {activity.activityType && (
                    <Badge variant="default">
                      {activity.activityType}
                    </Badge>
                  )}
                  {formatDate(activity.createdOnTimestamp.toString())}
                  {activity.taskDueDate && (
                    <>
                      <span>•</span>
                      <span>Due: {new Date(activity.taskDueDate).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

