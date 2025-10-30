"use client"

import { useState } from "react"
import { ERPClient } from "@/lib/erp-client"

export default function ERPTestPage() {
  const [apiKey, setApiKey] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("+1234567890")
  const [message, setMessage] = useState("Hello from ERP system!")
  const [testType, setTestType] = useState<"connection" | "message" | "full">("connection")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showApiKeyHelp, setShowApiKeyHelp] = useState(true)

  const client = new ERPClient()

  const handleSendMessage = async () => {
    if (!apiKey) {
      setError("Please enter your API key first")
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await client.sendMessage({
        apiKey,
        to: phoneNumber,
        message,
        messageType: "text",
        priority: "medium",
      })

      setResult({
        type: "send",
        data: response,
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleTest = async () => {
    if (!apiKey) {
      setError("Please enter your API key first")
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await client.test({
        apiKey,
        to: phoneNumber,
        testType,
      })

      setResult({
        type: "test",
        data: response,
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGetStatus = async () => {
    if (!apiKey) {
      setError("Please enter your API key first")
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await client.getStatus()
      setResult({
        type: "status",
        data: response,
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const generateTestKey = () => {
    const key = "erp_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    setApiKey(key)
    setShowApiKeyHelp(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ERP Integration Tester</h1>
          <p className="text-gray-600 mb-8">Test your WhatsApp API integration from your ERP system</p>

          {showApiKeyHelp && (
            <div className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-amber-900 mb-3">Setup Required: API Key</h3>
                  <div className="space-y-2 text-sm text-amber-800">
                    <p>
                      <strong>What is an API Key?</strong> A security token that authenticates requests to your ERP
                      endpoints.
                    </p>
                    <p>
                      <strong>Where to get it?</strong>
                    </p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>
                        Go to the <strong>Vars</strong> section in the v0 sidebar
                      </li>
                      <li>
                        Add a new variable: <code className="bg-white px-2 py-1 rounded">ERP_API_KEY</code>
                      </li>
                      <li>Set any secure value (e.g., a random string or generated key)</li>
                      <li>Copy that value and paste it below</li>
                    </ol>
                    <p className="mt-3">
                      <strong>For Testing:</strong> Click "Generate Test Key" below to create a temporary key
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowApiKeyHelp(false)}
                  className="text-amber-600 hover:text-amber-800 text-xl"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Configuration Panel */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700">Configuration</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your ERP_API_KEY from Vercel Vars"
                />
                <button
                  onClick={generateTestKey}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Generate Test Key
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1234567890"
                />
                <p className="text-xs text-gray-500 mt-1">Format: +[country code][number]</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Enter your message"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Test Type</label>
                <select
                  value={testType}
                  onChange={(e) => setTestType(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="connection">Connection Test</option>
                  <option value="message">Message Test</option>
                  <option value="full">Full Test</option>
                </select>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700">Actions</h2>

              <button
                onClick={handleSendMessage}
                disabled={loading || !apiKey}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

              <button
                onClick={handleTest}
                disabled={loading || !apiKey}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                {loading ? "Testing..." : "Run Test"}
              </button>

              <button
                onClick={handleGetStatus}
                disabled={loading || !apiKey}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                {loading ? "Loading..." : "Get API Status"}
              </button>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-semibold">Error</p>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Results Panel */}
          {result && (
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Response</h2>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          )}

          {/* Documentation */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">API Documentation</h3>
            <div className="space-y-4 text-sm text-blue-800">
              <div>
                <p className="font-semibold">Send Message Endpoint</p>
                <code className="bg-white p-2 rounded block mt-1 text-xs overflow-auto">
                  POST /api/erp/send-message
                </code>
              </div>
              <div>
                <p className="font-semibold">Test Endpoint</p>
                <code className="bg-white p-2 rounded block mt-1 text-xs overflow-auto">POST /api/erp/test</code>
              </div>
              <div>
                <p className="font-semibold">Status Endpoint</p>
                <code className="bg-white p-2 rounded block mt-1 text-xs overflow-auto">
                  GET /api/erp/message-status/:messageId
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
