// Simple test script to verify the API endpoint
// Run with: node test-api.js

const testMessages = [
  {
    role: 'user',
    content: 'I want to create a survey about customer satisfaction for my restaurant.'
  }
];

async function testAPI() {
  try {
    console.log('Testing Magic Surveys API...');
    console.log('Sending message:', testMessages[0].content);
    
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: testMessages }),
    });

    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      return;
    }

    console.log('✅ API responded successfully!');
    console.log('Response status:', response.status);
    console.log('Content-Type:', response.headers.get('content-type'));
    
    // Check if it's a streaming response
    if (response.headers.get('content-type')?.includes('text/plain')) {
      console.log('📡 Streaming response detected');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      console.log('\n--- AI Response ---');
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        process.stdout.write(chunk);
      }
      console.log('\n--- End Response ---');
    } else {
      const text = await response.text();
      console.log('Response:', text);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nMake sure:');
    console.log('1. The development server is running (npm run dev)');
    console.log('2. ANTHROPIC_API_KEY is set in .env.local');
    console.log('3. The server is accessible at http://localhost:3000');
  }
}

// Check if we're running this script directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI }; 