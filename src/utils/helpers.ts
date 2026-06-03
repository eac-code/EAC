/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PermitApplication } from '../types';

/**
 * Counts words in a string, handles spacing and trims.
 */
export function getWordCount(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  // Split on one or more spaces, tabs, or newlines
  return trimmed.split(/\s+/).length;
}

/**
 * Validates if a date string is at least 14 days from today's local date.
 */
export function isAtLeast14DaysFromToday(dateString: string): { isValid: boolean; minRequiredDate: string } {
  if (!dateString) return { isValid: false, minRequiredDate: '' };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Calculate minimum date (today + 14 days)
  const minDate = new Date(today.getTime());
  minDate.setDate(today.getDate() + 14);
  
  // Parse input date in local time
  const [year, month, day] = dateString.split('-').map(Number);
  const inputDate = new Date(year, month - 1, day);
  inputDate.setHours(0, 0, 0, 0);

  // Format min date for display: YYYY-MM-DD
  const y = minDate.getFullYear();
  const m = String(minDate.getMonth() + 1).padStart(2, '0');
  const d = String(minDate.getDate()).padStart(2, '0');
  const formattedMinDate = `${y}-${m}-${d}`;

  return {
    isValid: inputDate.getTime() >= minDate.getTime(),
    minRequiredDate: formattedMinDate
  };
}

/**
 * Generates a unique reference number in format PRM-YYYY-XXXXX
 */
export function generateReferenceNumber(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000); // 5 digit random number
  return `PRM-${year}-${randomNum}`;
}

export interface ValidationError {
  fullName?: string;
  email?: string;
  phone?: string;
  projectAddress?: string;
  startDate?: string;
  estimatedDuration?: string;
  description?: string;
  declarationTicked?: string;
}

/**
 * Validates a permit application form submission.
 */
export function validateForm(fields: {
  fullName: string;
  email: string;
  phone: string;
  projectAddress: string;
  startDate: string;
  estimatedDuration: string;
  description: string;
  declarationTicked: boolean;
}): { isValid: boolean; errors: ValidationError } {
  const errors: ValidationError = {};
  let isValid = true;

  // 1. Full Name
  if (!fields.fullName.trim()) {
    errors.fullName = 'Full legal name is required.';
    isValid = false;
  }

  // 2. Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!fields.email.trim()) {
    errors.email = 'Contact email is required.';
    isValid = false;
  } else if (!emailRegex.test(fields.email)) {
    errors.email = 'Please provide a valid email address.';
    isValid = false;
  }

  // 3. Phone number
  if (!fields.phone.trim()) {
    errors.phone = 'Phone number is required.';
    isValid = false;
  }

  // 4. Project Address
  if (!fields.projectAddress.trim()) {
    errors.projectAddress = 'Project address is required.';
    isValid = false;
  }

  // 5. Estimated Duration
  if (!fields.estimatedDuration.trim()) {
    errors.estimatedDuration = 'Estimated duration is required.';
    isValid = false;
  }

  // 6. Start date validation (at least 14 days from today)
  if (!fields.startDate) {
    errors.startDate = 'Project start date is required.';
    isValid = false;
  } else {
    const dateCheck = isAtLeast14DaysFromToday(fields.startDate);
    if (!dateCheck.isValid) {
      errors.startDate = `Start date must be at least 14 days in the future (minimum: ${dateCheck.minRequiredDate}).`;
      isValid = false;
    }
  }

  // 7. Word count check (100 - 500 words)
  const wordCount = getWordCount(fields.description);
  if (!fields.description.trim()) {
    errors.description = 'Please provide a detailed description of the activity.';
    isValid = false;
  } else if (wordCount < 100 || wordCount > 500) {
    errors.description = `Description must be between 100 and 500 words. Current count: ${wordCount} words.`;
    isValid = false;
  }

  // 8. Declaration ticked
  if (!fields.declarationTicked) {
    errors.declarationTicked = 'You must confirm that the information provided is accurate and truthful.';
    isValid = false;
  }

  return { isValid, errors };
}
