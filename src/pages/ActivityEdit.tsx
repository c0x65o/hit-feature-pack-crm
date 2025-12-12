'use client';

import React, { useState, useEffect } from 'react';
import { useUi } from '@hit/ui-kit';
import { useCrmActivities } from '../hooks/useCrmActivities';
import { ContactAutocomplete } from '../components/ContactAutocomplete';
import { DealAutocomplete } from '../components/DealAutocomplete';
import { DateInput } from '../components/fields';

interface ActivityEditProps {
  id?: string;
  contactId?: string;
  dealId?: string;
  onNavigate?: (path: string) => void;
}

const ACTIVITY_TYPES = [
  { value: 'Call', label: 'Call' },
  { value: 'Meeting', label: 'Meeting' },
  { value: 'Note', label: 'Note' },
  { value: 'Email', label: 'Email' },
  { value: 'Task', label: 'Task' },
];

export function ActivityEdit({ id, contactId, dealId, onNavigate }: ActivityEditProps) {
  const activityId = id === 'new' ? undefined : id;
  const { Page, Card, Input, Button, Select, Spinner, TextArea } = useUi();
  const { data: activityData, loading, createActivity, updateActivity } = useCrmActivities({ id: activityId });
  // Hook returns array - get first item when fetching by ID
  const activity = activityData && activityData.length > 0 ? activityData[0] : null;

  const [rawNoteText, setRawNoteText] = useState('');
  const [activityType, setActivityType] = useState('');
  const [taskDueDate, setTaskDueDate] = useState<string | null>(null);
  const [taskDescription, setTaskDescription] = useState('');
  const [relatedContactId, setRelatedContactId] = useState(contactId || '');
  const [relatedDealId, setRelatedDealId] = useState(dealId || '');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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

  const navigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!rawNoteText.trim()) {
      errors.rawNoteText = 'Note text is required';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

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
      } else {
        await createActivity(data);
        navigate('/crm/activities');
      }
    } catch {
      // Error handled by hook
    }
  };

  if (loading && activityId) {
    return <Spinner />;
  }

  return (
    <Page title={activityId ? 'Edit Activity' : 'New Activity'}>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Select
            label="Activity Type"
            options={ACTIVITY_TYPES}
            value={activityType}
            onChange={setActivityType}
          />
          <TextArea
            label="Note / Description"
            value={rawNoteText}
            onChange={setRawNoteText}
            placeholder="Enter activity notes..."
            required
            error={fieldErrors.rawNoteText}
            rows={6}
          />
          <DateInput
            label="Task Due Date"
            value={taskDueDate}
            onChange={setTaskDueDate}
          />
          <Input
            label="Task Description"
            value={taskDescription}
            onChange={setTaskDescription}
            placeholder="Brief task description"
          />
          <ContactAutocomplete
            label="Related Contact"
            value={relatedContactId}
            onChange={setRelatedContactId}
            placeholder="Search for a contact (optional)"
          />
          <DealAutocomplete
            label="Related Deal"
            value={relatedDealId}
            onChange={setRelatedDealId}
            placeholder="Search for a deal (optional)"
          />
          <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
            <Button type="button" variant="secondary" onClick={() => navigate('/crm/activities')}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {activityId ? 'Update' : 'Create'} Activity
            </Button>
          </div>
        </form>
      </Card>
    </Page>
  );
}

export default ActivityEdit;

