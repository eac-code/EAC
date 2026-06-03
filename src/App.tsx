/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, startTransition } from 'react';
import Header from './components/Header';
import PublicForm from './components/PublicForm';
import StatusChecker from './components/StatusChecker';
import AdminPanel from './components/AdminPanel';
import { INITIAL_MOCK_APPLICATIONS } from './utils/mockData';
import { PermitApplication } from './types';
import { 
  Building, 
  FileText, 
  ClipboardCheck, 
  ShieldCheck, 
  Scale, 
  Info,
  Calendar,
  Layers,
  ArrowRight,
  FilePlus,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Global React State for Applications Portfolio
  const [applications, setApplications] = useState<PermitApplication[]>([]);
  
  // High-level Section Views: 'public' | 'admin'
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');

  // Public Sub-views: 'submit' | 'status'
  const [publicTab, setPublicTab] = useState<'submit' | 'status'>('submit');

  // Handle local storage synchronization on initial render
  useEffect(() => {
    const existing = localStorage.getItem('civic_applications_db');
    if (existing) {
      try {
        setApplications(JSON.parse(existing));
      } catch (e) {
        // Fallback to mock data if parse fails
        setApplications(INITIAL_MOCK_APPLICATIONS);
        localStorage.setItem('civic_applications_db', JSON.stringify(INITIAL_MOCK_APPLICATIONS));
      }
    } else {
      // Seed default applications to local storage
      setApplications(INITIAL_MOCK_APPLICATIONS);
      localStorage.setItem('civic_applications_db', JSON.stringify(INITIAL_MOCK_APPLICATIONS));
    }
  }, []);

  // Update localStorage and State when an application is added
  const handleAddNewApplication = (newApp: PermitApplication) => {
    setApplications(prev => {
      const updated = [newApp, ...prev];
      localStorage.setItem('civic_applications_db', JSON.stringify(updated));
      return updated;
    });
  };

  // Update localStorage and State when admin updates status or notes
  const handleUpdateApplication = (updatedApp: PermitApplication) => {
    setApplications(prev => {
      const updated = prev.map(app => app.id === updatedApp.id ? updatedApp : app);
      localStorage.setItem('civic_applications_db', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAdminLogout = () => {
    // Dispatch logout inside administrative child component
    // but we support a general fallback to public view
    startTransition(() => {
      setCurrentView('public');
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col selection:bg-slate-300 selection:text-slate-900" id="portal-root">
      
      {/* 1. Government-Neutral Header */}
      <Header 
        currentView={currentView}
        onViewChange={(view) => startTransition(() => setCurrentView(view))}
        isAdminAuthenticated={localStorage.getItem('civic_admin_auth') === 'true'}
        onAdminLogout={handleAdminLogout}
      />

      {/* 2. Main content container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dynamic Outlet based on state */}
        <AnimatePresence mode="wait">
          {currentView === 'public' ? (
            
            // Public Facing Experience
            <motion.div
              key="public-portal-container"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Civic Hero / Notice */}
              <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-4">
                  <div className="inline-flex items-center space-x-2 bg-slate-100 text-[#1e293b] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-slate-200">
                    <Compass className="h-3.5 w-3.5" />
                    <span>Official Public Intake</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                    Regulatory Authorisations, Permits & Licenses
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
                    Submit construction plans, request noise variances, file business licencing records, or arrange community event permits under city charter guidelines. Standard filing reviews take up to <strong>10 business days</strong>.
                  </p>
                  
                  {/* Public sub-navigation buttons */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      id="btn-tab-submit"
                      onClick={() => setPublicTab('submit')}
                      className={`flex items-center space-x-2 px-5 py-2.5 text-xs uppercase font-extrabold tracking-wider rounded-lg border transition-all cursor-pointer ${
                        publicTab === 'submit'
                          ? 'bg-[#1e293b] text-white border-[#1e293b] shadow-sm'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                      }`}
                      aria-current={publicTab === 'submit' ? 'true' : undefined}
                    >
                      <FilePlus className="h-4 w-4" />
                      <span>1. Submit New Application</span>
                    </button>

                    <button
                      id="btn-tab-status"
                      onClick={() => setPublicTab('status')}
                      className={`flex items-center space-x-2 px-5 py-2.5 text-xs uppercase font-extrabold tracking-wider rounded-lg border transition-all cursor-pointer ${
                        publicTab === 'status'
                          ? 'bg-[#1e293b] text-white border-[#1e293b] shadow-sm'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                      }`}
                      aria-current={publicTab === 'status' ? 'true' : undefined}
                    >
                      <ClipboardCheck className="h-4 w-4" />
                      <span>2. Query Application Status</span>
                    </button>
                  </div>
                </div>

                <div className="md:col-span-4 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 self-stretch flex flex-col justify-center">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                    <Info className="h-4 w-4 text-[#1e293b]" />
                    <span>Ingress Directives</span>
                  </h3>
                  <ul className="space-y-2.5 text-xs leading-relaxed text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold" aria-hidden="true">✓</span>
                      <span>Description word counts are strict: <strong>100 to 500</strong> written words limit.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold" aria-hidden="true">✓</span>
                      <span>Target start date must be placed at least <strong>14 days in the future</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold" aria-hidden="true">✓</span>
                      <span>Retain reference receipt string (e.g. <code className="font-mono bg-slate-200 px-1 py-0.2 select-all rounded text-slate-800 font-bold">PRM-YYYY-XXXXX</code>) to poll status.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Public Views Sub Outlet */}
              <AnimatePresence mode="wait">
                {publicTab === 'submit' ? (
                  <motion.div
                    key="tab-submit"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PublicForm onSubmitSuccess={handleAddNewApplication} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="tab-status"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <StatusChecker applications={applications} />
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>

          ) : (

            // Staff Administrator Experience
            <motion.div
              key="admin-workspace-container"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <AdminPanel 
                applications={applications} 
                onUpdateApplication={handleUpdateApplication} 
              />
            </motion.div>

          )}
        </AnimatePresence>

      </main>

      {/* 3. Official Municipal Footer */}
      <footer className="bg-slate-900 border-t-8 border-slate-950 text-slate-400 py-8 text-xs font-mono" id="portal-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:flex md:justify-between md:items-center space-y-4 md:space-y-0">
          <div className="space-y-1 md:text-left">
            <p className="text-slate-300 font-bold text-sm tracking-wide">Board of Regulatory Compliance & Zoning</p>
            <p className="text-slate-500">Official Municipal Portal &bull; State Charter Intakes Division</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-[10px] text-slate-500">
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Security Protocol TLS 1.3</span>
            <span>&bull;</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Bylaw Ordinance compliance</span>
            <span>&bull;</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Section 508 Accessibility Compliant</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
