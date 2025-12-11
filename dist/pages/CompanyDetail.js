'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUi } from '@hit/ui-kit';
import { useCrmCompanies } from '../hooks/useCrmCompanies';
export function CompanyDetail({ id, onNavigate }) {
    const companyId = id === 'new' ? undefined : id;
    const { Page, Card, Spinner, Alert } = useUi();
    const { data: company, loading } = useCrmCompanies({ id: companyId });
    if (loading) {
        return _jsx(Spinner, {});
    }
    if (!company) {
        return (_jsx(Alert, { variant: "error", title: "Company not found", children: "The company you're looking for doesn't exist." }));
    }
    return (_jsx(Page, { title: company.name, children: _jsx(Card, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("strong", { children: "Website:" }), " ", company.website || 'N/A'] }), _jsxs("div", { children: [_jsx("strong", { children: "Email:" }), " ", company.companyEmail || 'N/A'] }), _jsxs("div", { children: [_jsx("strong", { children: "Phone:" }), " ", company.companyPhone || 'N/A'] }), company.address && (_jsxs("div", { children: [_jsx("strong", { children: "Address:" }), " ", company.address] }))] }) }) }));
}
export default CompanyDetail;
//# sourceMappingURL=CompanyDetail.js.map