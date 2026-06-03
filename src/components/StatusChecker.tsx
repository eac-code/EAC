/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Mail, 
  Hash, 
  HelpCircle, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  ArrowRight,
  ClipboardList
} from 'lucide-react';
import { PermitApplication, ApplicationStatus, PERMIT_TYPE_LABELS } from '../types';
import { motion } from 'motion/react';

interface StatusCheckerProps {
  applications: PermitApplication[];
}

export default function StatusChecker({ applications }: StatusCheckerProps) {
  // Search inputs
  const [refNumber, setRefNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  
  // Search results
  const [searched, setSearched] = useState(false);
  const [foundApp, setFoundApp] = useState<PermitApplication | null>(null);
  const [searchError, setSearchError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    setSearchError('');
    setFoundApp(null);

    const cleanRef = refNumber.trim().toUpperCase();
    const cleanEmail = emailAddress.trim().toLowerCase();

    if (!cleanRef || !cleanEmail) {
      setSearchError('Both Reference Number and Contact Email are required.');
      return;
    }

    // Match in applications list
    const match = applications.find(
      app => app.id.toUpperCase() === cleanRef && app.email.toLowerCase() === cleanEmail
    );

    if (match) {
      setFoundApp(match);
    } else {
      setSearchError('No application found matching the given reference number and email combination. Please verify your files and try again.');
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <div className="flex items-center space-x-2 bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Clock className="h-4 w-4 text-slate-500 animate-pulse" />
            <span>Under Review</span>
          </div>
        );
      case 'APPROVED':
        return (
          <div className="flex items-center space-x-2 bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>Officially Approved</span>
          </div>
        );
      case 'FLAGGED':
        return (
          <div className="flex items-center space-x-2 bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span>Flagged / Info Requested</span>
          </div>
        );
      case 'DENIED':
        return (
          <div className="flex items-center space-x-2 bg-rose-100 text-rose-800 border border-rose-300 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <XCircle className="h-4 w-4 text-rose-600" />
            <span>Application Denied</span>
          </div>
        );
    }
  };

  const getStatusCallout = (status: ApplicationStatus) => {
    switch (status) {
      case 'PENDING':
        return {
          title: 'Your application is under active review.',
          desc: 'Regulatory inspectors are currently checking files and site specifications. You will be formally contacted within 10 business days.',
          bgColor: 'bg-slate-50 border-slate-200'
        };
      case 'APPROVED':
        return {
          title: 'Permission Officially Granted.',
          desc: 'This certificate / permit is approved and active. You may download or print this state confirmation for site inspection purposes.',
          bgColor: 'bg-emerald-50 border-emerald-100'
        };
      case 'FLAGGED':
        return {
          title: 'Further Action Needed.',
          desc: 'Our review board has flagged this file for additional documentation or clarification. Please inspect the Board Directives note below.',
          bgColor: 'bg-amber-50 border-amber-100 animate-pulse'
        };
      case 'DENIED':
        return {
          title: 'Application Denied by Committee.',
          desc: 'This file has been rejected due to non-conformity with municipal bylaws or safety ordinances. Details are appended below.',
          bgColor: 'bg-rose-50 border-rose-100'
        };
    }
  };

  const clearQuery = () => {
    setRefNumber('');
    setEmailAddress('');
    setSearched(false);
    setFoundApp(null);
    setSearchError('');
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden" id="status-checker-container">
      {/* Header section */}
      <div className="bg-[#1e293b] text-white p-5 md:py-6 md:px-8 border-b border-slate-200 flex items-center space-x-3">
        <ClipboardList className="h-6 w-6 text-sky-400" />
        <div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight">Public Status Checker</h2>
          <p className="text-slate-400 text-xs">Acknowledge current filing stage, notes, or municipal decisions.</p>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* Verification Form */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end bg-slate-50/50 p-5 border border-slate-200 rounded-xl mb-6">
          <div className="space-y-1.5 md:col-span-1">
            <label htmlFor="search-refNumber" className="block text-xs font-bold tracking-wider text-slate-500 uppercase">
              Reference Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Hash className="h-4 w-4" />
              </span>
              <input
                type="text"
                id="search-refNumber"
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                placeholder="e.g. PRM-2026-11894"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-[#1e293b] transition-all uppercase"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5 md:col-span-1">
            <label htmlFor="search-emailAddress" className="block text-xs font-bold tracking-wider text-slate-500 uppercase">
              Contact Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                id="search-emailAddress"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="e.g. resident@gmail.com"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-[#1e293b] transition-all"
                required
              />
            </div>
          </div>

          <div className="flex gap-2.5">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center space-x-2 px-5 py-2.2 bg-[#1e293b] hover:bg-[#0f172a] text-white font-medium text-sm rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 transition-colors cursor-pointer"
            >
              <Search className="h-4.5 w-4.5" />
              <span>Query Database</span>
            </button>
            {searched && (
              <button
                type="button"
                onClick={clearQuery}
                className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-transparent hover:border-slate-300 transition-all cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Search Results Outlet */}
        <div id="search-outcome-region" aria-live="polite">
          {searchError && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-rose-50 border border-rose-200 rounded-lg flex items-start space-x-3 text-rose-800"
            >
              <XCircle className="h-5.5 w-5.5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Regulatory Record Not Found</h4>
                <p className="text-xs text-rose-700 leading-relaxed mt-1">{searchError}</p>
                <div className="mt-3 flex space-x-4">
                  <span className="text-[11px] font-semibold text-rose-600">Tip:</span>
                  <span className="text-[11px] text-rose-700 leading-tight">
                    Ensure the reference matches the exact template (e.g., <code className="font-mono bg-rose-100/60 px-1 py-0.5 rounded">PRM-2026-X</code>) and the email corresponds to the values provided on submit.
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {searched && foundApp && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-slate-200 rounded-xl overflow-hidden shadow-sm"
              id="status-found-display"
            >
              {/* Outcome Header Banner */}
              <div className="bg-slate-100/80 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold font-mono tracking-wide text-slate-800">{foundApp.id}</span>
                    <span className="text-xs text-slate-400">|</span>
                    <span className="text-xs text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm">
                      Filed: {foundApp.submissionDate}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Applicant: <span className="font-medium text-slate-700">{foundApp.fullName}</span> {foundApp.organization ? `(${foundApp.organization})` : ''}</p>
                </div>
                <div>
                  {getStatusBadge(foundApp.status)}
                </div>
              </div>

              {/* Status Explanation Card */}
              {(() => {
                const callout = getStatusCallout(foundApp.status);
                return (
                  <div className={`p-5 border-b border-slate-100 flex items-start space-x-3.5 ${callout.bgColor}`}>
                    {foundApp.status === 'APPROVED' && <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />}
                    {foundApp.status === 'PENDING' && <Clock className="h-6 w-6 text-slate-500 flex-shrink-0 mt-0.5" />}
                    {foundApp.status === 'FLAGGED' && <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />}
                    {foundApp.status === 'DENIED' && <XCircle className="h-6 w-6 text-rose-600 flex-shrink-0 mt-0.5" />}
                    
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm leading-snug">{callout.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1">{callout.desc}</p>
                    </div>
                  </div>
                );
              })()}

              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                {/* Submitted overview */}
                <div className="md:col-span-2 space-y-4">
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    <span>Application Manifest</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[11px] text-slate-400 block uppercase font-medium">Permit Type Requested</span>
                      <span className="font-semibold text-[#0f172a] block mt-0.5">
                        {PERMIT_TYPE_LABELS[foundApp.permitType]}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block uppercase font-medium">Site/Project Location</span>
                      <span className="font-medium text-slate-700 block mt-0.5">
                        {foundApp.projectAddress}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block uppercase font-medium">Scheduled Start Date</span>
                      <span className="font-semibold text-slate-700 block mt-0.5">
                        {foundApp.startDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block uppercase font-medium">Activity Duration</span>
                      <span className="font-medium text-slate-705 block mt-0.5">
                        {foundApp.estimatedDuration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Directives and Notes (Crucial context) */}
                <div className="md:col-span-1 bg-slate-50 rounded-xl p-4.5 border border-slate-200 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
                      Official Directives
                    </h4>
                    
                    {foundApp.status === 'DENIED' && foundApp.denialReason && (
                      <div className="bg-rose-100/50 border border-rose-200/80 rounded p-2.5">
                        <span className="text-[10px] font-bold text-rose-800 uppercase block mb-0.5">Formal Denial Reason</span>
                        <p className="text-xs text-rose-900 leading-relaxed font-semibold">{foundApp.denialReason}</p>
                      </div>
                    )}
                    
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Administrative Note / Review Note</span>
                      {foundApp.adminNotes ? (
                        <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-3 rounded border border-slate-200 whitespace-pre-line">
                          "{foundApp.adminNotes}"
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400 italic">
                          No supplemental directives notes have been linked to this file. Status remains under active committee review.
                        </p>
                      )}
                    </div>
                  </div>

                  {foundApp.updatedAt && (
                    <div className="mt-4 pt-3 border-t border-slate-200 text-right">
                      <span className="text-[10px] font-mono text-slate-400 block">Last Modification Date</span>
                      <span className="text-[10px] font-mono text-slate-500 font-semibold">{foundApp.updatedAt}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {!searched && (
            <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
                <HelpCircle className="h-6 w-6" />
              </div>
              <div className="max-w-xs">
                <p className="text-sm font-semibold text-slate-600">Awaiting Search Inputs</p>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">Authenticate using your reference and email above to check application status.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
