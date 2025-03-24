"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { setToken } from "@/lib/auth"

export default function LoginForm() {
  const [token, setTokenValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validate token by making a test request
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TINYBIRD_API_URL}/listening_stats.json?token=${token}`,
      )

      if (!response.ok) {
        throw new Error("Invalid token. Please check and try again.")
      }

      // Store token and redirect
      setToken(token)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to validate token")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="token" className="text-[#E2E8F0] font-['Comic_Sans_MS']">
          ♫ Tinybird Token ♫
        </Label>
        <Input
          id="token"
          type="password"
          placeholder="Enter your TB_TOKEN"
          value={token}
          onChange={(e) => setTokenValue(e.target.value)}
          required
          className="bg-[#2D3748] border-[#4A5568] text-[#E2E8F0] placeholder:text-[#A0AEC0] focus:ring-[#93C5FD]"
        />
        {error && <p className="text-red-300 text-sm font-['Comic_Sans_MS']">{error}</p>}
      </div>
      <Button 
        type="submit" 
        className="w-full bg-[#93C5FD] hover:bg-[#60A5FA] text-[#1F2937] font-['Comic_Sans_MS']" 
        disabled={loading}
      >
        {loading ? "Validating..." : "★ Continue to Wrapped ★"}
      </Button>
      <p className="text-xs text-[#A0AEC0] text-center mt-4 italic">
        Your token is stored locally and is only used to access your listening data.
      </p>
    </form>
  )
}

