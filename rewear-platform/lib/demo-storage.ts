// Demo storage for items when backend is not available
export interface DemoItem {
  _id: string
  title: string
  description: string
  category: string
  type?: string
  size: string
  condition: string
  tags: string[]
  images: string[]
  points: number
  location: string
  userId: string
  createdAt: string
  user?: {
    _id: string
    firstName: string
    lastName: string
    avatar?: string
  }
}

class DemoStorage {
  private getItemsKey() {
    return 'rewear_demo_items'
  }

  private getUserId() {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('rewear_user')
      if (userStr) {
        const user = JSON.parse(userStr)
        return user.id
      }
    }
    return null
  }

  // Get all items
  getItems(): DemoItem[] {
    if (typeof window === 'undefined') return []
    
    const itemsStr = localStorage.getItem(this.getItemsKey())
    if (itemsStr) {
      return JSON.parse(itemsStr)
    }
    return []
  }

  // Get items by user
  getUserItems(userId: string): DemoItem[] {
    const allItems = this.getItems()
    return allItems.filter(item => item.userId === userId)
  }

  // Create new item
  createItem(itemData: Omit<DemoItem, '_id' | 'createdAt'>): DemoItem {
    const newItem: DemoItem = {
      ...itemData,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    const items = this.getItems()
    items.unshift(newItem) // Add to beginning
    localStorage.setItem(this.getItemsKey(), JSON.stringify(items))

    return newItem
  }

  // Delete item
  deleteItem(itemId: string, userId: string): boolean {
    const items = this.getItems()
    const filteredItems = items.filter(item => !(item._id === itemId && item.userId === userId))
    
    if (filteredItems.length !== items.length) {
      localStorage.setItem(this.getItemsKey(), JSON.stringify(filteredItems))
      return true
    }
    return false
  }

  // Update item
  updateItem(itemId: string, userId: string, updates: Partial<DemoItem>): DemoItem | null {
    const items = this.getItems()
    const itemIndex = items.findIndex(item => item._id === itemId && item.userId === userId)
    
    if (itemIndex !== -1) {
      items[itemIndex] = { ...items[itemIndex], ...updates }
      localStorage.setItem(this.getItemsKey(), JSON.stringify(items))
      return items[itemIndex]
    }
    return null
  }

  // Search items
  searchItems(query: string): DemoItem[] {
    const items = this.getItems()
    const searchTerm = query.toLowerCase()
    
    return items.filter(item => 
      item.title.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }

  // Filter items
  filterItems(filters: {
    category?: string
    size?: string
    condition?: string
    minPoints?: number
    maxPoints?: number
  }): DemoItem[] {
    let items = this.getItems()
    
    if (filters.category) {
      items = items.filter(item => item.category.toLowerCase() === filters.category!.toLowerCase())
    }
    
    if (filters.size) {
      items = items.filter(item => item.size === filters.size)
    }
    
    if (filters.condition) {
      items = items.filter(item => item.condition === filters.condition)
    }
    
    if (filters.minPoints) {
      items = items.filter(item => item.points >= filters.minPoints!)
    }
    
    if (filters.maxPoints) {
      items = items.filter(item => item.points <= filters.maxPoints!)
    }
    
    return items
  }
}

export const demoStorage = new DemoStorage() 