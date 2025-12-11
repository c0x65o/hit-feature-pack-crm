'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useUi } from '@hit/ui-kit';
export function PipelineStageManage({ onNavigate }) {
    const { Page, Card, Button, Spinner } = useUi();
    const [stages, setStages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [initializing, setInitializing] = useState(false);
    const navigate = (path) => {
        if (onNavigate) {
            onNavigate(path);
        }
        else if (typeof window !== 'undefined') {
            window.location.href = path;
        }
    };
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
        }
        finally {
            setLoading(false);
        }
    };
    const initializeStages = async () => {
        try {
            setInitializing(true);
            const res = await fetch('/api/crm/pipeline-stages/init', {
                method: 'POST',
            });
            if (!res.ok)
                throw new Error('Failed to initialize stages');
            await fetchStages();
        }
        catch (error) {
            console.error('Failed to initialize pipeline stages', error);
            alert('Failed to initialize pipeline stages');
        }
        finally {
            setInitializing(false);
        }
    };
    useEffect(() => {
        fetchStages();
    }, []);
    if (loading) {
        return _jsx(Spinner, {});
    }
    return (_jsx(Page, { title: "Pipeline Stages", description: "Configure the stages your deals move through from initial contact to close", actions: stages.length === 0 ? (_jsx(Button, { variant: "primary", onClick: initializeStages, disabled: initializing, children: initializing ? 'Initializing...' : 'Initialize Default Stages' })) : undefined, children: _jsxs(Card, { children: [stages.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx("p", { className: "mb-4", style: { color: 'var(--hit-foreground)' }, children: "No pipeline stages configured yet." }), _jsxs("p", { className: "text-sm mb-6", style: { color: 'var(--hit-muted-foreground)' }, children: ["Click \"Initialize Default Stages\" to create the standard sales pipeline:", _jsx("br", {}), _jsx("span", { className: "font-medium", children: "Lead \u2192 Qualified \u2192 Proposal \u2192 Negotiation \u2192 Closed Won / Closed Lost" })] }), _jsx(Button, { variant: "primary", onClick: initializeStages, disabled: initializing, children: initializing ? 'Initializing...' : 'Initialize Default Stages' })] })) : (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-5 gap-4 text-sm font-medium pb-3 border-b", style: { borderColor: 'var(--hit-border)', color: 'var(--hit-muted-foreground)' }, children: [_jsx("div", { children: "Order" }), _jsx("div", { children: "Stage Name" }), _jsx("div", { children: "Status" }), _jsx("div", { children: "Closed Won" }), _jsx("div", { children: "Closed Lost" })] }), _jsx("div", { className: "space-y-2", children: stages
                                .sort((a, b) => a.order - b.order)
                                .map((stage) => (_jsxs("div", { className: "grid grid-cols-5 gap-4 py-3 px-4 rounded-lg border", style: {
                                    backgroundColor: 'var(--hit-muted)',
                                    borderColor: 'var(--hit-border)'
                                }, children: [_jsx("div", { style: { color: 'var(--hit-foreground)' }, children: stage.order }), _jsx("div", { className: "font-medium", style: { color: 'var(--hit-foreground)' }, children: stage.name }), _jsx("div", { style: { color: 'var(--hit-muted-foreground)' }, children: stage.isClosedWon || stage.isClosedLost ? 'Final' : 'Active' }), _jsx("div", { style: { color: 'var(--hit-muted-foreground)' }, children: stage.isClosedWon ? '✓' : '—' }), _jsx("div", { style: { color: 'var(--hit-muted-foreground)' }, children: stage.isClosedLost ? '✓' : '—' })] }, stage.id))) })] })), _jsx("div", { className: "pt-6 mt-6 border-t", style: { borderColor: 'var(--hit-border)' }, children: _jsxs("p", { className: "text-sm", style: { color: 'var(--hit-muted-foreground)' }, children: [_jsx("strong", { style: { color: 'var(--hit-foreground)' }, children: "Sales Workflow:" }), " When you create a deal, you'll assign it to a pipeline stage. Move deals through stages using the Kanban board view. Deals in \"Closed Won\" or \"Closed Lost\" stages are considered final."] }) })] }) }));
}
export default PipelineStageManage;
//# sourceMappingURL=PipelineStageManage.js.map