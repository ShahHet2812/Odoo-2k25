// Simple test script to verify backend API
const API_BASE_URL = 'http://localhost:5000/api'

async function testBackend() {
  console.log('Testing backend API...')
  
  try {
    // Test health check
    const healthResponse = await fetch(`${API_BASE_URL}/health`)
    const healthData = await healthResponse.json()
    console.log('Health check:', healthData)
    
    // Test items endpoint
    const itemsResponse = await fetch(`${API_BASE_URL}/items`)
    const itemsData = await itemsResponse.json()
    console.log('Items endpoint:', itemsData)
    
    console.log('Backend is working! ✅')
  } catch (error) {
    console.error('Backend test failed:', error)
  }
}

testBackend() 