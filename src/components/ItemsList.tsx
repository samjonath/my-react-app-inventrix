import React from 'react';
import { Item } from '../types';
import { Paper, Text, Button, Group, Title, Badge } from '@mantine/core';
import { IconEdit, IconTrash, IconClock } from '@tabler/icons-react';
import { motion } from 'framer-motion';

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

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Sort by:</span>
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value as 'asc' | 'desc')}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          >
            <Paper
              shadow="sm"
              radius="xl"
              className="h-full flex flex-col justify-between hover:shadow-lg transition-shadow duration-200 overflow-hidden"
              withBorder
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <Title 
                    order={3} 
                    className="line-clamp-1 text-lg font-semibold flex-1"
                    style={{ minWidth: 0 }}
                  >
                    {item.title}
                  </Title>
                  <Badge 
                    color="blue" 
                    variant="light"
                    size="lg"
                    className="whitespace-nowrap flex-shrink-0"
                    leftSection={
                      <div className="ml-1">
                        <IconClock size={14} />
                      </div>
                    }
                  >
                    ID: {item.id}
                  </Badge>
                </div>

                <Text 
                  c="dimmed" 
                  size="sm" 
                  className="line-clamp-3"
                >
                  {item.description}
                </Text>
              </div>

              <div className="px-5 pb-4 pt-2 flex justify-end gap-2 mt-auto">
                <Button
                  variant="light"
                  color="blue"
                  size="sm"
                  onClick={() => onEdit(item)}
                  className="hover:scale-105 transition-transform duration-200 font-medium flex items-center gap-1"
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
                  leftSection={<IconEdit size={16} style={{ color: '#228BE6' }} />}
                >
                  <span style={{ color: '#228BE6' }}>Edit</span>
                </Button>
                <Button
                  variant="light"
                  color="red"
                  size="sm"
                  onClick={() => onDelete(item.id)}
                  className="hover:scale-105 transition-transform duration-200 font-medium flex items-center gap-1"
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
                  leftSection={<IconTrash size={16} style={{ color: '#FA5252' }} />}
                >
                  <span style={{ color: '#FA5252' }}>Delete</span>
                </Button>
              </div>
            </Paper>
          </motion.div>
        ))}
      </div>
      
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
                      ? 'bg-blue-500 text-white'
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