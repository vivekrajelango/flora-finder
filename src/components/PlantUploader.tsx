'use client'

import { useState } from 'react'
import Image from 'next/image'
import { identifyPlant } from '../utils/plantIdentifier'

export default function PlantUploader() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [plantInfo, setPlantInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setSelectedImage(e.target.result as string);
        }
      }
      reader.readAsDataURL(file)

      setLoading(true)
      setError(null)
      try {
        const result = await identifyPlant(file);
        if (result.error) {
          throw new Error(`${result.error}: ${result.details}`);
        }
        setPlantInfo(result);
      } catch (error:any) {
        console.error('Error identifying plant:', error)
        setError(error.message || 'Failed to identify plant. Please try again.')
      }
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-4">
        <label htmlFor="plant-image" className="block text-sm font-medium text-gray-700 mb-2">
          Upload a plant image
        </label>
        <input
          type="file"
          id="plant-image"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full px-3 py-2 text-sm text-gray-700 border rounded-lg focus:outline-none focus:border-green-500"
        />
      </div>
      {loading && <p className="text-center">Identifying plant...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {selectedImage && (
        <div className="mt-4">
          <Image src={selectedImage} alt="Selected plant" width={300} height={300} className="rounded-lg" />
        </div>
      )}
      {plantInfo && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">{plantInfo.name}</h2>
          <p><strong>Scientific Name:</strong> {plantInfo.scientificName}</p>
          <p><strong>Family:</strong> {plantInfo.family}</p>
          <p className="mt-2">{plantInfo.description}</p>
        </div>
      )}
    </div>
  )
}