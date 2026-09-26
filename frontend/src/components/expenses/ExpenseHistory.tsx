import React, { useState, useMemo } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { Expense, EXPENSE_CATEGORIES, UpdateExpensePayload } from '../../types/expense';
import { EditExpenseModal } from './EditExpenseModal';
import { Modal } from '../common/Modal';
import {
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  Receipt,
} from 'lucide-react';

export const ExpenseHistory: React.FC = () => {
  const {
    expenses,
    editExpense,
    removeExpense,
    filterCategory,
    setFilterCategory,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    filterDate,
    setFilterDate,
  } = useExpenses();

  // State for modals
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtered and sorted expenses
  const processedExpenses = useMemo(() => {
    let result = [...expenses];

    // Filter: Search name
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          (e.subcategory && e.subcategory.toLowerCase().includes(q))
      );
    }

    // Filter: Category
    if (filterCategory && filterCategory !== 'all') {
      result = result.filter((e) => e.category === filterCategory);
    }

    // Filter: Specific Date
    if (filterDate) {
      result = result.filter((e) => {
        const itemDate = new Date(e.createdAt || e.date || 0).toISOString().split('T')[0];
        return itemDate === filterDate;
      });
    }

    // Sorting: Newest -> Oldest vs Oldest -> Newest
    result.sort((a, b) => {
      const timeA = new Date(a.createdAt || a.date || 0).getTime();
      const timeB = new Date(b.createdAt || b.date || 0).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [expenses, searchQuery, filterCategory, filterDate, sortOrder]);

  const totalFilteredAmount = processedExpenses.reduce((s, e) => s + Number(e.amount), 0);

  const handleConfirmDelete = async () => {
    if (!deletingExpense) return;
    setIsDeleting(true);
    try {
      await removeExpense(deletingExpense.id);
      setDeletingExpense(null);
    } catch (err) {
      console.error('Delete error', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (id: string | number, payload: UpdateExpensePayload) => {
    await editExpense(id, payload);
    setEditingExpense(null);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilterCategory('all');
    setFilterDate('');
    setSortOrder('newest');
  };

  const hasActiveFilters = searchQuery !== '' || filterCategory !== 'all' || filterDate !== '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-100 tracking-tight">Expense History</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Audit, filter, edit, and organize all recorded financial transactions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono tabular-nums text-neutral-300 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg">
          <span className="text-neutral-500">Filtered Total:</span>
          <span className="font-semibold text-neutral-100">${totalFilteredAmount.toFixed(2)}</span>
          <span className="text-neutral-500">({processedExpenses.length} items)</span>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search by Expense Name */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search expenses by name..."
              className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-200 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="all">All Categories</option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Specific Date Filter */}
          <div className="relative">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-200 text-xs font-mono focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Sort Order */}
          <div className="flex items-center gap-2">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
              className="flex-1 px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-200 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="newest">Newest → Oldest</option>
              <option value="oldest">Oldest → Newest</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-2.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded-lg transition-colors flex items-center gap-1 shrink-0"
                title="Clear all filters"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expense List / Table View */}
      {processedExpenses.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-3 text-neutral-400">
            <Receipt className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-neutral-200">No matching expenses found</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            {hasActiveFilters
              ? 'Try adjusting your search query, category filter, or selected date.'
              : 'Start logging transactions by navigating to Add Expense.'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="mt-4 px-3 py-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/60 text-neutral-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Expense Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Subcategory</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {processedExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-neutral-100 max-w-[220px] truncate">
                      {exp.name}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-300">
                      {exp.category}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-400">
                      {exp.subcategory || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-400 font-mono">
                      {new Date(exp.createdAt || exp.date || '').toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold font-mono text-neutral-100 tabular-nums text-sm">
                      ${Number(exp.amount).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingExpense(exp)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-indigo-400 hover:bg-neutral-800 transition-colors"
                          title="Edit Expense"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingExpense(exp)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                          title="Delete Expense"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-3">
            {processedExpenses.map((exp) => (
              <div
                key={exp.id}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-neutral-100 text-sm">{exp.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1">
                      <span>{exp.category}</span>
                      {exp.subcategory && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{exp.subcategory}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-neutral-100 font-mono tabular-nums">
                      ${Number(exp.amount).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-500">
                  <span className="font-mono">
                    {new Date(exp.createdAt || exp.date || '').toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingExpense(exp)}
                      className="px-2 py-1 text-xs text-indigo-400 bg-neutral-800 rounded hover:bg-neutral-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeletingExpense(exp)}
                      className="px-2 py-1 text-xs text-rose-400 bg-neutral-800 rounded hover:bg-neutral-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Edit Modal */}
      <EditExpenseModal
        isOpen={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        expense={editingExpense}
        onSave={handleUpdate}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingExpense}
        onClose={() => setDeletingExpense(null)}
        title="Confirm Expense Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4 text-sm text-neutral-300">
          <div className="p-3 bg-rose-950/30 border border-rose-900/50 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-300">
              Are you sure you want to delete <strong className="text-white">"{deletingExpense?.name}"</strong> (${Number(deletingExpense?.amount).toFixed(2)})? This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setDeletingExpense(null)}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete Expense'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
