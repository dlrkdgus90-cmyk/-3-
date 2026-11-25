import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-xl border border-dashed border-stone-600 bg-stone-900/60 p-10 text-center">
      <p className="text-3xl">🪨</p>
      <p className="mt-2 text-stone-300">이 루트는 존재하지 않거나 이미 철거되었습니다.</p>
      <Link href="/" className="mt-4 inline-block text-sm text-amber-300 hover:underline">
        ← 목록으로 돌아가기
      </Link>
    </div>
  );
}
