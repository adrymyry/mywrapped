"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { fetchListeningStats } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

interface ListeningStatsProps {
  onShare: () => void
}

interface StatsData {
  total_minutes_listened: number
  unique_songs: number
  unique_artists: number
  unique_albums: number
}

export default function ListeningStats({ onShare }: ListeningStatsProps) {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const getStats = async () => {
      try {
        const data = await fetchListeningStats()
        setStats(data)
      } catch (err) {
        setError("Failed to load listening stats")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    getStats()
  }, [])

  if (loading) {
    return <StatsCardSkeleton />
  }

  if (error) {
    return (
      <Card className="bg-black/20 backdrop-blur-lg border-none text-white">
        <CardContent className="pt-6">
          <p className="text-center text-red-300">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-[#1F2937] border-2 border-[#4A5568] text-white shadow-lg">
      <CardHeader className="bg-gradient-to-b from-[#2D3748] to-[#1F2937] border-b-2 border-[#4A5568]">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-[#E2E8F0] font-['Comic_Sans_MS']">
            ✧ My Music Stats ✧
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onShare} className="text-[#E2E8F0] hover:bg-[#4A5568]">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
        <CardDescription className="text-[#A0AEC0] italic">
          ·.¸¸.·♩♪♫ Here is how my {new Date().getFullYear()} sounded ♫♪♩·.¸¸.·
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 bg-[#111827]">
        <div className="grid grid-cols-2 gap-4">
          <StatItem value={stats?.total_minutes_listened || 0} label="Minutes Listened" />
          <StatItem value={stats?.unique_songs || 0} label="Unique Songs" />
          <StatItem value={stats?.unique_artists || 0} label="Artists Discovered" />
          <StatItem value={stats?.unique_albums || 0} label="Albums Explored" />
        </div>
      </CardContent>
    </Card>
  )
}

function StatItem({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  return (
    <div className="text-center p-4 bg-[#2D3748] border border-[#4A5568] rounded hover:bg-[#374151] transition-colors">
      <p className="text-3xl font-['Comic_Sans_MS'] font-bold mb-1 text-[#93C5FD]">
        {value.toLocaleString()}
        {suffix && suffix}
      </p>
      <p className="text-sm text-[#A0AEC0]">★ {label} ★</p>
    </div>
  )
}

function StatsCardSkeleton() {
  return (
    <Card className="bg-black/20 backdrop-blur-lg border-none text-white">
      <CardHeader>
        <Skeleton className="h-8 w-3/4 bg-white/20" />
        <Skeleton className="h-4 w-1/2 bg-white/20 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 bg-white/10 rounded-lg">
              <Skeleton className="h-10 w-20 mx-auto bg-white/20" />
              <Skeleton className="h-4 w-24 mx-auto bg-white/20 mt-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

