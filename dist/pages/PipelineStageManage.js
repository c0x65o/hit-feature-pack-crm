'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useUi } from '@hit/ui-kit';
import { ArrowUp, ArrowDown, Edit, Trash2, Plus, X } from 'lucide-react';
function normalizeStageCode(input) {
    return input
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
}
export function PipelineStageManage({ onNavigate: _onNavigate }) {
    const { Page, Card, Button: UIButton, Spinner, Alert, Modal, Input, Select, Checkbox } = useUi();
    const [stages, setStages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingStage, setEditingStage] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [formData, setFormData] = useState({
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
            if (!res.ok)
                throw new Error('Failed to fetch stages');
            const data = await res.json();
            setStages(data.items || []);
        }
        catch (error) {
            console.error('Failed to fetch pipeline stages', error);
            setError('Failed to load pipeline stages');
        }
        finally {
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
    const handleEdit = (stage) => {
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
            const customerConfig = {};
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
            const payload = {
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
            }
            else {
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
        }
        catch (error) {
            console.error('Failed to save stage', error);
            setError(error.message || 'Failed to save stage');
        }
    };
    const handleDelete = async (stageId) => {
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
        }
        catch (error) {
            console.error('Failed to delete stage', error);
            setError(error.message || 'Failed to delete stage');
            setDeleteConfirm(null);
        }
    };
    const handleReorder = async (stageId, direction) => {
        try {
            const sortedStages = [...stages].sort((a, b) => a.order - b.order);
            const index = sortedStages.findIndex(s => s.id === stageId);
            if (index === -1)
                return;
            const newIndex = direction === 'up' ? index - 1 : index + 1;
            if (newIndex < 0 || newIndex >= sortedStages.length)
                return;
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
            if (!res.ok)
                throw new Error('Failed to reorder stages');
            await fetchStages();
        }
        catch (error) {
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
        return _jsx(Spinner, {});
    }
    return (_jsxs(Page, { title: "Pipeline Stages", description: "Configure the stages your deals move through from initial contact to close", actions: !isCreating && !editingStage ? (_jsxs(UIButton, { variant: "primary", onClick: handleCreate, children: [_jsx(Plus, { size: 16, style: { marginRight: '8px' } }), "Add Stage"] })) : undefined, children: [error && (_jsx(Alert, { variant: "error", title: "Error", children: error })), (isCreating || editingStage) && (_jsx("div", { style: { marginBottom: '24px' }, children: _jsxs(Card, { children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }, children: [_jsx("h3", { style: { fontSize: '18px', fontWeight: 600 }, children: editingStage ? 'Edit Stage' : 'Create New Stage' }), _jsx("button", { onClick: handleCancel, style: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }, "aria-label": "Cancel", children: _jsx(X, { size: 20 }) })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '16px' }, children: [_jsx(Input, { label: "Stage Code", value: formData.code, onChange: (value) => setFormData({ ...formData, code: normalizeStageCode(value) }), placeholder: "e.g. qualified, closed_won", required: !editingStage, disabled: Boolean(editingStage) }), _jsx("p", { style: { marginTop: '-8px', fontSize: '12px', color: 'var(--hit-muted-foreground)' }, children: editingStage
                                        ? 'Code is the identity and cannot be changed.'
                                        : 'Stable identifier (lowercase, underscores).' }), _jsx(Input, { label: "Stage Name", value: formData.name, onChange: (value) => setFormData({ ...formData, name: value }), required: true }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }, children: [_jsx(Input, { label: "Order", type: "number", value: formData.order.toString(), onChange: (value) => setFormData({ ...formData, order: parseInt(value) || 1 }), required: true }), _jsxs("div", { children: [_jsx("label", { style: {
                                                        display: 'block',
                                                        fontSize: '14px',
                                                        fontWeight: 500,
                                                        color: 'var(--hit-foreground)',
                                                        marginBottom: '8px',
                                                    }, children: "Color" }), _jsx("input", { type: "color", value: formData.color, onChange: (e) => setFormData({ ...formData, color: e.target.value }), style: {
                                                        width: '100%',
                                                        height: '40px',
                                                        padding: '4px',
                                                        backgroundColor: 'var(--hit-input-bg)',
                                                        border: '1px solid var(--hit-input-border)',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        boxSizing: 'border-box',
                                                    } })] })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }, children: [_jsx(Input, { label: "Probability (%)", type: "number", value: formData.probability?.toString() || '', onChange: (value) => setFormData({ ...formData, probability: value ? parseInt(value) : null }), placeholder: "0-100" }), _jsx(Select, { label: "Forecast Category", options: forecastCategories, value: formData.forecastCategory, onChange: (value) => setFormData({ ...formData, forecastCategory: value }) })] }), _jsx(Input, { label: "WIP Limit (optional)", type: "number", value: formData.wipLimit?.toString() || '', onChange: (value) => setFormData({ ...formData, wipLimit: value ? parseInt(value) : null }), placeholder: "Maximum deals in this stage" }), _jsxs("div", { style: { display: 'flex', gap: '16px' }, children: [_jsx(Checkbox, { label: "Closed Won", checked: formData.isClosedWon, onChange: (checked) => {
                                                setFormData({
                                                    ...formData,
                                                    isClosedWon: checked,
                                                    isClosedLost: checked ? false : formData.isClosedLost,
                                                });
                                            } }), _jsx(Checkbox, { label: "Closed Lost", checked: formData.isClosedLost, onChange: (checked) => {
                                                setFormData({
                                                    ...formData,
                                                    isClosedLost: checked,
                                                    isClosedWon: checked ? false : formData.isClosedWon,
                                                });
                                            } })] }), _jsxs("div", { style: { display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }, children: [_jsx(UIButton, { variant: "secondary", onClick: handleCancel, children: "Cancel" }), _jsxs(UIButton, { variant: "primary", onClick: handleSave, children: [editingStage ? 'Update' : 'Create', " Stage"] })] })] })] }) })), _jsxs(Card, { children: [stages.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx("p", { className: "mb-4", style: { color: 'var(--hit-foreground)' }, children: "No pipeline stages configured yet." }), _jsxs("p", { className: "text-sm", style: { color: 'var(--hit-muted-foreground)' }, children: ["Default pipeline stages should be seeded automatically via migration.", _jsx("br", {}), "If you see this message, please run database migrations."] })] })) : (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-7 gap-4 text-sm font-medium pb-3 border-b", style: { borderColor: 'var(--hit-border)', color: 'var(--hit-muted-foreground)' }, children: [_jsx("div", { children: "Order" }), _jsx("div", { children: "Stage Name" }), _jsx("div", { children: "Status" }), _jsx("div", { children: "Closed Won" }), _jsx("div", { children: "Closed Lost" }), _jsx("div", { children: "Config" }), _jsx("div", { children: "Actions" })] }), _jsx("div", { className: "space-y-2", children: sortedStages.map((stage, index) => (_jsxs("div", { className: "grid grid-cols-7 gap-4 py-3 px-4 rounded-lg border items-center", style: {
                                        backgroundColor: 'var(--hit-muted)',
                                        borderColor: 'var(--hit-border)',
                                        borderLeft: `4px solid ${stage.customerConfig?.color || '#3b82f6'}`,
                                    }, children: [_jsxs("div", { style: { color: 'var(--hit-foreground)', display: 'flex', alignItems: 'center', gap: '8px' }, children: [index > 0 && (_jsx("button", { onClick: () => handleReorder(stage.id, 'up'), style: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }, "aria-label": "Move up", children: _jsx(ArrowUp, { size: 16 }) })), _jsx("span", { children: stage.order }), index < sortedStages.length - 1 && (_jsx("button", { onClick: () => handleReorder(stage.id, 'down'), style: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }, "aria-label": "Move down", children: _jsx(ArrowDown, { size: 16 }) }))] }), _jsx("div", { className: "font-medium", style: { color: 'var(--hit-foreground)' }, children: stage.name }), _jsx("div", { style: { color: 'var(--hit-muted-foreground)' }, children: stage.isClosedWon || stage.isClosedLost ? 'Final' : 'Active' }), _jsx("div", { style: { color: 'var(--hit-muted-foreground)' }, children: stage.isClosedWon ? '✓' : '—' }), _jsx("div", { style: { color: 'var(--hit-muted-foreground)' }, children: stage.isClosedLost ? '✓' : '—' }), _jsxs("div", { style: { fontSize: '12px', color: 'var(--hit-muted-foreground)' }, children: [stage.customerConfig?.probability !== undefined && `${stage.customerConfig.probability}%`, stage.customerConfig?.forecastCategory && ` • ${stage.customerConfig.forecastCategory}`] }), _jsxs("div", { style: { display: 'flex', gap: '8px' }, children: [_jsx("button", { onClick: () => handleEdit(stage), style: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }, "aria-label": "Edit stage", children: _jsx(Edit, { size: 16 }) }), _jsx("button", { onClick: () => setDeleteConfirm(stage.id), disabled: Boolean(stage.isSystem), style: {
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: stage.isSystem ? 'not-allowed' : 'pointer',
                                                        padding: '4px',
                                                        color: stage.isSystem ? 'var(--hit-muted-foreground)' : 'var(--hit-error, #ef4444)',
                                                        opacity: stage.isSystem ? 0.5 : 1,
                                                    }, "aria-label": "Delete stage", title: stage.isSystem ? 'System stages cannot be deleted' : 'Delete stage', children: _jsx(Trash2, { size: 16 }) })] })] }, stage.id))) })] })), _jsx("div", { className: "pt-6 mt-6 border-t", style: { borderColor: 'var(--hit-border)' }, children: _jsxs("p", { className: "text-sm", style: { color: 'var(--hit-muted-foreground)' }, children: [_jsx("strong", { style: { color: 'var(--hit-foreground)' }, children: "Sales Workflow:" }), " When you create a deal, you'll assign it to a pipeline stage. Move deals through stages using the Kanban board view. Deals in \"Closed Won\" or \"Closed Lost\" stages are considered final."] }) })] }), deleteConfirm && (_jsx(Modal, { open: true, onClose: () => setDeleteConfirm(null), title: "Delete Pipeline Stage", children: _jsxs("div", { style: { padding: '16px' }, children: [_jsx("p", { style: { marginBottom: '16px' }, children: "Are you sure you want to delete this pipeline stage? This action cannot be undone." }), _jsxs("div", { style: { display: 'flex', gap: '8px', justifyContent: 'flex-end' }, children: [_jsx(UIButton, { variant: "secondary", onClick: () => setDeleteConfirm(null), children: "Cancel" }), _jsx(UIButton, { variant: "danger", onClick: () => handleDelete(deleteConfirm), children: "Delete" })] })] }) }))] }));
}
export default PipelineStageManage;
//# sourceMappingURL=PipelineStageManage.js.map