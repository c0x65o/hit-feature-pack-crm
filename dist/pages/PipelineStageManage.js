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
    return (_jsx(Page, { title: "Pipeline Stages", children: _jsx(Card, { children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold text-white", children: "Sales Pipeline Stages" }), _jsx("p", { className: "text-sm text-gray-400 mt-1", children: "Pipeline stages define the steps a deal goes through from initial contact to close." })] }), stages.length === 0 && (_jsx(Button, { variant: "primary", onClick: initializeStages, disabled: initializing, children: initializing ? 'Initializing...' : 'Initialize Default Stages' }))] }), stages.length === 0 ? (_jsxs("div", { className: "text-center py-12 border border-gray-700 rounded-lg bg-gray-800/50", children: [_jsx("p", { className: "text-gray-400 mb-4", children: "No pipeline stages configured yet." }), _jsxs("p", { className: "text-sm text-gray-500 mb-6", children: ["Click \"Initialize Default Stages\" to create the standard sales pipeline:", _jsx("br", {}), "Lead \u2192 Qualified \u2192 Proposal \u2192 Negotiation \u2192 Closed Won / Closed Lost"] }), _jsx(Button, { variant: "primary", onClick: initializeStages, disabled: initializing, children: initializing ? 'Initializing...' : 'Initialize Default Stages' })] })) : (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "grid grid-cols-5 gap-4 text-sm font-medium text-gray-400 pb-2 border-b border-gray-700", children: [_jsx("div", { children: "Order" }), _jsx("div", { children: "Stage Name" }), _jsx("div", { children: "Status" }), _jsx("div", { children: "Closed Won" }), _jsx("div", { children: "Closed Lost" })] }), stages
                                .sort((a, b) => a.order - b.order)
                                .map((stage) => (_jsxs("div", { className: "grid grid-cols-5 gap-4 py-3 px-4 bg-gray-800/50 rounded-lg border border-gray-700", children: [_jsx("div", { className: "text-white", children: stage.order }), _jsx("div", { className: "text-white font-medium", children: stage.name }), _jsx("div", { className: "text-gray-400", children: stage.isClosedWon || stage.isClosedLost ? 'Final' : 'Active' }), _jsx("div", { className: "text-gray-400", children: stage.isClosedWon ? '✓' : '—' }), _jsx("div", { className: "text-gray-400", children: stage.isClosedLost ? '✓' : '—' })] }, stage.id)))] })), _jsx("div", { className: "pt-4 border-t border-gray-700", children: _jsxs("p", { className: "text-sm text-gray-400", children: [_jsx("strong", { children: "Sales Workflow:" }), " When you create a deal, you'll assign it to a pipeline stage. Move deals through stages using the Kanban board view. Deals in \"Closed Won\" or \"Closed Lost\" stages are considered final."] }) })] }) }) }));
}
export default PipelineStageManage;
//# sourceMappingURL=PipelineStageManage.js.map