"use client";

import { useState, useCallback } from "react";

interface UseModalsReturn {
  // Confirm Modal
  isConfirmOpen: boolean;
  confirmData: {
    title: string;
    message: string;
    onConfirm: () => void;
    type?: "danger" | "warning" | "info";
    confirmText?: string;
    cancelText?: string;
  } | null;
  showConfirm: (data: {
    title: string;
    message: string;
    onConfirm: () => void;
    type?: "danger" | "warning" | "info";
    confirmText?: string;
    cancelText?: string;
  }) => void;
  hideConfirm: () => void;

  // Save Modal
  isSaveOpen: boolean;
  saveData: {
    title: string;
    message: string;
    onConfirm: () => void;
    type?: "save" | "create" | "update";
    confirmText?: string;
    cancelText?: string;
  } | null;
  showSave: (data: {
    title: string;
    message: string;
    onConfirm: () => void;
    type?: "save" | "create" | "update";
    confirmText?: string;
    cancelText?: string;
  }) => void;
  hideSave: () => void;

  // Loading states
  isConfirmLoading: boolean;
  isSaveLoading: boolean;
  setConfirmLoading: (loading: boolean) => void;
  setSaveLoading: (loading: boolean) => void;
}

export function useModals(): UseModalsReturn {
  // Confirm Modal State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] =
    useState<UseModalsReturn["confirmData"]>(null);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  // Save Modal State
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [saveData, setSaveData] = useState<UseModalsReturn["saveData"]>(null);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  // Confirm Modal Functions
  const showConfirm = useCallback(
    (data: NonNullable<UseModalsReturn["confirmData"]>) => {
      setConfirmData(data);
      setIsConfirmOpen(true);
      setIsConfirmLoading(false);
    },
    []
  );

  const hideConfirm = useCallback(() => {
    setIsConfirmOpen(false);
    setIsConfirmLoading(false);
    setTimeout(() => setConfirmData(null), 200); // Wait for animation
  }, []);

  // Save Modal Functions
  const showSave = useCallback(
    (data: NonNullable<UseModalsReturn["saveData"]>) => {
      setSaveData(data);
      setIsSaveOpen(true);
      setIsSaveLoading(false);
    },
    []
  );

  const hideSave = useCallback(() => {
    setIsSaveOpen(false);
    setIsSaveLoading(false);
    setTimeout(() => setSaveData(null), 200); // Wait for animation
  }, []);

  return {
    // Confirm Modal
    isConfirmOpen,
    confirmData,
    showConfirm,
    hideConfirm,
    isConfirmLoading,
    setConfirmLoading: setIsConfirmLoading,

    // Save Modal
    isSaveOpen,
    saveData,
    showSave,
    hideSave,
    isSaveLoading,
    setSaveLoading: setIsSaveLoading,
  };
}
