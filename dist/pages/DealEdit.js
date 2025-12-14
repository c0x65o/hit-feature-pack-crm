'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Users, Handshake } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useCrmDeals } from '../hooks/useCrmDeals';
import { useCrmPipelineStages } from '../hooks/useCrmPipelineStages';
import { CurrencyInput, DateInput } from '../components/fields';
export function DealEdit({ id, onNavigate }) {
    const dealId = id === 'new' ? undefined : id;
    const { Page, Card, Input, Button, Select, Spinner } = useUi();
    const { data: deal, loading, createDeal, updateDeal } = useCrmDeals({ id: dealId });
    const { data: stages } = useCrmPipelineStages();
    const [dealName, setDealName] = useState('');
    const [amount, setAmount] = useState(null);
    const [closeDateEstimate, setCloseDateEstimate] = useState(null);
    const [pipelineStage, setPipelineStage] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    useEffect(() => {
        if (deal) {
            setDealName(deal.dealName || '');
            setAmount(deal.amount ? (typeof deal.amount === 'string' ? parseFloat(deal.amount) : deal.amount) : null);
            setCloseDateEstimate(deal.closeDateEstimate ? new Date(deal.closeDateEstimate).toISOString().split('T')[0] : null);
            setPipelineStage(deal.pipelineStage || '');
        }
    }, [deal]);
    const navigate = (path) => {
        if (onNavigate) {
            onNavigate(path);
        }
        else if (typeof window !== 'undefined') {
            window.location.href = path;
        }
    };
    const validateForm = () => {
        const errors = {};
        if (!dealName.trim()) {
            errors.dealName = 'Deal Name is required';
        }
        if (amount === null || Number.isNaN(amount)) {
            errors.amount = 'Amount is required';
        }
        if (!pipelineStage) {
            errors.pipelineStage = 'Pipeline Stage is required';
        }
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm())
            return;
        try {
            const data = {
                dealName,
                amount: amount,
                closeDateEstimate: closeDateEstimate || undefined,
                pipelineStage,
            };
            if (dealId) {
                await updateDeal(dealId, data);
                navigate(`/crm/deals/${dealId}`);
            }
            else {
                const newDeal = await createDeal(data);
                navigate(`/crm/deals/${newDeal.id}`);
            }
        }
        catch {
            // Error handled by hook
        }
    };
    if (loading && dealId) {
        return _jsx(Spinner, {});
    }
    const breadcrumbs = [
        { label: 'CRM', href: '/crm', icon: _jsx(Users, { size: 14 }) },
        { label: 'Deals', href: '/crm/deals', icon: _jsx(Handshake, { size: 14 }) },
        ...(dealId && deal ? [{ label: deal.dealName, href: `/crm/deals/${dealId}` }] : []),
        { label: dealId ? 'Edit' : 'New' },
    ];
    return (_jsx(Page, { title: dealId ? 'Edit Deal' : 'New Deal', breadcrumbs: breadcrumbs, onNavigate: navigate, children: _jsx(Card, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsx(Input, { label: "Deal Name", value: dealName, onChange: setDealName, required: true, error: fieldErrors.dealName }), _jsx(CurrencyInput, { label: "Amount", value: amount, onChange: setAmount, required: true, error: fieldErrors.amount }), _jsx(DateInput, { label: "Close Date Estimate", value: closeDateEstimate, onChange: setCloseDateEstimate, error: fieldErrors.closeDateEstimate }), stages && stages.length > 0 ? (_jsx(Select, { label: "Pipeline Stage", options: stages.map((s) => ({ value: s.id, label: s.name })), value: pipelineStage, onChange: setPipelineStage, required: true, error: fieldErrors.pipelineStage })) : (_jsxs("div", { className: "p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg", children: [_jsx("p", { className: "text-yellow-400 text-sm mb-3", children: "No pipeline stages configured. You need to set up pipeline stages before creating deals." }), _jsx("button", { type: "button", onClick: () => navigate('/crm/pipeline-stages'), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm", children: "Setup Pipeline Stages" })] })), _jsx("div", { className: "flex items-center justify-end gap-3 pt-4 mt-4 border-t border-gray-800", children: _jsxs(Button, { type: "submit", variant: "primary", children: [dealId ? 'Update' : 'Create', " Deal"] }) })] }) }) }));
}
export default DealEdit;
//# sourceMappingURL=DealEdit.js.map