const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';

// Test Google OAuth signup with profile data
async function testGoogleSignup() {
  try {
    console.log('Testing Google OAuth signup...');

    // Mock Google credential (this would normally come from Google OAuth)
    const mockCredential = 'mock-google-credential';

    // Test influencer signup
    const influencerPayload = {
      credential: mockCredential,
      role: 'influencer',
      profile: {
        socials: {
          instagram: '@test_influencer',
          tiktok: '@test_tiktok',
          youtube: 'https://youtube.com/@testchannel'
        }
      }
    };

    console.log('Testing influencer signup...');
    try {
      const response = await axios.post(`${API_URL}/google`, influencerPayload);
      console.log('Influencer signup response:', response.data);
    } catch (error) {
      console.log('Influencer signup error (expected in test):', error.response?.data?.message);
    }

    // Test brand signup
    const brandPayload = {
      credential: mockCredential,
      role: 'brand',
      brand: {
        website: 'https://testbrand.com'
      }
    };

    console.log('Testing brand signup...');
    try {
      const response = await axios.post(`${API_URL}/google`, brandPayload);
      console.log('Brand signup response:', response.data);
    } catch (error) {
      console.log('Brand signup error (expected in test):', error.response?.data?.message);
    }

  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testGoogleSignup();