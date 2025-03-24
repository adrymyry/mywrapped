import LoginForm from "@/components/login-form"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#111827] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1F2937] border-2 border-[#4A5568] rounded-xl p-6 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-['Verdana'] font-bold text-[#E2E8F0] mb-2">
            mywrapped
          </h1>
          <p className="text-[#A0AEC0] italic">
            ·♩♪♫ Discover your listening habits ♫♪♩·
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

