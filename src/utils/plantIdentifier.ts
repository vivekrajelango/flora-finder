import { GoogleGenerativeAI } from '@google/generative-ai'

console.log('All environment variables:', process.env.GOOGLE_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string)
// const genAI = new GoogleGenerativeAI('AIzaSyDuDoXgeJVFzKQoCuHScrj8gWkj4OHORBk')


export async function identifyPlant(imageFile: File) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const imageParts:any = [
      {
        inlineData: {
          data: await fileToGenerativePart(imageFile),
          mimeType: imageFile.type,
        },
      },
    ]

    const result = await model.generateContent([
      'Identify this plant and provide the name, scientific name and brief description. Return the information in json format with name, scientificName, family and description.',
      ...imageParts,
    ])

    const response = await result.response;
    const text = response.text()
    
    console.log('API Response:', text);  // Log the raw API response

    try {
      const cleanedText = text
        .replace(/```json\n/, '')  // Remove the starting ```json\n
        .replace(/\n```/, '')      // Remove the ending \n```
        .trim();                   // Trim any leading/trailing whitespace

      const parsedData = JSON.parse(cleanedText); 
      return parsedData;
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return { error: 'Failed to parse plant information', details: text };
    }
  } catch (apiError:any) {
    console.error('API Error:', apiError);
    return { error: 'API request failed', details: apiError.message };
  }
}

async function fileToGenerativePart(file: File) {
  return new Promise((resolve) => {
    const reader:any = new FileReader()
    reader.onloadend = () => resolve(reader.result.toString().split(',')[1])
    reader.readAsDataURL(file)
  })
}