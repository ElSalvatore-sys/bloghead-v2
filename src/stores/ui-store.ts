/**
 * UI Store
 * Global UI state: sidebar, mobile menu, modals, loading
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

/**
 * Modal types for the application
 */
export type ModalType =
  | 'confirm-delete'
  | 'enquiry-form'
  | 'vendor-preview'
  | 'image-gallery'
  | 'share-event'
  | 'booking-request'
  | null

interface UIState {
  // Sidebar
  sidebarOpen: boolean

  // Mobile menu
  mobileMenuOpen: boolean

  // Modal management
  activeModal: ModalType
  modalData: Record<string, unknown> | null

  // Global loading
  globalLoading: boolean
  loadingMessage: string | null
}

interface UIActions {
  // Sidebar
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void

  // Mobile menu
  toggleMobileMenu: () => void
  setMobileMenuOpen: (open: boolean) => void

  // Modals
  openModal: (type: ModalType, data?: Record<string, unknown>) => void
  closeModal: () => void

  // Loading
  setGlobalLoading: (loading: boolean, message?: string) => void
}

const initialState: UIState = {
  sidebarOpen: false,
  mobileMenuOpen: false,
  activeModal: null,
  modalData: null,
  globalLoading: false,
  loadingMessage: null,
}

export const useUIStore = create<UIState & UIActions>()(
  devtools(
    (set) => ({
      ...initialState,

      // Sidebar actions
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'toggleSidebar'),
      setSidebarOpen: (open) =>
        set({ sidebarOpen: open }, false, 'setSidebarOpen'),

      // Mobile menu actions
      toggleMobileMenu: () =>
        set(
          (state) => ({ mobileMenuOpen: !state.mobileMenuOpen }),
          false,
          'toggleMobileMenu'
        ),
      setMobileMenuOpen: (open) =>
        set({ mobileMenuOpen: open }, false, 'setMobileMenuOpen'),

      // Modal actions
      openModal: (type, data) =>
        set({ activeModal: type, modalData: data ?? null }, false, 'openModal'),
      closeModal: () =>
        set({ activeModal: null, modalData: null }, false, 'closeModal'),

      // Loading actions
      setGlobalLoading: (loading, message) =>
        set(
          { globalLoading: loading, loadingMessage: message ?? null },
          false,
          'setGlobalLoading'
        ),
    }),
    { name: 'ui-store', enabled: import.meta.env.DEV }
  )
)
