import React, { useState, useEffect } from 'react';
import { Item } from '../types';

interface ItemFormProps {
  onSubmit: (item: Omit<Item, 'id'>) => void;
  editingItem?: Item;
}

export const ItemForm: React.FC<ItemFormProps> = ({ onSubmit, editingItem }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const TITLE_MAX_LENGTH = 50;
  const DESCRIPTION_MAX_LENGTH = 200;

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setDescription(editingItem.description);
    }
  }, [editingItem]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    if (newTitle.length <= TITLE_MAX_LENGTH) {
      setTitle(newTitle);
      setTitleError('');
    } else {
      setTitleError(`Title must be ${TITLE_MAX_LENGTH} characters or less`);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    if (newDescription.length <= DESCRIPTION_MAX_LENGTH) {
      setDescription(newDescription);
      setDescriptionError('');
    } else {
      setDescriptionError(`Description must be ${DESCRIPTION_MAX_LENGTH} characters or less`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onSubmit({ title: title.trim(), description: description.trim() });
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto mb-8">
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter title"
          />
          <div className="absolute right-2 bottom-2 text-sm text-gray-500">
            {title.length}/{TITLE_MAX_LENGTH}
          </div>
        </div>
        {titleError && (
          <p className="mt-1 text-sm text-red-500">{titleError}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            required
            placeholder="Enter description"
          />
          <div className="absolute right-2 bottom-2 text-sm text-gray-500">
            {description.length}/{DESCRIPTION_MAX_LENGTH}
          </div>
        </div>
        {descriptionError && (
          <p className="mt-1 text-sm text-red-500">{descriptionError}</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-gray-900 text-gray-100 py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 border border-gray-700/50"
      >
        {editingItem ? 'Update Item' : 'Add Item'}
      </button>
    </form>
  );
};