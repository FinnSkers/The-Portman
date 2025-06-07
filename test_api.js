// Test API integration
const API_BASE_URL = 'http://localhost:8000/api/v1';

async function testAnalyticsAPI() {
  try {
    console.log('Testing Analytics API...');
    
    // Test dashboard endpoint
    const dashboardResponse = await fetch(`${API_BASE_URL}/analytics/dashboard`);
    const dashboardData = await dashboardResponse.json();
    console.log('Dashboard data:', dashboardData);
    
    // Test metrics endpoint
    const metricsResponse = await fetch(`${API_BASE_URL}/analytics/metrics`);
    const metricsData = await metricsResponse.json();
    console.log('Metrics data:', metricsData);
    
    // Test engagement endpoint
    const engagementResponse = await fetch(`${API_BASE_URL}/analytics/engagement`);
    const engagementData = await engagementResponse.json();
    console.log('Engagement data:', engagementData);
    
    console.log('All API tests passed!');
  } catch (error) {
    console.error('API test failed:', error);
  }
}

testAnalyticsAPI();
