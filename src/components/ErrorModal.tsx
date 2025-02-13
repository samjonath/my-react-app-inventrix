import React, { useEffect } from 'react';
import { Modal, Text, Button } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, message }) => {
  return (
    <Modal 
      opened={isOpen} 
      onClose={onClose}
      size="md"
      centered
      padding="xl"
    >
      <div className="flex flex-col items-center text-center">
        <IconAlertCircle size={50} className="text-red-500 mb-4" />
        <Text size="lg" fw={500} className="mb-3">
          Error
        </Text>
        <Text size="sm" c="dimmed" className="mb-4">
          {message}
        </Text>
        <Button
          color="red"
          variant="light"
          onClick={onClose}
          className="mt-2"
        >
          Close
        </Button>
      </div>
    </Modal>
  );
}; 