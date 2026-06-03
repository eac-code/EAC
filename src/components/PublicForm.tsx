/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useTransition } from 'react';
import { 
  FileText, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Copy, 
  Check, 
  CheckCircle2, 
  ArrowRight,
  Printer
} from 'lucide-react';
import { PermitType, PERMIT_TYPE_LABELS, PermitApplication } from '../types';
import { validateForm, getWordCount, generateReferenceNumber, ValidationError } from '../utils/helpers';
import { motion, AnimatePresence } from 'motion/react';

interface PublicFormProps {
  onSubmitSuccess: (application: PermitApplication) => void;
}

export default function PublicForm({ onSubmitSuccess }: PublicFormProps) {
  // Input fields state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [permitType, setPermitType] = useState<PermitType>('construction_permit');
  const [projectAddress, setProjectAddress] = useState('');
  const [startDate, setStartDate] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [description, setDescription] = useState('');
  const [declarationTicked, setDeclarationTicked] = useState(false);

  // Validation / interaction state
  const [validationErrors, setValidationErrors] = useState<ValidationError>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedApp, setGeneratedApp] = useState<PermitApplication | null>(null);
  const [copied, setCopied] = useState(false);

  // Transition for smooth load states
  const [, startTransition] = useTransition();

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    
    // Clear validation error on type if any
    if (validationErrors.description) {
      setValidationErrors(prev => ({ ...prev, description: undefined }));
    }
  };

  const handleFieldChange = (
    setter: React.Dispatch<React.SetStateAction<any>>,
    field: keyof ValidationError
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : e.target.value;
    
    setter(value);

    // Clear field-specific error as user types
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const currentWordCount = getWordCount(description);
  const isWordCountValid = currentWordCount >= 100 && currentWordCount <= 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = {
      fullName,
      email,
      phone,
      projectAddress,
      startDate,
      estimatedDuration,
      description,
      declarationTicked
    };

    const result = validateForm(formData);

    if (!result.isValid) {
      setValidationErrors(result.errors);
      setIsSubmitting(false);
      
      // Scroll to first error for accessibility
      const firstErrorKey = Object.keys(result.errors)[0];
      const errorElement = document.getElementById(`field-${firstErrorKey}`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
      return;
    }

    // Success! Formulate unique application packet
    const appRef = generateReferenceNumber();
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10) + ' ' + 
      String(currentDate.getHours()).padStart(2, '0') + ':' + 
      String(currentDate.getMinutes()).padStart(2, '0');

    const newApplication: PermitApplication = {
      id: appRef,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      organization: organization.trim() || undefined,
      permitType,
      projectAddress: projectAddress.trim(),
      startDate,
      estimatedDuration: estimatedDuration.trim(),
      description: description.trim(),
      declarationTicked,
      submissionDate: formattedDate,
      status: 'PENDING',
      adminNotes: ''
    };

    // Simulate saving delay for polished official feel
    setTimeout(() => {
      startTransition(() => {
        onSubmitSuccess(newApplication);
        setGeneratedApp(newApplication);
        setHasSubmitted(true);
        setIsSubmitting(false);
      });
    }, 750);
  };

  const handleCopyRef = () => {
    if (generatedApp) {
      navigator.clipboard.writeText(generatedApp.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setOrganization('');
    setPermitType('construction_permit');
    setProjectAddress('');
    setStartDate('');
    setEstimatedDuration('');
    setDescription('');
    setDeclarationTicked(false);
    setValidationErrors({});
    setHasSubmitted(false);
    setGeneratedApp(null);
  };

  // Status indicator colors for description word counter
  const getWordCountColor = () => {
    if (currentWordCount === 0) return 'text-slate-400';
    if (currentWordCount < 100) return 'text-amber-600 font-medium';
    if (currentWordCount <= 500) return 'text-emerald-600 font-semibold';
    return 'text-red-600 font-bold';
  };

  if (hasSubmitted && generatedApp) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden"
        id="submission-success-view"
      >
        <div className="bg-[#1e293b] text-white p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-400 mb-4 border border-emerald-500/30">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Application Submitted Successfully</h2>
          <p className="text-slate-300 text-sm mt-1">Municipal Regulatory File Issued</p>
        </div>

        <div className="p-6 md:p-8 max-w-2xl mx-auto text-center" aria-live="polite">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-6 mb-8 text-center shadow-inner">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block mb-2">Unique Reference Number</span>
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl md:text-3xl font-mono font-bold text-[#0f172a] select-all bg-white px-4 py-2 rounded shadow-sm border border-slate-200 tracking-wider">
                {generatedApp.id}
              </span>
              <button
                onClick={handleCopyRef}
                className="p-2.5 bg-white text-slate-600 hover:text-sky-600 hover:bg-sky-50 border border-slate-200 rounded-lg shadow-sm font-medium transition-all"
                title="Copy reference number to clipboard"
                aria-label="Copy reference number"
              >
                {copied ? <Check className="h-5 w-5 text-emerald-600" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
            
            <p className="text-slate-600 text-sm mt-4 font-medium italic">
              "Your application is under review. You will be contacted within 10 business days."
            </p>
          </div>

          {/* Submitted Summary Details */}
          <div className="text-left bg-slate-50 rounded-lg p-5 border border-slate-200 text-sm mb-8 space-y-3.5">
            <h3 className="font-semibold text-slate-700 border-b border-slate-200 pb-2 flex items-center justify-between">
              <span>Receipt Transmittal Info</span>
              <span className="text-xs font-mono font-normal text-slate-500">{generatedApp.submissionDate}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <span className="text-xs text-slate-400 block uppercase">Applicant Legal Name</span>
                <span className="text-slate-700 font-medium">{generatedApp.fullName}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block uppercase">Contact Email</span>
                <span className="text-slate-700 font-medium">{generatedApp.email}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block uppercase">Phone Number</span>
                <span className="text-slate-700 font-medium">{generatedApp.phone}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block uppercase">Permit / License Type</span>
                <span className="text-slate-700 font-medium bg-slate-200/70 border border-slate-300 px-2 py-0.5 rounded text-xs inline-block">
                  {PERMIT_TYPE_LABELS[generatedApp.permitType]}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-xs text-slate-400 block uppercase">Site Address</span>
                <span className="text-slate-700 font-medium">{generatedApp.projectAddress}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg border border-slate-300 transition-colors cursor-pointer"
            >
              <Printer className="h-4.5 w-4.5" />
              <span>Print Confirmation Receipt</span>
            </button>
            <button
              onClick={resetForm}
              className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-[#1e293b] hover:bg-[#0f172a] text-white font-medium rounded-lg shadow transition-colors cursor-pointer"
            >
              <span>Submit New Application</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden" id="applicant-intake-form-container">
      {/* Form Headers */}
      <div className="bg-[#1e293b] text-white p-5 md:py-6 md:px-8 flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <FileText className="h-6 w-6 text-sky-400" />
          <div>
            <h2 className="text-lg md:text-xl font-bold tracking-tight">Public Application Form</h2>
            <p className="text-slate-400 text-xs">Fill out all fields below to initiate regulatory review.</p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-[10px] bg-slate-700 px-2 py-1 rounded text-slate-300 font-mono">FORM: REG-W4</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6" noValidate>
        {/* Section 1: Contact details */}
        <div>
          <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-4 border-b border-slate-100 pb-1.5">
            1. Applicant Legal & Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full legal name */}
            <div className="space-y-1.5">
              <label htmlFor="field-fullName" className="block text-sm font-semibold text-slate-700">
                Full Legal Name <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  id="field-fullName"
                  name="fullName"
                  value={fullName}
                  onChange={handleFieldChange(setFullName, 'fullName')}
                  aria-required="true"
                  aria-invalid={!!validationErrors.fullName}
                  className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    validationErrors.fullName 
                      ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500' 
                      : 'border-slate-300 focus:ring-slate-200 focus:border-[#1e293b]'
                  }`}
                  placeholder="e.g. Jane Mary Doe"
                />
              </div>
              {validationErrors.fullName && (
                <p className="text-xs text-rose-600 flex items-center space-x-1 mt-1" role="alert">
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{validationErrors.fullName}</span>
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="field-email" className="block text-sm font-semibold text-slate-700">
                Contact Email Address <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  id="field-email"
                  name="email"
                  value={email}
                  onChange={handleFieldChange(setEmail, 'email')}
                  aria-required="true"
                  aria-invalid={!!validationErrors.email}
                  className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    validationErrors.email 
                      ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500' 
                      : 'border-slate-300 focus:ring-slate-200 focus:border-[#1e293b]'
                  }`}
                  placeholder="e.g. applicant@domain.org"
                />
              </div>
              {validationErrors.email && (
                <p className="text-xs text-rose-600 flex items-center space-x-1 mt-1" role="alert">
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{validationErrors.email}</span>
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label htmlFor="field-phone" className="block text-sm font-semibold text-slate-700">
                Phone Number <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Phone className="h-4 w-4" />
                </span>
                <input
                  type="tel"
                  id="field-phone"
                  name="phone"
                  value={phone}
                  onChange={handleFieldChange(setPhone, 'phone')}
                  aria-required="true"
                  aria-invalid={!!validationErrors.phone}
                  className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    validationErrors.phone 
                      ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500' 
                      : 'border-slate-300 focus:ring-slate-200 focus:border-[#1e293b]'
                  }`}
                  placeholder="e.g. 555-019-2834"
                />
              </div>
              {validationErrors.phone && (
                <p className="text-xs text-rose-600 flex items-center space-x-1 mt-1" role="alert">
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{validationErrors.phone}</span>
                </p>
              )}
            </div>

            {/* Business / Org name (optional) */}
            <div className="space-y-1.5">
              <label htmlFor="field-organization" className="block text-sm font-semibold text-slate-700">
                Organisation or Business Name <span className="text-slate-400 text-xs font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Briefcase className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  id="field-organization"
                  name="organization"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-[#1e293b] transition-all"
                  placeholder="e.g. Metro Builders Inc."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Permit specifications */}
        <div>
          <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-4 border-b border-slate-100 pb-1.5">
            2. Request Specifications & Logistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Permit Type dropdown */}
            <div className="space-y-1.5">
              <label htmlFor="field-permitType" className="block text-sm font-semibold text-slate-700">
                Permit or Licence Type <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <select
                  id="field-permitType"
                  name="permitType"
                  value={permitType}
                  onChange={(e) => setPermitType(e.target.value as PermitType)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-[#1e293b] transition-all cursor-pointer"
                >
                  {Object.entries(PERMIT_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Estimated Duration */}
            <div className="space-y-1.5">
              <label htmlFor="field-estimatedDuration" className="block text-sm font-semibold text-slate-700">
                Estimated Duration of Activity <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Clock className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  id="field-estimatedDuration"
                  name="estimatedDuration"
                  value={estimatedDuration}
                  onChange={handleFieldChange(setEstimatedDuration, 'estimatedDuration')}
                  aria-required="true"
                  aria-invalid={!!validationErrors.estimatedDuration}
                  className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    validationErrors.estimatedDuration 
                      ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500' 
                      : 'border-slate-300 focus:ring-slate-200 focus:border-[#1e293b]'
                  }`}
                  placeholder="e.g. 45 Days, 6 Months, or Annual"
                />
              </div>
              {validationErrors.estimatedDuration && (
                <p className="text-xs text-rose-600 flex items-center space-x-1 mt-1" role="alert">
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{validationErrors.estimatedDuration}</span>
                </p>
              )}
            </div>

            {/* Project Address */}
            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor="field-projectAddress" className="block text-sm font-semibold text-slate-700">
                Project Site Address <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <MapPin className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  id="field-projectAddress"
                  name="projectAddress"
                  value={projectAddress}
                  onChange={handleFieldChange(setProjectAddress, 'projectAddress')}
                  aria-required="true"
                  aria-invalid={!!validationErrors.projectAddress}
                  className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    validationErrors.projectAddress 
                      ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500' 
                      : 'border-slate-300 focus:ring-slate-200 focus:border-[#1e293b]'
                  }`}
                  placeholder="e.g. 1428 Oak Street, Suite 4B, Ward 4"
                />
              </div>
              {validationErrors.projectAddress && (
                <p className="text-xs text-rose-600 flex items-center space-x-1 mt-1" role="alert">
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{validationErrors.projectAddress}</span>
                </p>
              )}
            </div>

            {/* Start Date */}
            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor="field-startDate" className="block text-sm font-semibold text-slate-700">
                Proposed Start Date <span className="text-rose-500" aria-hidden="true">*</span>
                <span className="text-slate-400 text-xs font-normal ml-2">(Must be at least 14 days from today)</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Calendar className="h-4 w-4" />
                </span>
                <input
                  type="date"
                  id="field-startDate"
                  name="startDate"
                  value={startDate}
                  onChange={handleFieldChange(setStartDate, 'startDate')}
                  aria-required="true"
                  aria-invalid={!!validationErrors.startDate}
                  className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    validationErrors.startDate 
                      ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500' 
                      : 'border-slate-300 focus:ring-slate-200 focus:border-[#1e293b]'
                  }`}
                />
              </div>
              {validationErrors.startDate && (
                <p className="text-xs text-rose-600 flex items-center space-x-1 mt-1" role="alert">
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{validationErrors.startDate}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Description of activity */}
        <div>
          <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-4 border-b border-slate-100 pb-1.5">
            3. Detailed Regulatory Description of Activity
          </h3>
          <div className="space-y-1.5">
            <label htmlFor="field-description" className="block text-sm font-semibold text-slate-700 flex items-center justify-between">
              <span>Detailed Description <span className="text-rose-500" aria-hidden="true">*</span></span>
              <span className={`text-xs ${getWordCountColor()}`}>
                {currentWordCount} / 100–500 words 
                {currentWordCount > 0 && currentWordCount < 100 && ' (required: at least 100)'}
                {currentWordCount > 500 && ' (exceeded maximum limits)'}
              </span>
            </label>
            <textarea
              id="field-description"
              name="description"
              value={description}
              onChange={handleDescriptionChange}
              rows={6}
              aria-required="true"
              aria-invalid={!!validationErrors.description}
              className={`w-full p-3 border rounded-lg text-sm bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 transition-all font-sans leading-relaxed ${
                validationErrors.description 
                  ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500' 
                  : 'border-slate-300 focus:ring-slate-200 focus:border-[#1e293b]'
              }`}
              placeholder="Please provide an expansive, context-rich breakdown of your planned utility operations, structural metrics, vendor integrations, and site safety configurations directly within the 100 to 500 words perimeter constraint."
            ></textarea>
            {validationErrors.description && (
              <p className="text-xs text-rose-600 flex items-center space-x-1 mt-1" role="alert">
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{validationErrors.description}</span>
              </p>
            )}
          </div>
        </div>

        {/* Section 4: Attestations / Signatures */}
        <div>
          <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-4 border-b border-slate-100 pb-1.5">
            4. Official Assurances & Attestation
          </h3>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="field-declarationTicked"
                  name="declarationTicked"
                  type="checkbox"
                  checked={declarationTicked}
                  onChange={handleFieldChange(setDeclarationTicked, 'declarationTicked')}
                  aria-required="true"
                  aria-invalid={!!validationErrors.declarationTicked}
                  className="h-4.5 w-4.5 text-sky-800 border-slate-300 rounded focus:ring-sky-500 cursor-pointer"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="field-declarationTicked" className="font-medium text-slate-700 select-none cursor-pointer">
                  Attestation and Formal Accuracy Declaration <span className="text-rose-500" aria-hidden="true">*</span>
                </label>
                <span id="declaration-description" className="text-slate-500 block text-xs mt-0.5 leading-relaxed">
                  I hereby declare that all details populated within this digital permit intake framework are strictly accurate, lawful, and complete. I understand that falsifying infrastructure metrics, dates, or business layouts renders this application void and subjects applicant organizations to town ordinance penalties.
                </span>
                {validationErrors.declarationTicked && (
                  <p className="text-xs text-rose-600 flex items-center space-x-1 mt-2.5" role="alert">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{validationErrors.declarationTicked}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="border-t border-slate-100 pt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={resetForm}
            className="px-5 py-2.5 border border-slate-300 text-slate-600 font-medium text-sm rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors cursor-pointer"
          >
            Clear Form
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center justify-center space-x-2 px-6 py-2.5 bg-[#1e293b] hover:bg-[#0f172a] text-white font-semibold text-sm rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all cursor-pointer ${
              isSubmitting ? 'opacity-80 cursor-wait' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Validating Coordinates...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-4.5 w-4.5" />
                <span>Submit Secure Application</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
