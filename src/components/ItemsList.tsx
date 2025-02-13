import React, { useState, useEffect } from 'react';
import { Item } from '../types';
import { Paper, Text, Button, Group, Title, Badge, Select, Modal } from '@mantine/core';
import { IconEdit, IconTrash, IconClock, IconSortAscending, IconSortDescending, IconX } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { MantineTheme } from '@mantine/core';
import { createPortal } from 'react-dom';

interface ItemListProps {
  items: Item[];
  onDelete: (id: number) => void;
  onEdit: (item: Item) => void;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  sortOrder: 'asc' | 'desc';
  onSortChange: (order: 'asc' | 'desc') => void;
}

type PageItem = number | '...';

export const ItemList: React.FC<ItemListProps> = ({ 
  items, 
  onDelete, 
  onEdit, 
  itemsPerPage,
  currentPage,
  onPageChange,
  sortOrder,
  onSortChange
}) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

  // Function to get visible page numbers
  const getVisiblePages = (): PageItem[] => {
    const delta = window.innerWidth < 640 ? 1 : 2; // Show fewer pages on mobile
    const range: number[] = [];
    const rangeWithDots: PageItem[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || 
        i === totalPages ||
        i === currentPage ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  const handleItemClick = (item: Item, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const CustomModal = () => {
    if (!isModalOpen) return null;

    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        />
        
        {/* Modal Content */}
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden z-50">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Item Details
            </h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <IconX size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-4 overflow-y-auto">
            {selectedItem && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Title
                  </h3>
                  <p className="text-gray-600">
                    {selectedItem.title}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {selectedItem.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                    <IconClock size={14} />
                    <span>ID: {selectedItem.id}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Sort by:</span>
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value as 'asc' | 'desc')}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer"
          >
            <option value="asc">Oldest First</option>
            <option value="desc">Latest First</option>
          </select>
        </div>
        
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, items.length)} of {items.length} items
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-4">
        {paginatedItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="h-full"
            onClick={(e) => handleItemClick(item, e)}
          >
            <Paper
              shadow="sm"
              className="h-full flex flex-col justify-between hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer bg-gray-900 border border-gray-700/50 rounded-2xl"
              withBorder
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <Title 
                    order={3} 
                    className="line-clamp-1 text-lg font-semibold flex-1 text-gray-100"
                    style={{ minWidth: 0 }}
                  >
                    {item.title}
                  </Title>
                  <span className="text-gray-400">{"#" + item.id}</span>
                  {/* <Badge 
                    color="gray" 
                    variant="transparent"
                    size="sm"
                    className="whitespace-nowrap flex-shrink-0 bg-gray-800 text-gray-300 border border-gray-700"
                    leftSection={
                      <div className="ml-1">
                        <IconClock size={14} className="text-gray-400" />
                      </div>
                    }
                  >
                    ID: {item.id}
                  </Badge> */}
                </div>

                <Text 
                  size="sm" 
                  className="line-clamp-3 text-gray-400"
                >
                  {item.description}
                </Text>
              </div>

              <div className="px-5 pb-4 pt-2 flex justify-end gap-2 mt-auto border-t border-gray-800">
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(item);
                  }}
                  className="hover:scale-105 transition-transform duration-200 font-medium flex items-center gap-1 hover:bg-gray-800"
                  styles={{
                    root: {
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '6px 12px',
                    },
                    inner: {
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    },
                  }}
                  leftSection={<IconEdit size={16} style={{ color: '#E5E7EB' }} />}
                >
                  <span className="text-gray-300">Edit</span>
                </Button>
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  className="hover:scale-105 transition-transform duration-200 font-medium flex items-center gap-1 hover:bg-gray-800"
                  styles={{
                    root: {
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '6px 12px',
                    },
                    inner: {
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    },
                  }}
                  leftSection={<IconTrash size={16} style={{ color: '#9CA3AF' }} />}
                >
                  <span className="text-gray-400">Delete</span>
                </Button>
              </div>
            </Paper>
          </motion.div>
        ))}
      </div>
      
      <CustomModal />

      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 sm:px-4 sm:py-2 text-sm bg-gray-200 rounded disabled:opacity-50 min-w-[80px]"
          >
            Previous
          </button>
          
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
            {getVisiblePages().map((pageNum, index) => (
              pageNum === '...' ? (
                <span key={`dots-${index}`} className="px-2 py-1">
                  {pageNum}
                </span>
              ) : (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum as number)}
                  className={`px-2 py-1 sm:px-4 sm:py-2 rounded text-sm ${
                    currentPage === pageNum
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {pageNum}
                </button>
              )
            ))}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 sm:px-4 sm:py-2 text-sm bg-gray-200 rounded disabled:opacity-50 min-w-[80px]"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};