const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  errors?: any[]
}

class ApiClient {
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rewear_token')
    }
    return null
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`
    const token = this.getAuthToken()
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'API request failed',
          errors: data.errors,
        }
      }

      return data
    } catch (error) {
      console.error('API request error:', error)
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      }
    }
  }

  // Authentication endpoints
  async register(userData: {
    firstName: string
    lastName: string
    email: string
    password: string
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async getCurrentUser() {
    return this.request('/auth/me')
  }

  async forgotPassword(email: string) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async resetPassword(token: string, password: string) {
    return this.request(`/auth/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    })
  }

  async updateProfile(profileData: {
    firstName?: string
    lastName?: string
    location?: string
    bio?: string
  }) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    })
  }

  async changePassword(passwords: {
    currentPassword: string
    newPassword: string
  }) {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwords),
    })
  }

  // Items endpoints
  async getItems(params?: {
    page?: number
    limit?: number
    category?: string
    size?: string
    condition?: string
    minPoints?: number
    maxPoints?: number
    search?: string
    sort?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }
    
    const queryString = searchParams.toString()
    const endpoint = `/items${queryString ? `?${queryString}` : ''}`
    
    return this.request(endpoint)
  }

  async getItem(id: string) {
    return this.request(`/items/${id}`)
  }

  async createItem(itemData: FormData) {
    const token = this.getAuthToken()
    
    return this.request('/items', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type for FormData
      },
      body: itemData,
    })
  }

  async updateItem(id: string, itemData: any) {
    return this.request(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    })
  }

  async deleteItem(id: string) {
    return this.request(`/items/${id}`, {
      method: 'DELETE',
    })
  }

  async likeItem(id: string) {
    return this.request(`/items/${id}/like`, {
      method: 'POST',
    })
  }

  async addSwapRequest(id: string, message?: string) {
    return this.request(`/items/${id}/swap-request`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    })
  }

  async getTrendingItems() {
    return this.request('/items/trending')
  }

  async getItemsByCategory(category: string) {
    return this.request(`/items/category/${category}`)
  }

  // Users endpoints
  async getUserProfile(id: string) {
    return this.request(`/users/${id}`)
  }

  async getUserItems(id: string, params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }
    
    const queryString = searchParams.toString()
    const endpoint = `/users/${id}/items${queryString ? `?${queryString}` : ''}`
    
    return this.request(endpoint)
  }

  async getUserSwaps(id: string) {
    return this.request(`/users/${id}/swaps`)
  }

  async getPendingSwaps(id: string) {
    return this.request(`/users/${id}/pending-swaps`)
  }

  async updateAvatar(id: string, avatarUrl: string) {
    return this.request(`/users/${id}/avatar`, {
      method: 'PUT',
      body: JSON.stringify({ avatar: avatarUrl }),
    })
  }

  async getUserStats(id: string) {
    return this.request(`/users/${id}/stats`)
  }

  async getLeaderboard(params?: { type?: string; limit?: number }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }
    
    const queryString = searchParams.toString()
    const endpoint = `/users/leaderboard${queryString ? `?${queryString}` : ''}`
    
    return this.request(endpoint)
  }

  async searchUsers(params: { q: string; page?: number; limit?: number }) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })
    
    const queryString = searchParams.toString()
    const endpoint = `/users/search?${queryString}`
    
    return this.request(endpoint)
  }

  async updatePreferences(id: string, preferences: any) {
    return this.request(`/users/${id}/preferences`, {
      method: 'PUT',
      body: JSON.stringify(preferences),
    })
  }

  async deactivateAccount(id: string) {
    return this.request(`/users/${id}/deactivate`, {
      method: 'PUT',
    })
  }

  // Swaps endpoints
  async createSwap(swapData: {
    requestedItem: string
    offeredItem?: string
    swapType: string
    pointsInvolved?: number
    message?: string
  }) {
    return this.request('/swaps', {
      method: 'POST',
      body: JSON.stringify(swapData),
    })
  }

  async getSwaps(params?: { status?: string; page?: number; limit?: number }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }
    
    const queryString = searchParams.toString()
    const endpoint = `/swaps${queryString ? `?${queryString}` : ''}`
    
    return this.request(endpoint)
  }

  async getSwap(id: string) {
    return this.request(`/swaps/${id}`)
  }

  async updateSwapStatus(id: string, status: string) {
    return this.request(`/swaps/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  async addSwapMessage(id: string, message: string) {
    return this.request(`/swaps/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    })
  }

  async rateSwap(id: string, rating: number, comment?: string) {
    return this.request(`/swaps/${id}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    })
  }

  async getSwapStats() {
    return this.request('/swaps/stats')
  }

  async cancelSwap(id: string) {
    return this.request(`/swaps/${id}/cancel`, {
      method: 'PUT',
    })
  }

  // Health check
  async healthCheck() {
    return this.request('/health')
  }
}

export const apiClient = new ApiClient() 