/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Building2, Lock, User, LogOut } from 'lucide-react';

interface HeaderProps {
  currentView: 'public' | 'admin';
  onViewChange: (view: 'public' | 'admin') => void;
  isAdminAuthenticated: boolean;
  onAdminLogout: () => void;
}

export default function Header({
  currentView,
  onViewChange,
  isAdminAuthenticated,
  onAdminLogout
}: HeaderProps) {
  return (
    <header className="bg-[#1e293b] text-white border-b-4 border-[#0f172a]" id="portal-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-5 gap-4">
          {/* Official Emblem & Portal Title */}
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-slate-700/80 rounded border border-slate-600 shadow-sm" aria-hidden="true">
              <Building2 className="h-7 w-7 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">Department of Regulatory Affairs</span>
                <span className="text-[10px] bg-sky-500/10 text-sky-300 border border-sky-500/25 px-1.5 py-0.5 rounded font-mono">INTAKE v2.4</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-tight">
                Municipal Permit & Licence Portal
              </h1>
            </div>
          </div>

          {/* Persona Switch / Controls */}
          <div className="flex items-center gap-2 self-start md:self-center">
            <nav className="flex bg-slate-800 rounded-lg p-1 border border-slate-700" aria-label="Portal section selector">
              <button
                id="btn-nav-public"
                onClick={() => onViewChange('public')}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  currentView === 'public'
                    ? 'bg-slate-700 text-white shadow-sm border border-slate-600/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/40'
                }`}
                aria-current={currentView === 'public' ? 'page' : undefined}
              >
                <User className="h-4 w-4" />
                <span>Public Portal</span>
              </button>

              <button
                id="btn-nav-admin"
                onClick={() => onViewChange('admin')}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  currentView === 'admin'
                    ? 'bg-sky-700 text-white shadow-sm border border-sky-600'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/40'
                }`}
                aria-current={currentView === 'admin' ? 'page' : undefined}
              >
                <Lock className="h-4 w-4" />
                <span>Staff Review Area</span>
              </button>
            </nav>

            {currentView === 'admin' && isAdminAuthenticated && (
              <button
                id="btn-admin-logout-header"
                onClick={onAdminLogout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg border border-transparent hover:border-slate-700 transition-colors"
                title="Log out of Staff Review Area"
                aria-label="Log out of Staff Review Area"
              >
                <LogOut className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Official banner stripe */}
      <div className="h-1.5 bg-gradient-to-r from-sky-500 via-slate-500 to-indigo-600" />
    </header>
  );
}
