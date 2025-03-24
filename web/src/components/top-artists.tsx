"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { fetchTopArtists } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

interface TopArtistsProps {
  onShare: () => void
}

interface Artist {
  artist: string
  play_count: number
  total_minutes_listened: number
  track_art: string
}

export default function TopArtists({ onShare }: TopArtistsProps) {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const getArtists = async () => {
      try {
        const data = await fetchTopArtists(5)
        // Ensure we have valid data before setting state
        if (Array.isArray(data) && data.length > 0) {
          setArtists(data)
        } else {
          // If we get an empty array or invalid data, set a meaningful error
          setError("No artist data available")
          console.warn("Received empty or invalid artist data:", data)
        }
      } catch (err) {
        setError("Failed to load top artists")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    getArtists()
  }, [])

  if (loading) {
    return <ArtistsCardSkeleton />
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
            ★ My Top Artists ★
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onShare} className="text-[#E2E8F0] hover:bg-[#4A5568]">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
        <CardDescription className="text-[#A0AEC0] italic">
          {/* ASCII art banner */}
          ·.¸¸.·♩♪♫ The artists that defined my year ♫♪♩·.¸¸.·
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 bg-[#111827]">
        <div className="space-y-3">
          {artists.map((artist, index) => (
            <ArtistItem
              key={`${artist.artist}-${index}`}
              rank={index + 1}
              name={artist.artist}
              artist_art={artist.track_art}
              playCount={artist.play_count}
              minutes={artist.total_minutes_listened}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ArtistItem({
  rank,
  name,
  artist_art,
  playCount,
  minutes,
}: {
  rank: number
  name: string
  artist_art: string
  playCount: number
  minutes: number
}) {
  return (
    <div className="flex items-center p-3 bg-[#2D3748] border border-[#4A5568] rounded hover:bg-[#374151] transition-colors">
      <div className="text-xl font-bold w-8 text-center text-[#F472B6]">#{rank}</div>
      <div className="relative w-12 h-12 border-2 border-[#4A5568] overflow-hidden mx-3">
        <Image
          src={artist_art || `/placeholder.svg?height=40&width=40&text=${name ? name.charAt(0) : "?"}`}
          alt={name || "Unknown Artist"}
          width={40}
          height={40}
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-['Comic_Sans_MS'] text-lg text-[#F472B6] line-clamp-1 hover:underline cursor-pointer">
          {name || "Unknown Artist"}
        </h3>
        <p className="text-xs text-[#A0AEC0]">
          ♫ {playCount || 0} plays · {Math.round((minutes || 0))} minutes listened ♫
        </p>
      </div>
    </div>
  )
}

function ArtistsCardSkeleton() {
  return (
    <Card className="bg-black/20 backdrop-blur-lg border-none text-white">
      <CardHeader>
        <Skeleton className="h-8 w-3/4 bg-white/20" />
        <Skeleton className="h-4 w-1/2 bg-white/20 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center p-3 bg-white/10 rounded-lg">
              <Skeleton className="h-8 w-8 bg-white/20 rounded-full" />
              <div className="ml-4 flex-1">
                <Skeleton className="h-5 w-3/4 bg-white/20" />
                <Skeleton className="h-3 w-1/2 bg-white/20 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

