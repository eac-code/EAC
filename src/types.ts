/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PermitType = 
  | 'construction_permit'
  | 'business_licence'
  | 'event_permit'
  | 'noise_variance'
  | 'signage_permit';

export const PERMIT_TYPE_LABELS: Record<PermitType, string> = {
  construction_permit: 'Construction Permit',
  business_licence: 'Business Licence',
  event_permit: 'Event Permit',
  noise_variance: 'Noise Variance Permit',
  signage_permit: 'Signage Permit'
};

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'FLAGGED' | 'DENIED';

export interface PermitApplication {
  id: string; // PRM-YYYY-XXXXX format
  fullName: string;
  email: string;
  phone: string;
  organization?: string;
  permitType: PermitType;
  projectAddress: string;
  startDate: string; // YYYY-MM-DD
  estimatedDuration: string;
  description: string; // 100-500 words
  declarationTicked: boolean;
  submissionDate: string; // YYYY-MM-DD HH:MM
  status: ApplicationStatus;
  adminNotes: string;
  denialReason?: string;
  updatedAt?: string;
}

export interface AdminUser {
  isAuthenticated: boolean;
}

export const PRESET_DENIAL_REASONS = [
  'Incomplete safety documentation and hazard mitigation assessment.',
  'Proposed activity violates local zoning bylaws or municipal land-use code.',
  'Inadequate liability insurance coverage for the proposed scope and duration.',
  'Conflict with scheduled municipal infrastructure works or public upgrades.',
  'Missing formal certified architectural or engineering drawings.',
  'Proposed noise variance parameters exceed maximum town decibel thresholds.'
];
