"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share2, Music } from "lucide-react"
import { fetchTopSongs } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

interface TopSongsProps {
  onShare: () => void
}

interface Song {
  track: string
  artist: string
  play_count: number
  total_minutes: number
  track_art: string
}

export default function TopSongs({ onShare }: TopSongsProps) {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const getSongs = async () => {
      try {
        const data = await fetchTopSongs(10)
        setSongs(data)
      } catch (err) {
        setError("Failed to load top songs")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    getSongs()
  }, [])

  if (loading) {
    return <SongsCardSkeleton />
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
            ♪ My Top Songs ♪
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onShare} className="text-[#E2E8F0] hover:bg-[#4A5568]">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
        <CardDescription className="text-[#A0AEC0] italic">
          ·.¸¸.·♩♪♫ The soundtrack to my year ♫♪♩·.¸¸.·
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 bg-[#111827]">
        <div className="space-y-3">
          {songs.map((song, index) => (
            <SongItem
              key={`${song.track}-${song.artist}-${index}`}
              rank={index + 1}
              title={song.track}
              artist={song.artist}
              playCount={song.play_count}
              trackArt={song.track_art}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function SongItem({
  rank,
  title,
  artist,
  playCount,
  trackArt,
}: {
  rank: number
  title: string
  artist: string
  playCount: number
  trackArt?: string
}) {
  return (
    <div className="flex items-center p-3 bg-[#2D3748] border border-[#4A5568] rounded hover:bg-[#374151] transition-colors">
      <div className="text-xl font-bold w-8 text-center text-[#93C5FD]">#{rank}</div>
      <div className="w-10 h-10 border-2 border-[#4A5568] flex items-center justify-center mx-3 overflow-hidden">
        {trackArt ? (
          <Image
            src={trackArt}
            alt={`${title} artwork`}
            width={40}
            height={40}
            className="object-cover"
          />
        ) : (
          <Music className="h-5 w-5 text-[#93C5FD]" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-['Comic_Sans_MS'] text-base text-[#93C5FD] line-clamp-1 hover:underline cursor-pointer">
          {title}
        </h3>
        <p className="text-xs text-[#A0AEC0] line-clamp-1">by {artist}</p>
      </div>
      <div className="text-sm text-[#A0AEC0] ml-2">♫ {playCount} plays</div>
    </div>
  )
}

function SongsCardSkeleton() {
  return (
    <Card className="bg-black/20 backdrop-blur-lg border-none text-white">
      <CardHeader>
        <Skeleton className="h-8 w-3/4 bg-white/20" />
        <Skeleton className="h-4 w-1/2 bg-white/20 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center p-3 bg-white/10 rounded-lg">
              <Skeleton className="h-6 w-6 bg-white/20 rounded-full" />
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

