import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/analyze-food
 * Accepts a base64-encoded image and sends it to the Gemini API
 * to identify the food and estimate its calories.
 */
export async function POST(request: NextRequest) {
    try {
        const { image } = await request.json();

        if (!image) {
            return NextResponse.json(
                { error: 'No image provided' },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'GEMINI_API_KEY not configured' },
                { status: 500 }
            );
        }

        // Strip the data URL prefix if present
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

        // Call Gemini API with vision capability
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            {
                                text: `You are a nutritionist AI. Analyze this food photo and respond with ONLY a JSON object (no markdown, no backticks) in this exact format:
{
  "foods": [
    { "name": "food item name", "calories": estimated_calories_number, "portion": "estimated portion size" }
  ],
  "totalCalories": total_estimated_calories_number,
  "description": "brief one-line description of the meal"
}

Be specific about food items. Estimate calories based on visible portion sizes. If you can't identify the food clearly, make your best guess and note it in the description.`
                            },
                            {
                                inlineData: {
                                    mimeType: 'image/jpeg',
                                    data: base64Data
                                }
                            }
                        ]
                    }]
                }),
            }
        );

        if (!response.ok) {
            const errText = await response.text();
            console.error('Gemini API error:', errText);
            return NextResponse.json(
                { error: 'Failed to analyze image' },
                { status: 500 }
            );
        }

        const data = await response.json();
        const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textContent) {
            return NextResponse.json(
                { error: 'No response from AI' },
                { status: 500 }
            );
        }

        // Parse the JSON response from Gemini
        const cleanedText = textContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const analysis = JSON.parse(cleanedText);

        return NextResponse.json(analysis);
    } catch (error) {
        console.error('Food analysis error:', error);
        return NextResponse.json(
            { error: 'Failed to analyze food' },
            { status: 500 }
        );
    }
}
