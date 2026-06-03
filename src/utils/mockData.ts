/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PermitApplication } from '../types';

export const INITIAL_MOCK_APPLICATIONS: PermitApplication[] = [
  {
    id: 'PRM-2026-34821',
    fullName: 'Sarah Jenkins',
    email: 'sarah.j@metrobuilders.com',
    phone: '555-019-2834',
    organization: 'Metro Builders Inc.',
    permitType: 'construction_permit',
    projectAddress: '1428 Oak Street, Ward 4',
    startDate: '2026-06-25',
    estimatedDuration: '45 Days',
    description: 'This application outlines the structural renovation and restoration of a historical commercial facade. Work includes light masonry repair, window replacement matching the historical profile, and installation of external storm protection. Scaffolding will be erected on-site, fully adhering strictly to municipal safety regulations, leaving a clear 4-foot pedestrian corridor on the public sidewalk. All materials will be stored on-private property. Overhead netting will be installed to prevent debris fall, with specialized crews operating only during certified hours. Construction will follow municipal noise regulations and standard zoning code protocols to minimize local community disturbance, ensuring preservation of historic heritage elements.',
    declarationTicked: true,
    submissionDate: '2026-06-01 09:15',
    status: 'PENDING',
    adminNotes: ''
  },
  {
    id: 'PRM-2026-89104',
    fullName: 'Robert Chen',
    email: 'r.chen@cornerstonecafe.com',
    phone: '555-014-9988',
    organization: 'Cornerstone Cafe',
    permitType: 'business_licence',
    projectAddress: '312 Maple Boulevard, Suite B',
    startDate: '2026-06-30',
    estimatedDuration: 'Annual / Continuous',
    description: 'Application for an official municipal retail business licence to operate a specialty coffee shop and artisanal bakery at the designated address. The space has undergone full plumbing, mechanical, and electrical upgrades, which have been completed by certified tradespersons and conform fully to city safety codes. The establishment will serve hot beverages, baked pastries, and pre-packaged sandwiches. Indoor seating capacity is rated for 24 occupants, with staff counting 4 active employees scheduled per shift. Operation hours will be from 6:30 AM to 7:00 PM Monday through Saturday, closed Sundays. Commercial waste protocols are contracted, with daily collections on site.',
    declarationTicked: true,
    submissionDate: '2026-05-28 14:30',
    status: 'APPROVED',
    adminNotes: 'All health inspections and safety checklists complete. Fire marshall inspection approved. Business licence granted on June 2nd, 2026.',
    updatedAt: '2026-06-02 11:20'
  },
  {
    id: 'PRM-2026-47712',
    fullName: 'Elena Rostova',
    email: 'elena@vibrantcityfest.org',
    phone: '555-012-4521',
    organization: 'Vibrant City Association',
    permitType: 'event_permit',
    projectAddress: 'Centennial Park Common Grounds',
    startDate: '2026-07-04',
    estimatedDuration: '1 Day',
    description: 'We are requesting a community event permit to host the annual Midsummer Arts Festival within Centennial Park. The event will feature local painters, sculptors, and live acoustic musical performances. Expected attendance is around 300 to 500 citizens throughout the afternoon. We plan to set up 25 temporary vendor tents (10x10 feet each) arranged in parallel blocks to facilitate standard social flow and clear emergency egress pathways. Port-a-john services and dedicated waste recycling crews have been locked in with verified vendors. First aid tents will be fully staffed, with safety personnel patrolling the perimeter continuous to the festival schedules.',
    declarationTicked: true,
    submissionDate: '2026-06-02 11:00',
    status: 'FLAGGED',
    adminNotes: 'Please upload or submit the updated layout of vendor tents relative to the park play areas, as well as the proof of community liability insurance waiver form.',
    updatedAt: '2026-06-03 10:45'
  },
  {
    id: 'PRM-2026-22904',
    fullName: 'Marcus Vance',
    email: 'marcus.vance@soundvibes.net',
    phone: '555-016-1773',
    organization: 'SoundVibes Entertainment LLC',
    permitType: 'noise_variance',
    projectAddress: '889 Docklands Industrial Alley',
    startDate: '2026-06-12',
    estimatedDuration: '3 Days',
    description: 'This is an application seeking a temporary noise variance permit for an outdoor industrial arts festival and music gathering over three consecutive nights. The sound system will feature heavy subwoofers and electronic amplification designed for large festivals. Live music, outdoor acoustic testing, and soundchecks are projected to run from 4:00 PM until 2:00 AM each evening. Stage sound levels are engineered to reach up to 105 decibels at the source, radiating outward across the industrial zone. Security guards will monitor the industrial access roads, and perimeter security fencing will encapsulate the entire footprint. Attendees will be restricted to designated event fields.',
    declarationTicked: true,
    submissionDate: '2026-05-25 18:40',
    status: 'DENIED',
    adminNotes: 'The request was evaluated under standard community zoning mandates. The projected hours (until 2 AM) violate municipal quiet hours.',
    denialReason: 'Proposed noise variance parameters exceed maximum town decibel thresholds.',
    updatedAt: '2026-05-27 15:50'
  },
  {
    id: 'PRM-2026-11894',
    fullName: 'Aiden Gallagher',
    email: 'a.gallagher@quantumretail.io',
    phone: '555-018-9321',
    organization: 'Quantum Retail Partners',
    permitType: 'signage_permit',
    projectAddress: '150 North Commercial Way',
    startDate: '2026-06-20',
    estimatedDuration: '5 Days',
    description: 'We are seeking approval for the installation of an active dual-sided illuminated exterior storefront sign above our commercial retail entrance. The sign dimensions are 3 feet in height by 12 feet in width, protruding a maximum of 10 inches from the existing brick facade. The sign will utilize low-temperature energy-efficient LED modules for soft, non-pulsing illumination. Standard aluminum mounting brackets will be affixed directly to structural wall studs securely. All electrical installation works will be handled by a licensed electrician, and the sign will operate with an automated timer turning off at 10:00 PM nightly to respect environmental standards.',
    declarationTicked: true,
    submissionDate: '2026-06-03 08:30',
    status: 'PENDING',
    adminNotes: ''
  }
];
