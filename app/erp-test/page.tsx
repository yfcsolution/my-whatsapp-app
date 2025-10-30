"use client"

import { useState } from "react"
import { ERPClient } from "@/lib/erp-client"

export default function ERPTestPage() {
  const [apiKey, setApiKey] = useState("erp-test-key-123")
  const [phoneNumber, setPhoneNumber] = useState("+1234567890")
  const [message, setMessage] = useState("Hello from ERP system!")
  const [testType, setTestType] = useState<"connection" | "message" | "full">("connection")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const client = new ERPClient()

  const handleSendMessage = async () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ERP Integration Tester</h1>
          <p className="text-gray-600 mb-8">Test your WhatsApp API integration from your ERP system</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Configuration Panel */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700">Configuration</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your API key"
                />
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
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

              <button
                onClick={handleTest}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                {loading ? "Testing..." : "Run Test"}
              </button>

              <button
                onClick={handleGetStatus}
                disabled={loading}
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
                <code className="bg-white p-2 rounded block mt-1">POST /api/erp/send-message</code>
              </div>
              <div>
                <p className="font-semibold">Test Endpoint</p>
                <code className="bg-white p-2 rounded block mt-1">POST /api/erp/test</code>
              </div>
              <div>
                <p className="font-semibold">Status Endpoint</p>
                <code className="bg-white p-2 rounded block mt-1">GET /api/erp/message-status/:messageId</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
