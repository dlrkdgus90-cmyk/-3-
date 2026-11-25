import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "BETA BOARD · 클라이머 게시판",
  description: "클라이머들의 등반 일지와 베타 공유 게시판",
};

// 벽에 붙은 홀드처럼 보이는 장식용 점
const HOLDS = [
  "top-6 left-[8%] h-4 w-5 bg-amber-400/70 rounded-[60%_40%_55%_45%]",
  "top-14 left-[22%] h-3 w-3 bg-lime-400/60 rounded-full",
  "top-4 left-[46%] h-5 w-4 bg-rose-400/60 rounded-[40%_60%_45%_55%]",
  "top-16 left-[68%] h-3 w-4 bg-sky-400/60 rounded-[55%_45%_60%_40%]",
  "top-8 left-[88%] h-4 w-4 bg-violet-400/60 rounded-[45%_55%_40%_60%]",
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-stone-950 text-stone-100 antialiased [background-image:radial-gradient(circle_at_20%_10%,rgba(120,113,108,0.25),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(87,83,78,0.25),transparent_45%),radial-gradient(circle_at_40%_90%,rgba(68,64,60,0.3),transparent_40%)]">
        <header className="relative overflow-hidden border-b border-stone-700/60 bg-gradient-to-b from-stone-800 to-stone-900">
          {HOLDS.map((cls) => (
            <span key={cls} aria-hidden className={`absolute shadow-md ${cls}`} />
          ))}
          <div className="relative mx-auto max-w-3xl px-5 py-10">
            <Link href="/" className="group inline-block">
              <p className="text-xs font-semibold tracking-[0.3em] text-amber-400">CLIMB · SEND · SHARE</p>
              <h1 className="mt-1 text-4xl font-black tracking-tight text-stone-50 group-hover:text-amber-300">
                ⛰️ BETA BOARD
              </h1>
              <p className="mt-2 text-sm text-stone-400">클라이머들의 등반 일지 · 루트 베타 공유 게시판</p>
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-5 py-8">{children}</main>

        <footer className="mx-auto max-w-3xl px-5 pb-10 pt-4 text-center text-xs text-stone-500">
          🧗 Climb safe — 출발 전 매듭과 확보를 꼭 확인하세요.
        </footer>
      </body>
    </html>
  );
}
