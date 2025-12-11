'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUi } from '@hit/ui-kit';
import { useCrmDeals } from '../hooks/useCrmDeals';
import { DealHeader } from '../components/DealHeader';
import { ActivityLog } from '../components/ActivityLog';
export function DealDetail({ id, onNavigate }) {
    const dealId = id === 'new' ? undefined : id;
    const { Page, Spinner, Alert } = useUi();
    const { data: deal, loading } = useCrmDeals({ id: dealId });
    if (loading) {
        return _jsx(Spinner, {});
    }
    if (!deal) {
        return (_jsx(Alert, { variant: "error", title: "Deal not found", children: "The deal you're looking for doesn't exist." }));
    }
    return (_jsxs(Page, { title: deal.dealName, children: [_jsx(DealHeader, { deal: deal }), _jsx(ActivityLog, { dealId: dealId || '' })] }));
}
export default DealDetail;
//# sourceMappingURL=DealDetail.js.map