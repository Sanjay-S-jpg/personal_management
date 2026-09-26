import React, { useState } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import {
  CATEGORY_SUBCATEGORIES,
  EXPENSE_CATEGORIES,
  ExpenseCategory,
} from '../../types/expense';
import { PlusCircle, CheckCircle2, AlertCircle, ArrowLeft, Calendar } from 'lucide-react';

interface AddExpenseFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ onSuccess, onCancel }) => {
  const { addExpense } = useExpenses();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [subcategory, setSubcategory] = useState<string>('Lunch');
  const [isCustomSubcategory, setIsCustomSubcategory] = useState(false);
  const [customSubcategoryText, setCustomSubcategoryText] = useState('');

  // Date is recorded automatically by backend, but user can toggle custom date if backdating
  const [allowBackdate, setAllowBackdate] = useState(false);
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const availableSubcategories = CATEGORY_SUBCATEGORIES[category] || [];

  const handleCategoryChange = (newCat: ExpenseCategory) => {
    setCategory(newCat);
    setIsCustomSubcategory(false);
    setCustomSubcategoryText('');
    const subs = CATEGORY_SUBCATEGORIES[newCat] || [];
    setSubcategory(subs.length > 0 ? subs[0] : '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const parsedAmount = parseFloat(amount);
    if (!name.trim()) {
      setErrorMessage('Please enter an expense name');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage('Please enter a valid amount greater than 0');
      return;
    }

    const finalSubcategory = isCustomSubcategory
      ? customSubcategoryText.trim()
      : subcategory.trim();

    setIsSubmitting(true);
    try {
      await addExpense({
        name: name.trim(),
        amount: parsedAmount,
        category,
        subcategory: finalSubcategory || undefined,
        ...(allowBackdate && customDate ? { date: customDate } : {}),
      });

      setSuccessMessage(`Expense "${name.trim()}" logged successfully!`);
      // Reset form
      setName('');
      setAmount('');
      setCategory('Food');
      setSubcategory('Lunch');
      setIsCustomSubcategory(false);
      setCustomSubcategoryText('');
      setAllowBackdate(false);

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1200);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to record expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between pb-5 border-b border-neutral-800 mb-6">
          <div>
            <h2 className="text-xl font-bold text-neutral-100 tracking-tight">Record Expense</h2>
            <p className="text-xs text-neutral-400 mt-1">
              Add a new transaction. Date and time are automatically stamped by the backend.
            </p>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Success Feedback */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Error Feedback */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Expense Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Expense Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Lunch with Client, Gasoline, Grocery Run"
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Amount ($) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 font-mono">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 text-sm font-mono focus:outline-none focus:border-indigo-500 transition-colors tabular-nums"
                required
              />
            </div>
          </div>

          {/* Category & Subcategory Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as ExpenseCategory)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Subcategory
                </label>
                {availableSubcategories.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsCustomSubcategory(!isCustomSubcategory)}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300"
                  >
                    {isCustomSubcategory ? 'Choose Preset' : 'Custom'}
                  </button>
                )}
              </div>

              {isCustomSubcategory || availableSubcategories.length === 0 ? (
                <input
                  type="text"
                  value={customSubcategoryText}
                  onChange={(e) => setCustomSubcategoryText(e.target.value)}
                  placeholder="Specify subcategory..."
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              ) : (
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="">General / None</option>
                  {availableSubcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Optional Backdate Toggle */}
          <div className="pt-2">
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-neutral-400 hover:text-neutral-300">
              <input
                type="checkbox"
                checked={allowBackdate}
                onChange={(e) => setAllowBackdate(e.target.checked)}
                className="rounded border-neutral-700 bg-neutral-950 text-indigo-600 focus:ring-0 focus:ring-offset-0"
              />
              <span>Backdate this expense (default is current timestamp)</span>
            </label>

            {allowBackdate && (
              <div className="mt-3 p-3 rounded-lg bg-neutral-950 border border-neutral-800 max-w-xs">
                <label className="block text-[11px] text-neutral-400 mb-1">Select Custom Date</label>
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-xs text-neutral-100 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Recording Expense...' : 'Save Expense'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
