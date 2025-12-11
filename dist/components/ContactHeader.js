'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Phone, Mail, Building } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
export function ContactHeader({ contact, companyName }) {
    const { Card, Button, Badge } = useUi();
    return (_jsx("div", { className: "mb-6", children: _jsx(Card, { children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h2", { className: "mb-2 text-2xl font-bold", children: contact.name }), contact.title && (_jsx("div", { className: "text-lg text-gray-600 mb-2", children: contact.title })), companyName && (_jsxs("div", { className: "flex items-center gap-2 text-gray-500 mb-2", children: [_jsx(Building, { size: 16 }), companyName] })), _jsxs("div", { className: "flex gap-2 mt-4", children: [contact.phone && (_jsxs(Button, { variant: "secondary", size: "sm", onClick: () => {
                                            window.location.href = `tel:${contact.phone}`;
                                        }, children: [_jsx(Phone, { size: 16, className: "mr-2" }), "Call"] })), contact.email && (_jsxs(Button, { variant: "secondary", size: "sm", onClick: () => {
                                            window.location.href = `mailto:${contact.email}`;
                                        }, children: [_jsx(Mail, { size: 16, className: "mr-2" }), "Email"] }))] })] }), contact.lastContactedDate && (_jsxs(Badge, { variant: "default", children: ["Last contacted: ", new Date(contact.lastContactedDate).toLocaleDateString()] }))] }) }) }));
}
//# sourceMappingURL=ContactHeader.js.map