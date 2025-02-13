import React, { useEffect, useState } from 'react';
import { ItemList } from './components/ItemsList';
import { ItemForm } from './components/ItemForm';
import { SuccessModal } from './components/SuccessModal';
import { api } from './services/api';
import { Item } from './types';
import { MantineProvider, createTheme, HoverCard, Text } from '@mantine/core';
import { IconBoxSeam, IconInfoCircle, IconNotes } from '@tabler/icons-react';

const theme = createTheme({});

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [editingItem, setEditingItem] = useState<Item | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 6; // You can adjust this number
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await api.getItems();
      setItems(sortItems(data, 'asc'));
    } catch (err) {
      setError('Failed to fetch items');
    }
  };

  const getNextId = () => {
    return Math.max(...items.map(item => item.id), 0) + 1;
  };

  const resetState = () => {
    setEditingItem(undefined);
    setError(null);
    // Reset the form
    const form = document.querySelector('form');
    if (form) {
      form.reset();
    }
  };

  const handleSubmit = async (item: Omit<Item, 'id'>) => {
    try {
      if (editingItem) {
        // For editing existing items
        try {
          const updated = await api.updateItem({ ...item, id: editingItem.id });
          setItems(prevItems => {
            const newItems = prevItems.map((i) => 
              i.id === editingItem.id ? { ...updated, id: editingItem.id } : i
            );
            return sortItems(newItems, sortOrder);
          });
          setSuccessMessage('Item updated successfully!');
          setShowSuccessModal(true);
          resetState();
        } catch (err) {
          setError('Failed to save item, cause the item does not exist in mock api DB ( this is by design )');
          resetState();
          return;
        }
      } else {
        // For creating new items
        try {
          const created = await api.createItem(item);
          const newItem = {
            ...created,
            id: created.id || getNextId(),
          };
          setItems(prevItems => {
            const newItems = [...prevItems, newItem];
            return sortItems(newItems, sortOrder);
          });
          setSuccessMessage('Item created successfully!');
          setShowSuccessModal(true);
          resetState();
        } catch (err) {
          const newItem = {
            ...item,
            id: getNextId(),
          };
          setItems(prevItems => {
            const newItems = [...prevItems, newItem];
            return sortItems(newItems, sortOrder);
          });
          setSuccessMessage('Item created locally!');
          setShowSuccessModal(true);
          resetState();
        }
      }
    } catch (err) {
      setError('Failed to save item, cause the item does not exist in mock api DB ( this is by design )');
      resetState();
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteItem(id);
      setItems(prevItems => {
        const newItems = prevItems.filter(item => item.id !== id);
        // Reset to first page if current page becomes empty
        const remainingItems = newItems.length;
        const maxPages = Math.ceil(remainingItems / itemsPerPage);
        if (currentPage > maxPages) {
          setCurrentPage(Math.max(1, maxPages));
        }
        return newItems;
      });
      setSuccessMessage('Item deleted successfully!');
      setShowSuccessModal(true);
    } catch (err) {
      // Handle API error but still delete locally
      setItems(prevItems => prevItems.filter(item => item.id !== id));
      setSuccessMessage('Item deleted locally!');
      setShowSuccessModal(true);
    }
  };

  const sortItems = (itemsToSort: Item[], order: 'asc' | 'desc') => {
    return [...itemsToSort].sort((a, b) => {
      return order === 'asc' ? a.id - b.id : b.id - a.id;
    });
  };

  const handleSortChange = (newOrder: 'asc' | 'desc') => {
    setSortOrder(newOrder);
    setItems(prevItems => sortItems(prevItems, newOrder));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MantineProvider theme={theme}>
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto relative">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <IconNotes className="text-gray-800" size={32} stroke={1.5} />
              <span>Notes</span>
              <span className="text-gray-500 ">/ sam jonath </span>
            </h1>
            
            <div 
              className="relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <div className="cursor-help">
                <IconInfoCircle
                  size={24}
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                  stroke={1.5}
                />
              </div>
              
              {showTooltip && (
                <div 
                  className="absolute right-0 mt-2 w-64 p-3 bg-gray-900 rounded-lg shadow-lg border border-gray-700/50 z-50"
                  style={{
                    transform: 'translateY(8px)'
                  }}
                >
                  <div className="flex items-start gap-2">
                    <IconInfoCircle 
                      size={20} 
                      className="text-gray-400 flex-shrink-0 mt-0.5" 
                      stroke={1.5}
                    />
                    <p className="text-sm text-gray-300 leading-snug">
                      Can't edit newly added items since we are working with mock APIs
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <ItemForm onSubmit={handleSubmit} editingItem={editingItem} />
          <ItemList
            items={items}
            onDelete={handleDelete}
            onEdit={setEditingItem}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />
          <SuccessModal
            isOpen={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            message={successMessage}
          />
        </div>
      </div>
    </MantineProvider>
  );
}

export default App;