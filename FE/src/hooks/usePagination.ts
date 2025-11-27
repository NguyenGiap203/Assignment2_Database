// hooks/usePagination.ts

import { useState, useCallback } from 'react';

interface PaginationResult {
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (limit: number) => void;
}

export const usePagination = (initialItemsPerPage: number = 10): PaginationResult => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const setPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, page));
  }, []);

  return {
    currentPage,
    itemsPerPage,
    setCurrentPage: setPage,
    setItemsPerPage,
  };
};