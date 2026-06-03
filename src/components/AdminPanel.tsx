/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Lock, 
  Search, 
  ArrowUpDown, 
  Filter, 
  Check, 
  AlertTriangle, 
  X, 
  FileText, 
  Clock, 
  ChevronRight, 
  CornerDownRight, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Hash,
  Briefcase
} from 'lucide-react';
import { 
  PermitApplication, 
  ApplicationStatus, 
  PERMIT_TYPE_LABELS, 
  PRESET_DENIAL_REASONS, 
  PermitType 
} from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface AdminPanelProps {
  applications: PermitApplication[];
  onUpdateApplication: (updatedApp: PermitApplication) => void;
}

export default function AdminPanel({ applications, onUpdateApplication }: AdminPanelProps) {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('civic_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard Filters & Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'id' | 'fullName' | 'submissionDate' | 'status'>('submissionDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Detail View Selected application
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  // Administrative Notes state (for selected app)
  const [adminNotesLocal, setAdminNotesLocal] = useState('');
  
  // Denial-specific action state
  const [isDenyInitiated, setIsDenyInitiated] = useState(false);
  const [selectedDenialReason, setSelectedDenialReason] = useState(PRESET_DENIAL_REASONS[0]);

  // Handle password login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin2024') {
      setIsAuthenticated(true);
      setLoginError('');
      setPasswordInput('');
      localStorage.setItem('civic_admin_auth', 'true');
    } else {
      setLoginError('Invalid administrator credentials. Access Rejected.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('civic_admin_auth');
    setSelectedAppId(null);
  };

  // Find currently selected application
  const selectedApp = useMemo(() => {
    return applications.find(app => app.id === selectedAppId) || null;
  }, [applications, selectedAppId]);

  // Select an application for review
  const handleSelectApp = (app: PermitApplication) => {
    setSelectedAppId(app.id);
    setAdminNotesLocal(app.adminNotes || '');
    setIsDenyInitiated(false);
    
    // Auto-scroll to detail container for dynamic responsive views
    setTimeout(() => {
      const detailsEl = document.getElementById('details-anchor-panel');
      if (detailsEl) {
        detailsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // Process Administrative Updates (Approve, Flag, Deny)
  const handleStatusChange = (newStatus: ApplicationStatus, reason?: string) => {
    if (!selectedApp) return;

    const timestamp = new Date();
    const formattedDate = timestamp.toISOString().slice(0, 10) + ' ' + 
      String(timestamp.getHours()).padStart(2, '0') + ':' + 
      String(timestamp.getMinutes()).padStart(2, '0');

    const updatedApp: PermitApplication = {
      ...selectedApp,
      status: newStatus,
      adminNotes: adminNotesLocal.trim(),
      updatedAt: formattedDate,
      denialReason: newStatus === 'DENIED' ? (reason || selectedDenialReason) : undefined
    };

    onUpdateApplication(updatedApp);
    setIsDenyInitiated(false);
  };

  // Toggle sorting
  const handleSort = (field: 'id' | 'fullName' | 'submissionDate' | 'status') => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter & Search computation
  const filteredAndSortedApplications = useMemo(() => {
    return applications
      .filter(app => {
        // Query Search (reference, applicant, email, organization)
        const q = searchTerm.toLowerCase();
        const matchesQuery = 
          app.id.toLowerCase().includes(q) ||
          app.fullName.toLowerCase().includes(q) ||
          app.email.toLowerCase().includes(q) ||
          (app.organization && app.organization.toLowerCase().includes(q));

        // Status Filter
        const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;

        // Permit Type Filter
        const matchesType = typeFilter === 'ALL' || app.permitType === typeFilter;

        return matchesQuery && matchesStatus && matchesType;
      })
      .sort((a, b) => {
        let fieldA = a[sortField];
        let fieldB = b[sortField];

        // Ensure string values are compared properly
        fieldA = typeof fieldA === 'string' ? fieldA.toLowerCase() : fieldA;
        fieldB = typeof fieldB === 'string' ? fieldB.toLowerCase() : fieldB;

        if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [applications, searchTerm, statusFilter, typeFilter, sortField, sortDirection]);

  // Aggregate stats
  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter(a => a.status === 'PENDING').length;
    const approved = applications.filter(a => a.status === 'APPROVED').length;
    const flagged = applications.filter(a => a.status === 'FLAGGED').length;
    const denied = applications.filter(a => a.status === 'DENIED').length;
    return { total, pending, approved, flagged, denied };
  }, [applications]);

  // Login Gate View
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden" id="login-gate-view">
        <div className="bg-[#1e293b] text-white p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-slate-700 mb-3 border border-slate-600 shadow-sm" aria-hidden="true">
            <Lock className="h-5 w-5 text-sky-400" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Staff Review Portal Secure Gate</h2>
          <p className="text-slate-400 text-xs mt-1">Authorized municipal personnel authentication required.</p>
        </div>

        <form onSubmit={handleLogin} className="p-6 md:p-8 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="gate-password" className="block text-sm font-semibold text-slate-700">
              Department Passcode
            </label>
            <input
              type="password"
              id="gate-password"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                if (loginError) setLoginError('');
              }}
              placeholder="Enter administrative credentials"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-[#1e293b] font-mono tracking-widest text-center"
              required
            />
          </div>

          {loginError && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded flex items-center space-x-1.5" role="alert">
              <span>⚠️</span>
              <span className="font-medium">{loginError}</span>
            </p>
          )}

          <div className="pt-2 bg-slate-50 p-3 rounded-lg border border-slate-200/60 mb-2">
            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block mb-0.5">Prototype Note:</span>
            <span className="text-slate-600 text-xs">Standard simulation password is <code className="font-mono bg-slate-200 px-1 rounded text-slate-800 font-bold">admin2024</code></span>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#1e293b] hover:bg-[#0f172a] text-white font-semibold text-sm rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 transition-colors cursor-pointer"
          >
            Authenticate Credentials
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="admin-workspace-view">
      {/* 1. Header & Stats Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Staff Review Workspace</span>
            <span className="text-xs font-mono font-normal bg-sky-50 text-sky-700 border border-sky-300 px-2 py-0.5 rounded">AUTHENTICATED STAFF</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Review submitted public intake applications, insert official comments, and dispatch outcome states to citizens.</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-1.8 bg-white text-slate-600 hover:text-red-600 border border-slate-300 hover:border-red-300 rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
        >
          <span>Deauthorize (Logout)</span>
        </button>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5" aria-label="Review portfolio quick statistics">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Filed</span>
          <span className="text-2xl font-bold text-slate-800 font-mono mt-0.5 block">{stats.total}</span>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Pending Review</span>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <span className="text-2xl font-bold text-[#0f172a] font-mono">{stats.pending}</span>
            <span className="text-xs text-slate-400">({Math.round(stats.total ? (stats.pending / stats.total) * 100 : 0)}%)</span>
          </div>
          <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-slate-400 animate-pulse" />
        </div>
        <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 shadow-sm relative overflow-hidden">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Approved Cards</span>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <span className="text-2xl font-bold text-emerald-800 font-mono">{stats.approved}</span>
            <span className="text-xs text-emerald-600/70">({Math.round(stats.total ? (stats.approved / stats.total) * 100 : 0)}%)</span>
          </div>
          <div className="absolute top-2 right-2 flex items-center justify-center h-4 w-4 bg-emerald-500 rounded-full text-[9px] text-white font-bold">✓</div>
        </div>
        <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 shadow-sm relative overflow-hidden">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">Flagged / Waiting</span>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <span className="text-2xl font-bold text-amber-800 font-mono">{stats.flagged}</span>
            <span className="text-xs text-amber-600/70">({Math.round(stats.total ? (stats.flagged / stats.total) * 100 : 0)}%)</span>
          </div>
          <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-amber-400 animate-ping" />
        </div>
        <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-200 shadow-sm relative overflow-hidden">
          <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block">Denied Cases</span>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <span className="text-2xl font-bold text-rose-800 font-mono">{stats.denied}</span>
            <span className="text-xs text-rose-600/70">({Math.round(stats.total ? (stats.denied / stats.total) * 100 : 0)}%)</span>
          </div>
          <div className="absolute top-2 right-2 flex items-center justify-center h-4 w-4 bg-rose-500 rounded-full text-[9px] text-white font-bold font-mono">X</div>
        </div>
      </div>

      {/* 2. Interactive Work Table & Review Panel Split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Table Workspace (8 Columns of grid) */}
        <div className="xl:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Table Header Filter controls */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400" aria-hidden="true">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, name, email or org..."
                className="w-full pl-9 pr-3 py-1.8 shadow-inner border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-500 transition-all"
                aria-label="Search applications"
              />
            </div>

            {/* Quick Status Filters */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wide uppercase text-slate-400 flex items-center gap-1">
                <Filter className="h-3 w-3" />
                <span>Status:</span>
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2 py-1 bg-white border border-slate-300 rounded text-xs focus:outline-none cursor-pointer"
                aria-label="Filter by application status"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="FLAGGED">Flagged</option>
                <option value="DENIED">Denied</option>
              </select>
            </div>

            {/* Quick Type Filters */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wide uppercase text-slate-400">Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-2 py-1 bg-white border border-slate-300 rounded text-xs focus:outline-none cursor-pointer"
                aria-label="Filter by permit type"
              >
                <option value="ALL">All Types</option>
                {Object.entries(PERMIT_TYPE_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table proper */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" id="admin-interactive-applications-table">
              <thead>
                <tr className="bg-slate-100 text-slate-500 select-none text-[10px] uppercase font-bold tracking-wider border-b border-slate-200">
                  <th 
                    onClick={() => handleSort('id')}
                    className="p-3 cursor-pointer hover:bg-slate-200 transition-colors font-mono"
                    role="columnheader"
                    aria-sort={sortField === 'id' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSort('id'); }}
                  >
                    <div className="flex items-center space-x-1.5">
                      <span>Ref ID</span>
                      <ArrowUpDown className="h-3 w-3 text-slate-400" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('fullName')}
                    className="p-3 cursor-pointer hover:bg-slate-200 transition-colors"
                    role="columnheader"
                    aria-sort={sortField === 'fullName' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSort('fullName'); }}
                  >
                    <div className="flex items-center space-x-1.5">
                      <span>Applicant / Legal Identity</span>
                      <ArrowUpDown className="h-3 w-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="p-3">Permit Category</th>
                  <th 
                    onClick={() => handleSort('submissionDate')}
                    className="p-3 cursor-pointer hover:bg-slate-200 transition-colors"
                    role="columnheader"
                    aria-sort={sortField === 'submissionDate' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSort('submissionDate'); }}
                  >
                    <div className="flex items-center space-x-1.5">
                      <span>Submitted Date</span>
                      <ArrowUpDown className="h-3 w-3 text-slate-400" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('status')}
                    className="p-3 cursor-pointer hover:bg-slate-200 transition-colors"
                    role="columnheader"
                    aria-sort={sortField === 'status' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSort('status'); }}
                  >
                    <div className="flex items-center space-x-1.5">
                      <span>Status Badge</span>
                      <ArrowUpDown className="h-3 w-3 text-slate-400" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {filteredAndSortedApplications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 text-xs italic">
                      No applications currently match the search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedApplications.map((app) => {
                    const isSelected = app.id === selectedAppId;
                    return (
                      <tr
                        key={app.id}
                        onClick={() => handleSelectApp(app)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleSelectApp(app);
                          }
                        }}
                        tabIndex={0}
                        aria-label={`Filing ${app.id} submitted on ${app.submissionDate} by ${app.fullName}. Double tap or press enter to open for administrative review.`}
                        className={`hover:bg-slate-50/80 transition-colors cursor-pointer outline-none focus:bg-slate-50 relative ${
                          isSelected ? 'bg-sky-50 shadow-inner' : ''
                        }`}
                      >
                        {/* Selector indicator */}
                        {isSelected && (
                          <td className="absolute left-0 top-0 bottom-0 w-1 bg-sky-700" aria-hidden="true" />
                        )}

                        {/* Reference identifier */}
                        <td className="p-3 font-mono font-bold text-slate-800 tracking-tight">
                          {app.id}
                        </td>

                        {/* Full name + organization */}
                        <td className="p-3">
                          <div className="font-semibold text-slate-800 leading-normal">{app.fullName}</div>
                          {app.organization && (
                            <div className="text-[10px] text-slate-400 select-all font-mono">{app.organization}</div>
                          )}
                        </td>

                        {/* Category badge */}
                        <td className="p-3 text-[10px] font-semibold text-slate-500">
                          {PERMIT_TYPE_LABELS[app.permitType]}
                        </td>

                        {/* Submission coordinates */}
                        <td className="p-3 text-slate-500 font-mono text-[11px]">
                          {app.submissionDate}
                        </td>

                        {/* Core outcomes badge */}
                        <td className="p-3">
                          {(() => {
                            switch (app.status) {
                              case 'PENDING':
                                return (
                                  <span className="inline-flex items-center space-x-1 bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.5 rounded-full text-[10px] font-medium font-mono uppercase">
                                    <span className="h-1.5 w-1.5 rounded-full bg-slate-500 flex-shrink-0 animate-pulse" />
                                    <span>PENDING</span>
                                  </span>
                                );
                              case 'APPROVED':
                                return (
                                  <span className="inline-flex items-center space-x-1 bg-green-100 text-green-800 border border-green-300 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                                    <span>APPROVED</span>
                                  </span>
                                );
                              case 'FLAGGED':
                                return (
                                  <span className="inline-flex items-center space-x-1 bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase">
                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                                    <span>FLAGGED</span>
                                  </span>
                                );
                              case 'DENIED':
                                return (
                                  <span className="inline-flex items-center space-x-1 bg-red-100 text-red-800 border border-red-300 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase">
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0" />
                                    <span>DENIED</span>
                                  </span>
                                );
                            }
                          })()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Portfolio Total: {filteredAndSortedApplications.length} cases shown</span>
            <span className="italic">Click any Row to open review detail pane</span>
          </div>
        </div>

        {/* Action Detail Workspace Drawer (5 Columns of grid) */}
        <div id="details-anchor-panel" className="xl:col-span-5">
          <AnimatePresence mode="wait">
            {selectedApp ? (
              <motion.div
                key={selectedApp.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="bg-white border-2 border-slate-300 rounded-xl shadow-lg relative overflow-hidden"
              >
                {/* Visual state headers */}
                {selectedApp.status === 'APPROVED' && <div className="h-2 bg-emerald-500" />}
                {selectedApp.status === 'FLAGGED' && <div className="h-2 bg-amber-500 animate-pulse" />}
                {selectedApp.status === 'DENIED' && <div className="h-2 bg-rose-500" />}
                {selectedApp.status === 'PENDING' && <div className="h-2 bg-slate-500" />}

                {/* Header panel */}
                <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-slate-600" />
                    <div>
                      <h3 className="font-bold text-slate-800 font-mono text-base">{selectedApp.id}</h3>
                      <p className="text-[10px] text-slate-400">File Ingress Date: {selectedApp.submissionDate}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAppId(null)}
                    className="p-1 rounded-sm text-slate-400 hover:text-slate-800 hover:bg-slate-200/50"
                    title="Close detail panel"
                    aria-label="Close detail view"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Detail Information Sheet */}
                <div className="p-5 space-y-5 max-h-[580px] overflow-y-auto custom-scrollbar text-xs">
                  {/* Status Indicator banner */}
                  <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-slate-400">CURRENT STATUS:</span>
                    <span className={`text-[10px] font-bold font-mono border px-2.5 py-0.5 rounded-full uppercase ${
                      selectedApp.status === 'APPROVED' ? 'bg-green-100 text-green-800 border-green-300' :
                      selectedApp.status === 'FLAGGED' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                      selectedApp.status === 'DENIED' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                      'bg-slate-100 text-slate-700 border-slate-300'
                    }`}>
                      {selectedApp.status === 'PENDING' ? 'UNDER COMMITTEE REVIEW' : selectedApp.status}
                    </span>
                  </div>

                  {/* Section: Applicant Identity details */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-[10px] uppercase text-slate-400 border-b border-slate-100 pb-1 flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      <span>Applicant Account details</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-3 leading-normal">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block font-medium">Applicant Name</span>
                        <span className="font-semibold text-slate-800">{selectedApp.fullName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block font-medium">Organization / Org</span>
                        <span className="font-medium text-slate-700">{selectedApp.organization || 'Non-incorporated / Individual'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block font-medium flex items-center gap-1">
                          <Mail className="h-3 w-3 inline" />
                          <span>Contact Email</span>
                        </span>
                        <a href={`mailto:${selectedApp.email}`} className="text-sky-700 hover:underline font-mono select-all">
                          {selectedApp.email}
                        </a>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block font-medium flex items-center gap-1">
                          <Phone className="h-3 w-3 inline" />
                          <span>Phone Number</span>
                        </span>
                        <span className="font-mono text-slate-700 select-all">{selectedApp.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Section: Permit Location specs */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-[10px] uppercase text-slate-400 border-b border-slate-100 pb-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>Regulatory Location & Logistics</span>
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block">Filing Category</span>
                        <span className="font-semibold text-slate-800 bg-slate-200/50 px-2 py-0.5 border border-slate-300 rounded inline-block text-[10px]">
                          {PERMIT_TYPE_LABELS[selectedApp.permitType]}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block">Project Site Address</span>
                        <span className="font-medium text-slate-800 bg-slate-50 px-2 py-1.5 rounded border border-slate-200 block">
                          {selectedApp.projectAddress}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3.5">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase block flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Scheduled Start Date</span>
                          </span>
                          <span className="font-bold text-slate-800">{selectedApp.startDate}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase block">Project Duration</span>
                          <span className="font-medium text-slate-700">{selectedApp.estimatedDuration}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section: Written Description statement */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-[10px] uppercase text-slate-400 border-b border-slate-100 pb-1">
                      Detailed Activity Description
                    </h4>
                    <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 leading-relaxed text-slate-750 font-sans whitespace-pre-wrap shadow-inner text-xs">
                      {selectedApp.description}
                    </div>
                  </div>

                  {/* Validation confirmation attestation */}
                  <div className="text-[11px] text-slate-500 bg-emerald-50/40 p-2.5 rounded border border-emerald-100 flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold" aria-hidden="true">✓</span>
                    <div>
                      <span className="font-semibold text-slate-700">Information Attestation Confirmed:</span> Applicant checked the official legal accuracy declaration on submission.
                    </div>
                  </div>

                  {/* Section: REJECTION DETAILS IF KNOWN */}
                  {selectedApp.status === 'DENIED' && selectedApp.denialReason && (
                    <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-lg space-y-1">
                      <span className="text-[10px] font-bold text-rose-800 uppercase block">Committee Denial Reason</span>
                      <p className="font-bold text-rose-900 leading-normal text-xs">{selectedApp.denialReason}</p>
                    </div>
                  )}

                  {/* Section: Note creation area */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <label htmlFor="admin-notes-textarea" className="block text-[11px] font-bold text-slate-600 uppercase">
                      Administrative Review Comments & Directives
                    </label>
                    <textarea
                      id="admin-notes-textarea"
                      value={adminNotesLocal}
                      onChange={(e) => setAdminNotesLocal(e.target.value)}
                      placeholder="Insert supplementary information requests, health-inspections clearances, or detailed reasoning. Visible to the public applicant on status query."
                      rows={4}
                      className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50/50 focus:bg-white focus:ring-1 focus:ring-slate-400 focus:outline-none focus:border-slate-500 transition-all text-xs"
                    ></textarea>
                  </div>
                </div>

                {/* Decision Panel (Approve, Flag, Deny Buttons) */}
                <div className="bg-slate-100 p-4 border-t border-slate-200 space-y-4">
                  
                  {!isDenyInitiated ? (
                    <div className="grid grid-cols-3 gap-2.5">
                      {/* Approved Button */}
                      <button
                        onClick={() => handleStatusChange('APPROVED')}
                        className="flex flex-col items-center justify-center p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition-colors text-[11px] uppercase tracking-wider gap-1.5 cursor-pointer"
                        title="Mark application as officially Approved"
                      >
                        <CheckCircle className="h-4.5 w-4.5" />
                        <span>Approve</span>
                      </button>

                      {/* Flagged Button */}
                      <button
                        onClick={() => handleStatusChange('FLAGGED')}
                        className="flex flex-col items-center justify-center p-2.5 bg-amber-500 hover:bg-amber-600 text-[#0f172a] font-semibold rounded-lg shadow-sm transition-colors text-[11px] uppercase tracking-wider gap-1.5 cursor-pointer"
                        title="Mark application as Flagged (requires edits / more info)"
                      >
                        <AlertTriangle className="h-4.5 w-4.5" />
                        <span>Flag Case</span>
                      </button>

                      {/* Deny Trigger Button */}
                      <button
                        onClick={() => setIsDenyInitiated(true)}
                        className="flex flex-col items-center justify-center p-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-sm transition-colors text-[11px] uppercase tracking-wider gap-1.5 cursor-pointer"
                        title="Decline application under ordinance parameters"
                      >
                        <XCircle className="h-4.5 w-4.5" />
                        <span>Deny Case</span>
                      </button>
                    </div>
                  ) : (
                    // Sub-panel for Denial selection details
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-3.5 rounded-lg border border-rose-300 space-y-3"
                    >
                      <div>
                        <label htmlFor="denial-bylaw-dropdown" className="block text-[10px] font-bold uppercase text-rose-800 mb-1.5">
                          Select Bylaw / Ordinance Rejection Code 
                        </label>
                        <select
                          id="denial-bylaw-dropdown"
                          value={selectedDenialReason}
                          onChange={(e) => setSelectedDenialReason(e.target.value)}
                          className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded focus:outline-none cursor-pointer"
                        >
                          {PRESET_DENIAL_REASONS.map((reason, idx) => (
                            <option key={idx} value={reason}>
                              {reason}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setIsDenyInitiated(false)}
                          className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 border border-transparent hover:border-slate-300 rounded cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange('DENIED')}
                          className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded shadow-sm cursor-pointer"
                        >
                          Confirm Application Denial
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300 py-16 px-6 text-center text-slate-400 flex flex-col items-center justify-center space-y-3.5 h-[500px]">
                <div className="h-12 w-12 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-400 shadow-sm">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="max-w-xs">
                  <h3 className="text-sm font-semibold text-slate-600">Awaiting File Selection</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">Select an active permit row from the workspace table to load full details, notes, and regulatory actions.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
