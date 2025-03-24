"use client"

import { useRef, useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import html2canvas from "html2canvas"
import { fetchListeningStats, fetchTopArtists, fetchTopSongs } from "@/lib/api"
import { Skeleton } from "./ui/skeleton"


interface ShareCardProps {
  cardType: string
  onClose: () => void
}

interface StatsData {
  total_minutes_listened: number
  unique_songs: number
  unique_artists: number
  unique_albums: number
}

interface Artist {
  artist: string
  play_count: number
  total_minutes_listened: number
  track_art: string
}

interface Song {
  track: string
  artist: string
  play_count: number
  total_minutes: number
  track_art: string
}

export default function ShareCard({ cardType, onClose }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)

  const [stats, setStats] = useState<StatsData | null>(null)
  const [artists, setArtists] = useState<Artist[]>([])
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const getData = async () => {
      try {
        const data_stats = await fetchListeningStats()
        setStats(data_stats)

        const data_artists = await fetchTopArtists(1)
        setArtists(data_artists)
        console.log(data_artists)
        
        const data = await fetchTopSongs(1)
        setSongs(data)

      } catch (err) {
        setError("Failed to load listening stats")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    getData()
  }, [])

  const getCardTitle = () => {
    switch (cardType) {
      case "stats":
        return "My Year in Music"
      case "artists":
        return "My Top Artists"
      case "songs":
        return "My Top Songs"
      default:
        return "My Music Wrapped"
    }
  }

  const handleDownload = async () => {
    if (!cardRef.current) return

    setDownloading(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      })

      const image = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = image
      link.download = `music-wrapped-${cardType}.png`
      link.click()
    } catch (err) {
      console.error("Failed to download card:", err)
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return <Dialog open={true} onOpenChange={onClose}></Dialog>
  }

  if (error) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="bg-[#1F2937] border-2 border-[#4A5568] text-white max-w-md">
          <DialogHeader className="border-b-2 border-[#4A5568]">
            <DialogTitle className="font-['Comic_Sans_MS'] text-[#E2E8F0]">
              There was an error
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-[#1F2937] border-2 border-[#4A5568] text-white max-w-md">
        <DialogHeader className="border-b-2 border-[#4A5568]">
          <DialogTitle className="font-['Comic_Sans_MS'] text-[#E2E8F0]">
            ★ Share Your Wrapped ★
          </DialogTitle>
          <DialogDescription className="text-[#A0AEC0] italic">
            ·.¸¸.·♩♪♫ Share {getCardTitle().toLowerCase()} with friends ♫♪♩·.¸¸.·
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div
            ref={cardRef}
            className="bg-[#2D3748] border-2 border-[#4A5568] p-6 rounded-lg text-white relative overflow-hidden"
          >
            <h2 className="text-2xl font-['Comic_Sans_MS'] font-bold mb-2 text-[#93C5FD]">
              {getCardTitle()}
            </h2>
            <p className="text-[#A0AEC0] italic text-sm mb-4">
              ♫ {new Date().getFullYear()} Music Wrapped ♫
            </p>

            <div className="bg-[#374151] border border-[#4A5568] p-4 rounded-lg">
              {cardType === "stats" && (
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-2">
                    {stats ? (
                      <>
                        <p className="text-3xl font-['Comic_Sans_MS'] font-bold text-[#93C5FD]">{stats.total_minutes_listened}</p>
                        <p className="text-xs text-[#A0AEC0]">★ Minutes Listened ★</p>
                      </>
                    ) : (
                      <Skeleton className="h-4 w-24 mx-auto bg-white/20 mt-2" />
                    )}
                  </div>
                  <div className="p-2">
                    {stats ? (
                      <>
                        <p className="text-3xl font-['Comic_Sans_MS'] font-bold text-[#93C5FD]">{stats.unique_songs}</p>
                        <p className="text-xs text-[#A0AEC0]">★ Songs Played ★</p>
                      </>
                    ) : (
                      <Skeleton className="h-4 w-24 mx-auto bg-white/20 mt-2" />
                    )}
                  </div>
                  <div className="p-2">
                    {stats ? (
                      <>
                        <p className="text-3xl font-['Comic_Sans_MS'] font-bold text-[#93C5FD]">{stats.unique_artists}</p>
                        <p className="text-xs text-[#A0AEC0]">★ Artists Discovered ★</p>
                      </>
                    ) : (
                      <Skeleton className="h-4 w-24 mx-auto bg-white/20 mt-2" />
                    )}
                  </div>
                  <div className="p-2">
                    {stats ? (
                      <>
                        <p className="text-3xl font-['Comic_Sans_MS'] font-bold text-[#93C5FD]">{stats.unique_albums}</p>
                        <p className="text-xs text-[#A0AEC0]">★ Albums Explored ★</p>
                      </>
                    ) : (
                      <Skeleton className="h-4 w-24 mx-auto bg-white/20 mt-2" />
                    )}
                  </div>
                </div>
              )}

              {cardType === "artists" && (
                <div className="space-y-2">
                  <p className="text-sm font-['Comic_Sans_MS'] text-[#A0AEC0]">♫ Your #1 Artist ♫</p>
                  {artists ? (
                    <>
                      <p className="text-2xl font-['Comic_Sans_MS'] font-bold text-[#F472B6]">{artists[0].artist}</p>
                      <p className="text-sm text-[#A0AEC0]">{artists[0].play_count} plays · {Math.round(artists[0].total_minutes_listened)} minutes listened</p>
                    </>
                  ) : (
                    <Skeleton className="h-4 w-24 mx-auto bg-white/20 mt-2" />
                  )}
                </div>
              )}

              {cardType === "songs" && (
                <div className="space-y-2">
                  <p className="text-sm font-['Comic_Sans_MS'] text-[#A0AEC0]">♪ Your #1 Song ♪</p>
                  {songs ? (
                    <>
                      <p className="text-2xl font-['Comic_Sans_MS'] font-bold text-[#93C5FD]">{songs[0].track}</p>
                      <p className="text-sm text-[#A0AEC0]">{songs[0].artist} · {songs[0].play_count} plays · {Math.round(songs[0].total_minutes)} minutes listened</p>
                    </>
                  ) : (
                    <Skeleton className="h-4 w-24 mx-auto bg-white/20 mt-2" />
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 text-xs text-[#A0AEC0] text-center italic">
              mywrapped
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2 border-t-2 border-[#4A5568] pt-4">
          <Button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full bg-[#93C5FD] hover:bg-[#60A5FA] text-[#1F2937] font-['Comic_Sans_MS']"
          >
            <Download className="mr-2 h-4 w-4" />
            {downloading ? "Processing..." : "★ Download Image ★"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

