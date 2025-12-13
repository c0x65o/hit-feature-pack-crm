'use client';

import React, { useState, useEffect } from 'react';
import { useUi } from '@hit/ui-kit';
import { ArrowUp, ArrowDown, Edit, Trash2, Plus, X } from 'lucide-react';

interface PipelineStage {
  id: string;
  code: string;
  name: string;
  order: number;
  isClosedWon: boolean;
  isClosedLost: boolean;
  isSystem?: boolean;
  customerConfig?: {
    color?: string;
    probability?: number;
    forecastCategory?: string;
    wipLimit?: number;
  } | null;
}

interface StageFormData {
  code: string;
  name: string;
  order: number;
  isClosedWon: boolean;
  isClosedLost: boolean;
  color: string;
  probability: number | null;
  forecastCategory: string;
  wipLimit: number | null;
}

function normalizeStageCode(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export function PipelineStageManage({ onNavigate: _onNavigate }: { onNavigate?: (path: string) => void }) {
  const { Page, Card, Button: UIButton, Spinner, Alert, Modal, Input, Select, Checkbox } = useUi();
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStage, setEditingStage] = useState<PipelineStage | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState<StageFormData>({
    code: '',
    name: '',
    order: 1,
    isClosedWon: false,
    isClosedLost: false,
    color: '#3b82f6',
    probability: null,
    forecastCategory: '',
    wipLimit: null,
  });

  const fetchStages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/crm/pipeline-stages');
      if (!res.ok) throw new Error('Failed to fetch stages');
      const data = await res.json();
      setStages(data.items || []);
    } catch (error) {
      console.error('Failed to fetch pipeline stages', error);
      setError('Failed to load pipeline stages');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    const maxOrder = stages.length > 0 ? Math.max(...stages.map(s => s.order)) : 0;
    setFormData({
      code: '',
      name: '',
      order: maxOrder + 1,
      isClosedWon: false,
      isClosedLost: false,
      color: '#3b82f6',
      probability: null,
      forecastCategory: '',
      wipLimit: null,
    });
    setIsCreating(true);
    setEditingStage(null);
    setError(null);
  };

  const handleEdit = (stage: PipelineStage) => {
    setFormData({
      code: stage.code || '',
      name: stage.name,
      order: stage.order,
      isClosedWon: stage.isClosedWon,
      isClosedLost: stage.isClosedLost,
      color: stage.customerConfig?.color || '#3b82f6',
      probability: stage.customerConfig?.probability || null,
      forecastCategory: stage.customerConfig?.forecastCategory || '',
      wipLimit: stage.customerConfig?.wipLimit || null,
    });
    setEditingStage(stage);
    setIsCreating(false);
    setError(null);
  };

  const handleCancel = () => {
    setEditingStage(null);
    setIsCreating(false);
    setFormData({
      code: '',
      name: '',
      order: 1,
      isClosedWon: false,
      isClosedLost: false,
      color: '#3b82f6',
      probability: null,
      forecastCategory: '',
      wipLimit: null,
    });
    setError(null);
  };

  const handleSave = async () => {
    try {
      setError(null);
      
      if (!formData.name.trim()) {
        setError('Stage name is required');
        return;
      }

      // Code is required for create. If user leaves it blank, derive from name.
      const derivedCode = normalizeStageCode(formData.code || formData.name);
      if (!editingStage && !derivedCode) {
        setError('Stage code is required');
        return;
      }

      const customerConfig: any = {};
      if (formData.color && formData.color !== '#3b82f6') {
        customerConfig.color = formData.color;
      }
      if (formData.probability !== null) {
        customerConfig.probability = formData.probability;
      }
      if (formData.forecastCategory) {
        customerConfig.forecastCategory = formData.forecastCategory;
      }
      if (formData.wipLimit !== null) {
        customerConfig.wipLimit = formData.wipLimit;
      }

      const payload: any = {
        name: formData.name.trim(),
        order: formData.order,
        isClosedWon: formData.isClosedWon,
        isClosedLost: formData.isClosedLost,
        customerConfig: Object.keys(customerConfig).length > 0 ? customerConfig : null,
      };
      if (!editingStage) {
        payload.code = derivedCode;
      }

      let res;
      if (editingStage) {
        res = await fetch(`/api/crm/pipeline-stages/${editingStage.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/crm/pipeline-stages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save stage');
      }

      await fetchStages();
      handleCancel();
    } catch (error: any) {
      console.error('Failed to save stage', error);
      setError(error.message || 'Failed to save stage');
    }
  };

  const handleDelete = async (stageId: string) => {
    try {
      setError(null);
      const res = await fetch(`/api/crm/pipeline-stages/${stageId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete stage');
      }

      await fetchStages();
      setDeleteConfirm(null);
    } catch (error: any) {
      console.error('Failed to delete stage', error);
      setError(error.message || 'Failed to delete stage');
      setDeleteConfirm(null);
    }
  };

  const handleReorder = async (stageId: string, direction: 'up' | 'down') => {
    try {
      const sortedStages = [...stages].sort((a, b) => a.order - b.order);
      const index = sortedStages.findIndex(s => s.id === stageId);
      if (index === -1) return;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= sortedStages.length) return;

      // Swap orders
      const stage1 = sortedStages[index];
      const stage2 = sortedStages[newIndex];
      const tempOrder = stage1.order;
      stage1.order = stage2.order;
      stage2.order = tempOrder;

      // Update via reorder endpoint
      const res = await fetch('/api/crm/pipeline-stages/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stages: sortedStages.map(s => ({ id: s.id, order: s.order })),
        }),
      });

      if (!res.ok) throw new Error('Failed to reorder stages');
      await fetchStages();
    } catch (error) {
      console.error('Failed to reorder stages', error);
      setError('Failed to reorder stages');
    }
  };

  useEffect(() => {
    fetchStages();
  }, []);

  const sortedStages = [...stages].sort((a, b) => a.order - b.order);
  const forecastCategories = [
    { value: '', label: 'None' },
    { value: 'Pipeline', label: 'Pipeline' },
    { value: 'BestCase', label: 'Best Case' },
    { value: 'Commit', label: 'Commit' },
    { value: 'Omitted', label: 'Omitted' },
  ];

  if (loading) {
    return <Spinner />;
  }

  return (
    <Page 
      title="Pipeline Stages"
      description="Configure the stages your deals move through from initial contact to close"
      actions={
        !isCreating && !editingStage ? (
          <UIButton
            variant="primary"
            onClick={handleCreate}
          >
            <Plus size={16} style={{ marginRight: '8px' }} />
            Add Stage
          </UIButton>
        ) : undefined
      }
    >
      {error && (
        <Alert variant="error" title="Error">
          {error}
        </Alert>
      )}

      {(isCreating || editingStage) && (
        <div style={{ marginBottom: '24px' }}>
          <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>
              {editingStage ? 'Edit Stage' : 'Create New Stage'}
            </h3>
            <button
              onClick={handleCancel}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              aria-label="Cancel"
            >
              <X size={20} />
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Stage Code"
              value={formData.code}
              onChange={(value) => setFormData({ ...formData, code: normalizeStageCode(value) })}
              placeholder="e.g. qualified, closed_won"
              required={!editingStage}
              disabled={Boolean(editingStage)}
            />
            <p style={{ marginTop: '-8px', fontSize: '12px', color: 'var(--hit-muted-foreground)' }}>
              {editingStage
                ? 'Code is the identity and cannot be changed.'
                : 'Stable identifier (lowercase, underscores).'}
            </p>
            <Input
              label="Stage Name"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
              required
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input
                label="Order"
                type="number"
                value={formData.order.toString()}
                onChange={(value) => setFormData({ ...formData, order: parseInt(value) || 1 })}
                required
              />
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: 500, 
                  color: 'var(--hit-foreground)',
                  marginBottom: '8px',
                }}>
                  Color
                </label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '4px',
                    backgroundColor: 'var(--hit-input-bg)',
                    border: '1px solid var(--hit-input-border)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input
                label="Probability (%)"
                type="number"
                value={formData.probability?.toString() || ''}
                onChange={(value) => setFormData({ ...formData, probability: value ? parseInt(value) : null })}
                placeholder="0-100"
              />
              <Select
                label="Forecast Category"
                options={forecastCategories}
                value={formData.forecastCategory}
                onChange={(value) => setFormData({ ...formData, forecastCategory: value })}
              />
            </div>

            <Input
              label="WIP Limit (optional)"
              type="number"
              value={formData.wipLimit?.toString() || ''}
              onChange={(value) => setFormData({ ...formData, wipLimit: value ? parseInt(value) : null })}
              placeholder="Maximum deals in this stage"
            />

            <div style={{ display: 'flex', gap: '16px' }}>
              <Checkbox
                label="Closed Won"
                checked={formData.isClosedWon}
                onChange={(checked) => {
                  setFormData({ 
                    ...formData, 
                    isClosedWon: checked,
                    isClosedLost: checked ? false : formData.isClosedLost,
                  });
                }}
              />
              <Checkbox
                label="Closed Lost"
                checked={formData.isClosedLost}
                onChange={(checked) => {
                  setFormData({ 
                    ...formData, 
                    isClosedLost: checked,
                    isClosedWon: checked ? false : formData.isClosedWon,
                  });
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <UIButton variant="secondary" onClick={handleCancel}>
                Cancel
              </UIButton>
              <UIButton variant="primary" onClick={handleSave}>
                {editingStage ? 'Update' : 'Create'} Stage
              </UIButton>
            </div>
          </div>
          </Card>
        </div>
      )}

      <Card>
        {stages.length === 0 ? (
          <div className="text-center py-12">
            <p className="mb-4" style={{ color: 'var(--hit-foreground)' }}>
              No pipeline stages configured yet.
            </p>
            <p className="text-sm" style={{ color: 'var(--hit-muted-foreground)' }}>
              Default pipeline stages should be seeded automatically via migration.
              <br />
              If you see this message, please run database migrations.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-4 text-sm font-medium pb-3 border-b" style={{ borderColor: 'var(--hit-border)', color: 'var(--hit-muted-foreground)' }}>
              <div>Order</div>
              <div>Stage Name</div>
              <div>Status</div>
              <div>Closed Won</div>
              <div>Closed Lost</div>
              <div>Config</div>
              <div>Actions</div>
            </div>
            <div className="space-y-2">
              {sortedStages.map((stage, index) => (
                <div
                  key={stage.id}
                  className="grid grid-cols-7 gap-4 py-3 px-4 rounded-lg border items-center"
                  style={{ 
                    backgroundColor: 'var(--hit-muted)',
                    borderColor: 'var(--hit-border)',
                    borderLeft: `4px solid ${stage.customerConfig?.color || '#3b82f6'}`,
                  }}
                >
                  <div style={{ color: 'var(--hit-foreground)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {index > 0 && (
                      <button
                        onClick={() => handleReorder(stage.id, 'up')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                        aria-label="Move up"
                      >
                        <ArrowUp size={16} />
                      </button>
                    )}
                    <span>{stage.order}</span>
                    {index < sortedStages.length - 1 && (
                      <button
                        onClick={() => handleReorder(stage.id, 'down')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                        aria-label="Move down"
                      >
                        <ArrowDown size={16} />
                      </button>
                    )}
                  </div>
                  <div className="font-medium" style={{ color: 'var(--hit-foreground)' }}>{stage.name}</div>
                  <div style={{ color: 'var(--hit-muted-foreground)' }}>
                    {stage.isClosedWon || stage.isClosedLost ? 'Final' : 'Active'}
                  </div>
                  <div style={{ color: 'var(--hit-muted-foreground)' }}>
                    {stage.isClosedWon ? '✓' : '—'}
                  </div>
                  <div style={{ color: 'var(--hit-muted-foreground)' }}>
                    {stage.isClosedLost ? '✓' : '—'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--hit-muted-foreground)' }}>
                    {stage.customerConfig?.probability !== undefined && `${stage.customerConfig.probability}%`}
                    {stage.customerConfig?.forecastCategory && ` • ${stage.customerConfig.forecastCategory}`}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEdit(stage)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                      aria-label="Edit stage"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(stage.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: 'var(--hit-error, #ef4444)',
                      }}
                      aria-label="Delete stage"
                      title="Delete stage"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-6 mt-6 border-t" style={{ borderColor: 'var(--hit-border)' }}>
          <p className="text-sm" style={{ color: 'var(--hit-muted-foreground)' }}>
            <strong style={{ color: 'var(--hit-foreground)' }}>Sales Workflow:</strong> When you create a deal, you'll assign it to a pipeline stage.
            Move deals through stages using the Kanban board view. Deals in "Closed Won" or "Closed Lost"
            stages are considered final.
          </p>
        </div>
      </Card>

      {deleteConfirm && (
        <Modal
          open={true}
          onClose={() => setDeleteConfirm(null)}
          title="Delete Pipeline Stage"
        >
          <div style={{ padding: '16px' }}>
            <p style={{ marginBottom: '16px' }}>
              Are you sure you want to delete this pipeline stage? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <UIButton variant="secondary" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </UIButton>
              <UIButton variant="danger" onClick={() => handleDelete(deleteConfirm)}>
                Delete
              </UIButton>
            </div>
          </div>
        </Modal>
      )}
    </Page>
  );
}

export default PipelineStageManage;
