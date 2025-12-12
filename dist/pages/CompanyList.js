'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Plus } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useCrmCompanies } from '../hooks/useCrmCompanies';
export function CompanyList() {
    const { Page, Card, Button, DataTable, Spinner } = useUi();
    const { data, loading, refetch } = useCrmCompanies({});
    return (_jsx(Page, { title: "Companies", description: "Manage companies", actions: _jsxs(Button, { variant: "primary", onClick: () => window.location.href = '/crm/companies/new', children: [_jsx(Plus, { size: 16, className: "mr-2" }), "New Company"] }), children: _jsx(Card, { children: loading ? (_jsx(Spinner, {})) : (_jsx(DataTable, { columns: [
                    { key: 'name', label: 'Name', sortable: true },
                    { key: 'website', label: 'Website' },
                    { key: 'companyEmail', label: 'Email' },
                    { key: 'companyPhone', label: 'Phone' },
                ], data: data?.items || [], loading: loading, onRefresh: refetch, onRowClick: (row) => {
                    window.location.href = `/crm/companies/${row.id}`;
                } })) }) }));
}
export default CompanyList;
//# sourceMappingURL=CompanyList.js.map