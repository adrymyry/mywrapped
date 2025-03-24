"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import ListeningStats from "@/components/listening-stats"
import TopArtists from "@/components/top-artists"
import TopSongs from "@/components/top-songs"
import ShareCard from "@/components/share-card"
import { getToken } from "@/lib/auth"

export default function Dashboard() {
  const router = useRouter()
  const [activeCard, setActiveCard] = useState<string | null>(null)
  const [showShare, setShowShare] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push("/")
    }
  }, [router])

  const handleShare = (cardId: string) => {
    setActiveCard(cardId)
    setShowShare(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("tb_token")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-[#111827]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-['Verdana'] font-bold text-[#E2E8F0]">
            mywrapped
          </h1>
          <Button variant="ghost" className="text-[#E2E8F0] hover:bg-[#374151]" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#1F2937] border-2 border-[#4A5568]">
            <TabsTrigger value="stats" className="text-[#E2E8F0] font-['Comic_Sans_MS'] data-[state=active]:bg-[#374151]">
              ♫ Overview ♫
            </TabsTrigger>
            <TabsTrigger value="artists" className="text-[#E2E8F0] font-['Comic_Sans_MS'] data-[state=active]:bg-[#374151]">
              ★ Top Artists ★
            </TabsTrigger>
            <TabsTrigger value="songs" className="text-[#E2E8F0] font-['Comic_Sans_MS'] data-[state=active]:bg-[#374151]">
              ♪ Top Songs ♪
            </TabsTrigger>
          </TabsList>
          <TabsContent value="stats">
            <ListeningStats onShare={() => handleShare("stats")} />
          </TabsContent>
          <TabsContent value="artists">
            <TopArtists onShare={() => handleShare("artists")} />
          </TabsContent>
          <TabsContent value="songs">
            <TopSongs onShare={() => handleShare("songs")} />
          </TabsContent>
        </Tabs>

        {showShare && <ShareCard cardType={activeCard!} onClose={() => setShowShare(false)} />}
      </div>
    </div>
  )
}

