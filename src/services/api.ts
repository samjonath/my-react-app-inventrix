import { Item } from '../types';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const api = {
  getItems: async (): Promise<Item[]> => {
    const response = await fetch(`${BASE_URL}/posts`);
    if (!response.ok) throw new Error('Failed to fetch items');
    const data = await response.json();
    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.body
    }));
  },

  createItem: async (item: Omit<Item, 'id'>): Promise<Item> => {
    const response = await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      body: JSON.stringify(item),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (!response.ok) throw new Error('Failed to create item');
    return await response.json();
  },

  deleteItem: async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete item');
  },

  updateItem: async (item: Item): Promise<Item> => {
    const response = await fetch(`${BASE_URL}/posts/${item.id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (!response.ok) throw new Error('Failed to update item');
    return await response.json();
  },
};