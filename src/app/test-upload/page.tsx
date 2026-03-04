"use client";

import { useState } from "react";
import { Camera, Upload, Loader2, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function TestUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!preview) {
      toast.error("Veuillez sélectionner une image");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://afrinutri-backend.vercel.app';
      const response = await fetch(
        `${apiUrl}/nutrition/test-upload`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: preview,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      toast.success("Analyse terminée !");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            🧪 Test Upload - AfriNutri
          </h1>
          <p className="text-gray-600">
            Page temporaire pour tester l'upload et l'analyse d'images
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            1. Sélectionner une image
          </h2>

          <div className="space-y-4">
            {/* File Input */}
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-48 rounded-lg"
                  />
                ) : (
                  <>
                    <Upload className="w-12 h-12 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Cliquez pour uploader</span> ou
                      glissez-déposez
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG</p>
                  </>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </label>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!preview || loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Camera size={20} />
                  Analyser l'image
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="text-green-600" size={24} />
              ) : (
                <XCircle className="text-red-600" size={24} />
              )}
              2. Résultats de l'analyse
            </h2>

            {result.analysis && (
              <div className="space-y-4">
                {/* Dish Info */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg text-green-800 mb-2">
                    {result.analysis.dishName}
                  </h3>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-600">
                      Confiance: <strong>{result.analysis.confidence}%</strong>
                    </span>
                    <span className="text-gray-600">
                      Poids estimé: <strong>{result.analysis.estimatedWeight}g</strong>
                    </span>
                  </div>
                  {result.analysis.productBrand && (
                    <p className="text-sm text-gray-600 mt-2">
                      Marque: <strong>{result.analysis.productBrand}</strong>
                    </p>
                  )}
                  {result.analysis.barcode && (
                    <p className="text-sm text-gray-600">
                      Code-barres: <strong>{result.analysis.barcode}</strong>
                    </p>
                  )}
                </div>

                {/* Nutrition Values */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-600">Calories</p>
                    <p className="text-xl font-bold text-blue-700">
                      {result.analysis.calories}
                    </p>
                    <p className="text-xs text-gray-500">kcal/100g</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-600">Protéines</p>
                    <p className="text-xl font-bold text-red-700">
                      {result.analysis.protein}g
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-600">Glucides</p>
                    <p className="text-xl font-bold text-yellow-700">
                      {result.analysis.carbs}g
                    </p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-600">Lipides</p>
                    <p className="text-xl font-bold text-orange-700">
                      {result.analysis.fat}g
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-600">Fibres</p>
                    <p className="text-xl font-bold text-green-700">
                      {result.analysis.fiber}g
                    </p>
                  </div>
                </div>

                {/* Ingredients */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Ingrédients principaux:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.analysis.mainIngredients?.map(
                      (ing: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {ing}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Tous les ingrédients:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.analysis.ingredients?.map(
                      (ing: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {ing}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Data Sources */}
                {result.analysis.dataSources && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                      Sources de données:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.analysis.dataSources.map(
                        (source: string, idx: number) => (
                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                          >
                            {source}
                          </span>
                        )
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Enrichi: {result.analysis.enriched ? "✅ Oui" : "❌ Non"}
                    </p>
                  </div>
                )}

                {/* Scan Info */}
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <p className="text-gray-600">
                    Scan ID: <code className="bg-gray-200 px-2 py-1 rounded">{result.scanId}</code>
                  </p>
                  <p className="text-gray-600">
                    Sauvegardé: {result.saved ? "✅ Oui" : "❌ Non"}
                  </p>
                  <p className="text-gray-600">
                    User ID: <code className="bg-gray-200 px-2 py-1 rounded">{result.userId}</code>
                  </p>
                </div>

                {/* Raw JSON */}
                <details className="bg-gray-50 p-3 rounded-lg">
                  <summary className="cursor-pointer font-semibold text-gray-800 mb-2">
                    📄 Données brutes (JSON)
                  </summary>
                  <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
