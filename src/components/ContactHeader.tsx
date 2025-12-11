'use client';

import React from 'react';
import { Phone, Mail, Building } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import type { CrmContact } from '../schema/crm';

interface ContactHeaderProps {
  contact: CrmContact;
  companyName?: string;
}

export function ContactHeader({ contact, companyName }: ContactHeaderProps) {
  const { Card, Button, Badge } = useUi();

  return (
    <div className="mb-6">
      <Card>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="mb-2 text-2xl font-bold">
              {contact.name}
            </h2>
            {contact.title && (
              <div className="text-lg text-gray-600 mb-2">{contact.title}</div>
            )}
            {companyName && (
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Building size={16} />
                {companyName}
              </div>
            )}
            <div className="flex gap-2 mt-4">
              {contact.phone && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    window.location.href = `tel:${contact.phone}`;
                  }}
                >
                  <Phone size={16} className="mr-2" />
                  Call
                </Button>
              )}
              {contact.email && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    window.location.href = `mailto:${contact.email}`;
                  }}
                >
                  <Mail size={16} className="mr-2" />
                  Email
                </Button>
              )}
            </div>
          </div>
          {contact.lastContactedDate && (
            <Badge variant="default">
              Last contacted: {new Date(contact.lastContactedDate).toLocaleDateString()}
            </Badge>
          )}
        </div>
      </Card>
    </div>
  );
}

