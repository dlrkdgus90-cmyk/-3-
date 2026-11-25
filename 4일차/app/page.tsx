import Link from "next/link";
import { connection } from "next/server";
import { formatDate, listPosts } from "@/lib/posts";

const HOLD_COLORS = ["bg-amber-400", "bg-lime-400", "bg-rose-400", "bg-sky-400", "bg-violet-400"];

export default async function HomePage() {
  await connection(); // 매 요청마다 최신 글 목록을 읽도록 함
  const posts = await listPosts();

  return (
    <section>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">🪨 등반 기록</h2>
          <p className="text-sm text-stone-400">총 {posts.length}개의 루트가 기록되었습니다</p>
        </div>
        <Link
          href="/posts/new"
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-stone-950 shadow hover:bg-amber-400"
        >
          + 새 기록 남기기
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-600 bg-stone-900/60 p-10 text-center text-stone-400">
          <p className="text-3xl">🧗</p>
          <p className="mt-2">아직 아무도 오르지 않은 벽입니다.</p>
          <p className="text-sm">첫 등반 기록을 남겨보세요!</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {posts.map((post, i) => (
            <li key={post.id}>
              <Link
                href={`/posts/${post.id}`}
                className="flex items-center gap-4 rounded-xl border border-stone-700 bg-stone-900/70 p-4 transition hover:-translate-y-0.5 hover:border-amber-500/70"
              >
                <span
                  aria-hidden
                  className={`h-4 w-4 shrink-0 rounded-[55%_45%_60%_40%] shadow ${HOLD_COLORS[i % HOLD_COLORS.length]}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-stone-50">{post.title}</p>
                  <p className="mt-0.5 text-xs text-stone-400">
                    🧗 {post.name} · {formatDate(post.createdAt)}
                  </p>
                </div>
                <span className="text-stone-500">→</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
