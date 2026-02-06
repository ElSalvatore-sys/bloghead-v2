/**
 * Store Tests
 * Comprehensive tests for all Zustand stores
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore } from '../ui-store'
import { useFilterStore } from '../filter-store'
import { useWeddingStore, type Wedding } from '../wedding-store'
import { usePlanningStore } from '../planning-store'

// ========== UI STORE TESTS ==========

describe('UI Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useUIStore.setState({
      sidebarOpen: false,
      mobileMenuOpen: false,
      activeModal: null,
      modalData: null,
      globalLoading: false,
      loadingMessage: null,
    })
  })

  describe('Initial State', () => {
    it('has correct initial state', () => {
      const state = useUIStore.getState()

      expect(state.sidebarOpen).toBe(false)
      expect(state.mobileMenuOpen).toBe(false)
      expect(state.activeModal).toBe(null)
      expect(state.modalData).toBe(null)
      expect(state.globalLoading).toBe(false)
      expect(state.loadingMessage).toBe(null)
    })
  })

  describe('Sidebar Actions', () => {
    it('toggleSidebar() toggles sidebarOpen', () => {
      const { toggleSidebar } = useUIStore.getState()

      expect(useUIStore.getState().sidebarOpen).toBe(false)

      toggleSidebar()
      expect(useUIStore.getState().sidebarOpen).toBe(true)

      toggleSidebar()
      expect(useUIStore.getState().sidebarOpen).toBe(false)
    })

    it('setSidebarOpen(true) sets sidebarOpen to true', () => {
      const { setSidebarOpen } = useUIStore.getState()

      setSidebarOpen(true)
      expect(useUIStore.getState().sidebarOpen).toBe(true)
    })

    it('setSidebarOpen(false) sets sidebarOpen to false', () => {
      useUIStore.setState({ sidebarOpen: true })
      const { setSidebarOpen } = useUIStore.getState()

      setSidebarOpen(false)
      expect(useUIStore.getState().sidebarOpen).toBe(false)
    })
  })

  describe('Mobile Menu Actions', () => {
    it('toggleMobileMenu() toggles mobileMenuOpen', () => {
      const { toggleMobileMenu } = useUIStore.getState()

      expect(useUIStore.getState().mobileMenuOpen).toBe(false)

      toggleMobileMenu()
      expect(useUIStore.getState().mobileMenuOpen).toBe(true)

      toggleMobileMenu()
      expect(useUIStore.getState().mobileMenuOpen).toBe(false)
    })
  })

  describe('Modal Actions', () => {
    it('openModal() sets activeModal and modalData', () => {
      const { openModal } = useUIStore.getState()

      openModal('confirm-delete', { id: '123' })

      const state = useUIStore.getState()
      expect(state.activeModal).toBe('confirm-delete')
      expect(state.modalData).toEqual({ id: '123' })
    })

    it('openModal() works without modalData', () => {
      const { openModal } = useUIStore.getState()

      openModal('enquiry-form')

      const state = useUIStore.getState()
      expect(state.activeModal).toBe('enquiry-form')
      expect(state.modalData).toBe(null)
    })

    it('closeModal() resets activeModal and modalData to null', () => {
      useUIStore.setState({
        activeModal: 'confirm-delete',
        modalData: { id: '123' },
      })

      const { closeModal } = useUIStore.getState()
      closeModal()

      const state = useUIStore.getState()
      expect(state.activeModal).toBe(null)
      expect(state.modalData).toBe(null)
    })
  })

  describe('Loading Actions', () => {
    it('setGlobalLoading(true, message) sets loading state with message', () => {
      const { setGlobalLoading } = useUIStore.getState()

      setGlobalLoading(true, 'Loading...')

      const state = useUIStore.getState()
      expect(state.globalLoading).toBe(true)
      expect(state.loadingMessage).toBe('Loading...')
    })

    it('setGlobalLoading(false) clears loading state', () => {
      useUIStore.setState({ globalLoading: true, loadingMessage: 'Loading...' })

      const { setGlobalLoading } = useUIStore.getState()
      setGlobalLoading(false)

      const state = useUIStore.getState()
      expect(state.globalLoading).toBe(false)
      expect(state.loadingMessage).toBe(null)
    })
  })
})

// ========== FILTER STORE TESTS ==========

describe('Filter Store', () => {
  beforeEach(() => {
    // Reset to default state
    useFilterStore.getState().resetFilters()
  })

  describe('Initial State', () => {
    it('has correct initial state', () => {
      const state = useFilterStore.getState()

      expect(state.searchQuery).toBe('')
      expect(state.categories).toEqual([])
      expect(state.priceRange).toBe(null)
      expect(state.page).toBe(1)
      expect(state.pageSize).toBe(20)
      expect(state.viewMode).toBe('grid')
      expect(state.sortBy).toBe('relevance')
    })
  })

  describe('Search Actions', () => {
    it('setSearchQuery() sets query and resets page to 1', () => {
      useFilterStore.setState({ page: 5 })
      const { setSearchQuery } = useFilterStore.getState()

      setSearchQuery('test')

      const state = useFilterStore.getState()
      expect(state.searchQuery).toBe('test')
      expect(state.page).toBe(1)
    })
  })

  describe('Category Actions', () => {
    it('toggleCategory() adds category if not present', () => {
      const { toggleCategory } = useFilterStore.getState()

      toggleCategory('cat1')

      expect(useFilterStore.getState().categories).toContain('cat1')
    })

    it('toggleCategory() removes category if already present', () => {
      useFilterStore.setState({ categories: ['cat1', 'cat2'] })
      const { toggleCategory } = useFilterStore.getState()

      toggleCategory('cat1')

      const categories = useFilterStore.getState().categories
      expect(categories).not.toContain('cat1')
      expect(categories).toContain('cat2')
    })

    it('toggleCategory() resets page to 1', () => {
      useFilterStore.setState({ page: 5 })
      const { toggleCategory } = useFilterStore.getState()

      toggleCategory('cat1')

      expect(useFilterStore.getState().page).toBe(1)
    })
  })

  describe('Price Range Actions', () => {
    it('setPriceRange() sets price range', () => {
      const { setPriceRange } = useFilterStore.getState()

      setPriceRange([100, 500])

      expect(useFilterStore.getState().priceRange).toEqual([100, 500])
    })

    it('setPriceRange() resets page to 1', () => {
      useFilterStore.setState({ page: 5 })
      const { setPriceRange } = useFilterStore.getState()

      setPriceRange([100, 500])

      expect(useFilterStore.getState().page).toBe(1)
    })
  })

  describe('Location Actions', () => {
    it('setLocation() sets cityId and radius', () => {
      const { setLocation } = useFilterStore.getState()

      setLocation('city-123', 25)

      const state = useFilterStore.getState()
      expect(state.location.cityId).toBe('city-123')
      expect(state.location.radius).toBe(25)
    })

    it('setLocation() keeps existing radius if not provided', () => {
      useFilterStore.setState({ location: { cityId: null, radius: 75 } })
      const { setLocation } = useFilterStore.getState()

      setLocation('city-123')

      const state = useFilterStore.getState()
      expect(state.location.cityId).toBe('city-123')
      expect(state.location.radius).toBe(75)
    })
  })

  describe('Reset Filters', () => {
    it('resetFilters() restores all defaults', () => {
      useFilterStore.setState({
        searchQuery: 'test',
        categories: ['cat1'],
        priceRange: [100, 500],
        page: 5,
        sortBy: 'price_low',
        viewMode: 'list',
      })

      const { resetFilters } = useFilterStore.getState()
      resetFilters()

      const state = useFilterStore.getState()
      expect(state.searchQuery).toBe('')
      expect(state.categories).toEqual([])
      expect(state.priceRange).toBe(null)
      expect(state.page).toBe(1)
      expect(state.sortBy).toBe('relevance')
      expect(state.viewMode).toBe('grid')
    })
  })

  describe('getActiveFilterCount()', () => {
    it('returns 0 when no filters active', () => {
      const { getActiveFilterCount } = useFilterStore.getState()
      expect(getActiveFilterCount()).toBe(0)
    })

    it('returns 1 when searchQuery set', () => {
      useFilterStore.setState({ searchQuery: 'test' })
      const { getActiveFilterCount } = useFilterStore.getState()
      expect(getActiveFilterCount()).toBe(1)
    })

    it('returns 2 when searchQuery + 1 category', () => {
      useFilterStore.setState({ searchQuery: 'test', categories: ['cat1'] })
      const { getActiveFilterCount } = useFilterStore.getState()
      expect(getActiveFilterCount()).toBe(2)
    })

    it('returns 3 when searchQuery + category + priceRange', () => {
      useFilterStore.setState({
        searchQuery: 'test',
        categories: ['cat1'],
        priceRange: [100, 500],
      })
      const { getActiveFilterCount } = useFilterStore.getState()
      expect(getActiveFilterCount()).toBe(3)
    })

    it('counts location and sortBy when set', () => {
      useFilterStore.setState({
        searchQuery: 'test',
        location: { cityId: 'city-123', radius: 50 },
        sortBy: 'price_low',
      })
      const { getActiveFilterCount } = useFilterStore.getState()
      expect(getActiveFilterCount()).toBe(3)
    })
  })

  describe('toSearchParams()', () => {
    it('generates correct URLSearchParams', () => {
      useFilterStore.setState({
        searchQuery: 'dj',
        categories: ['music', 'dance'],
        priceRange: [100, 500],
        location: { cityId: 'city-123', radius: 25 },
        sortBy: 'price_low',
        page: 2,
      })

      const { toSearchParams } = useFilterStore.getState()
      const params = toSearchParams()

      expect(params.get('q')).toBe('dj')
      expect(params.get('categories')).toBe('music,dance')
      expect(params.get('priceMin')).toBe('100')
      expect(params.get('priceMax')).toBe('500')
      expect(params.get('cityId')).toBe('city-123')
      expect(params.get('radius')).toBe('25')
      expect(params.get('sort')).toBe('price_low')
      expect(params.get('page')).toBe('2')
    })

    it('excludes null/empty values', () => {
      const { toSearchParams } = useFilterStore.getState()
      const params = toSearchParams()

      expect(params.has('q')).toBe(false)
      expect(params.has('categories')).toBe(false)
      expect(params.has('priceMin')).toBe(false)
      expect(params.has('sort')).toBe(false) // 'relevance' is default
      expect(params.has('page')).toBe(false) // 1 is default
    })
  })

  describe('hydrateFromParams()', () => {
    it('reads URL params correctly', () => {
      const params = new URLSearchParams()
      params.set('q', 'band')
      params.set('categories', 'music,live')
      params.set('priceMin', '200')
      params.set('priceMax', '1000')
      params.set('cityId', 'city-456')
      params.set('sort', 'rating')
      params.set('page', '3')

      const { hydrateFromParams } = useFilterStore.getState()
      hydrateFromParams(params)

      const state = useFilterStore.getState()
      expect(state.searchQuery).toBe('band')
      expect(state.categories).toEqual(['music', 'live'])
      expect(state.priceRange).toEqual([200, 1000])
      expect(state.location.cityId).toBe('city-456')
      expect(state.sortBy).toBe('rating')
      expect(state.page).toBe(3)
    })

    it('handles missing params gracefully', () => {
      const params = new URLSearchParams()
      params.set('q', 'test')

      const { hydrateFromParams } = useFilterStore.getState()
      hydrateFromParams(params)

      const state = useFilterStore.getState()
      expect(state.searchQuery).toBe('test')
      expect(state.categories).toEqual([])
      expect(state.priceRange).toBe(null)
    })
  })
})

// ========== WEDDING STORE TESTS ==========

describe('Wedding Store', () => {
  const mockWedding: Wedding = {
    id: 'wedding-123',
    partner1_name: 'Alice',
    partner2_name: 'Bob',
    wedding_date: '2025-06-15',
    venue_id: 'venue-456',
    venue_name: 'Grand Ballroom',
    budget_total: 25000,
    guest_count_estimate: 150,
    created_at: '2024-01-01T00:00:00Z',
  }

  beforeEach(() => {
    useWeddingStore.getState().clearActiveWedding()
  })

  describe('Initial State', () => {
    it('has correct initial state', () => {
      const state = useWeddingStore.getState()

      expect(state.activeWeddingId).toBe(null)
      expect(state.activeWedding).toBe(null)
      expect(state.partnerNames).toBe(null)
      expect(state.weddingDate).toBe(null)
      expect(state.venueName).toBe(null)
    })
  })

  describe('setActiveWedding()', () => {
    it('sets wedding and updates denormalized fields', () => {
      const { setActiveWedding } = useWeddingStore.getState()

      setActiveWedding(mockWedding)

      const state = useWeddingStore.getState()
      expect(state.activeWedding).toEqual(mockWedding)
      expect(state.activeWeddingId).toBe('wedding-123')
      expect(state.partnerNames).toEqual(['Alice', 'Bob'])
      expect(state.weddingDate).toBe('2025-06-15')
      expect(state.venueName).toBe('Grand Ballroom')
    })

    it('handles null wedding', () => {
      useWeddingStore.setState({ activeWedding: mockWedding })
      const { setActiveWedding } = useWeddingStore.getState()

      setActiveWedding(null)

      const state = useWeddingStore.getState()
      expect(state.activeWedding).toBe(null)
      expect(state.activeWeddingId).toBe(null)
      expect(state.partnerNames).toBe(null)
    })
  })

  describe('clearActiveWedding()', () => {
    it('resets all wedding state', () => {
      useWeddingStore.setState({
        activeWedding: mockWedding,
        activeWeddingId: 'wedding-123',
        partnerNames: ['Alice', 'Bob'],
        weddingDate: '2025-06-15',
        venueName: 'Grand Ballroom',
      })

      const { clearActiveWedding } = useWeddingStore.getState()
      clearActiveWedding()

      const state = useWeddingStore.getState()
      expect(state.activeWedding).toBe(null)
      expect(state.activeWeddingId).toBe(null)
      expect(state.partnerNames).toBe(null)
      expect(state.weddingDate).toBe(null)
      expect(state.venueName).toBe(null)
    })
  })

  describe('updateWeddingField()', () => {
    it('updates field and denormalized partner names', () => {
      useWeddingStore.setState({
        activeWedding: mockWedding,
        partnerNames: ['Alice', 'Bob'],
      })

      const { updateWeddingField } = useWeddingStore.getState()
      updateWeddingField('partner1_name', 'Alicia')

      const state = useWeddingStore.getState()
      expect(state.activeWedding?.partner1_name).toBe('Alicia')
      expect(state.partnerNames).toEqual(['Alicia', 'Bob'])
    })

    it('updates wedding_date and denormalized field', () => {
      useWeddingStore.setState({
        activeWedding: mockWedding,
        weddingDate: '2025-06-15',
      })

      const { updateWeddingField } = useWeddingStore.getState()
      updateWeddingField('wedding_date', '2025-09-20')

      const state = useWeddingStore.getState()
      expect(state.activeWedding?.wedding_date).toBe('2025-09-20')
      expect(state.weddingDate).toBe('2025-09-20')
    })

    it('does nothing when no active wedding', () => {
      const { updateWeddingField } = useWeddingStore.getState()
      updateWeddingField('partner1_name', 'Test')

      expect(useWeddingStore.getState().activeWedding).toBe(null)
    })
  })
})

// ========== PLANNING STORE TESTS ==========

describe('Planning Store', () => {
  beforeEach(() => {
    useWeddingStore.getState().clearActiveWedding()
    usePlanningStore.getState().resetPlanningState()
  })

  describe('Initial State', () => {
    it('has correct initial state', () => {
      const state = usePlanningStore.getState()

      expect(state.activeTab).toBe('checklist')
      expect(state.taskView).toBe('list')
      expect(state.expandedSections).toEqual([])
      expect(state.selectedTaskIds).toEqual([])
    })
  })

  describe('Tab Navigation', () => {
    it('setActiveTab() changes tab', () => {
      const { setActiveTab } = usePlanningStore.getState()

      setActiveTab('budget')

      expect(usePlanningStore.getState().activeTab).toBe('budget')
    })
  })

  describe('Section Expansion', () => {
    it('toggleSection() expands section', () => {
      const { toggleSection } = usePlanningStore.getState()

      toggleSection('section-1')

      expect(usePlanningStore.getState().expandedSections).toContain('section-1')
    })

    it('toggleSection() collapses section if already expanded', () => {
      usePlanningStore.setState({ expandedSections: ['section-1', 'section-2'] })
      const { toggleSection } = usePlanningStore.getState()

      toggleSection('section-1')

      const sections = usePlanningStore.getState().expandedSections
      expect(sections).not.toContain('section-1')
      expect(sections).toContain('section-2')
    })

    it('collapseAllSections() clears all expanded sections', () => {
      usePlanningStore.setState({ expandedSections: ['section-1', 'section-2'] })
      const { collapseAllSections } = usePlanningStore.getState()

      collapseAllSections()

      expect(usePlanningStore.getState().expandedSections).toEqual([])
    })
  })

  describe('Task Selection', () => {
    it('selectTask() adds to selection', () => {
      const { selectTask } = usePlanningStore.getState()

      selectTask('task-1')

      expect(usePlanningStore.getState().selectedTaskIds).toContain('task-1')
    })

    it('deselectTask() removes from selection', () => {
      usePlanningStore.setState({ selectedTaskIds: ['task-1', 'task-2'] })
      const { deselectTask } = usePlanningStore.getState()

      deselectTask('task-1')

      const ids = usePlanningStore.getState().selectedTaskIds
      expect(ids).not.toContain('task-1')
      expect(ids).toContain('task-2')
    })

    it('toggleTaskSelection() toggles selection state', () => {
      const { toggleTaskSelection } = usePlanningStore.getState()

      // Add
      toggleTaskSelection('task-1')
      expect(usePlanningStore.getState().selectedTaskIds).toContain('task-1')

      // Remove
      toggleTaskSelection('task-1')
      expect(usePlanningStore.getState().selectedTaskIds).not.toContain('task-1')
    })

    it('clearTaskSelection() clears all selections', () => {
      usePlanningStore.setState({ selectedTaskIds: ['task-1', 'task-2'] })
      const { clearTaskSelection } = usePlanningStore.getState()

      clearTaskSelection()

      expect(usePlanningStore.getState().selectedTaskIds).toEqual([])
    })

    it('selectAllTasks() sets all task IDs', () => {
      const { selectAllTasks } = usePlanningStore.getState()

      selectAllTasks(['task-1', 'task-2', 'task-3'])

      expect(usePlanningStore.getState().selectedTaskIds).toEqual([
        'task-1',
        'task-2',
        'task-3',
      ])
    })
  })

  describe('resetPlanningState()', () => {
    it('restores defaults', () => {
      usePlanningStore.setState({
        activeTab: 'budget',
        taskView: 'board',
        expandedSections: ['section-1'],
        selectedTaskIds: ['task-1'],
      })

      const { resetPlanningState } = usePlanningStore.getState()
      resetPlanningState()

      const state = usePlanningStore.getState()
      expect(state.activeTab).toBe('checklist')
      expect(state.taskView).toBe('list')
      expect(state.expandedSections).toEqual([])
      expect(state.selectedTaskIds).toEqual([])
    })
  })

  describe('View Mode Setters', () => {
    it('setTaskView() changes task view', () => {
      const { setTaskView } = usePlanningStore.getState()

      setTaskView('board')

      expect(usePlanningStore.getState().taskView).toBe('board')
    })

    it('setBudgetView() changes budget view', () => {
      const { setBudgetView } = usePlanningStore.getState()

      setBudgetView('categories')

      expect(usePlanningStore.getState().budgetView).toBe('categories')
    })

    it('setGuestView() changes guest view', () => {
      const { setGuestView } = usePlanningStore.getState()

      setGuestView('tables')

      expect(usePlanningStore.getState().guestView).toBe('tables')
    })
  })

  describe('Sorting', () => {
    it('setTaskSort() updates task sort config', () => {
      const { setTaskSort } = usePlanningStore.getState()

      setTaskSort('priority', 'desc')

      expect(usePlanningStore.getState().taskSort).toEqual({
        field: 'priority',
        direction: 'desc',
      })
    })

    it('setGuestSort() updates guest sort config', () => {
      const { setGuestSort } = usePlanningStore.getState()

      setGuestSort('first_name', 'asc')

      expect(usePlanningStore.getState().guestSort).toEqual({
        field: 'first_name',
        direction: 'asc',
      })
    })
  })
})
