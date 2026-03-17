import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { fullName, email, phone, panCard } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !panCard) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // TODO: Replace this with your actual credit score API integration
    // Example integrations:
    // - CIBIL TransUnion API
    // - Experian API
    // - Equifax API
    // - CRIF High Mark API
    
    // For now, using environment variable to control behavior
    const useRealAPI = process.env.USE_REAL_CREDIT_API === 'true';
    
    if (useRealAPI) {
      // Real API integration example (replace with actual API)
      const apiResponse = await fetch(process.env.CREDIT_SCORE_API_URL!, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CREDIT_SCORE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName,
          email: email,
          phone: phone,
          pan: panCard,
        }),
      });

      const apiData = await apiResponse.json();
      
      if (!apiResponse.ok) {
        throw new Error(apiData.message || 'Credit score API failed');
      }

      return res.status(200).json({
        success: true,
        creditScore: apiData.score, // Adjust based on your API response structure
        message: 'Credit score fetched successfully'
      });
    } else {
      // Fallback to simulated score for testing
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      const simulatedScore = Math.floor(Math.random() * (850 - 650 + 1)) + 650;
      
      return res.status(200).json({
        success: true,
        creditScore: simulatedScore,
        message: 'Credit score generated (simulated)'
      });
    }

  } catch (error) {
    console.error('Credit score API error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch credit score' 
    });
  }
}