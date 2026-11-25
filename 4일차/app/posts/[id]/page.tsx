import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import DeleteForm from "@/components/DeleteForm";
import { formatDate, getPost } from "@/lib/posts";
import { deletePostAction } from "./actions";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  const edited = post.updatedAt !== post.createdAt;

  return (
    <article className="space-y-5">
      <Link href="/" className="text-sm text-stone-400 hover:text-amber-300">
        ← 등반 기록 목록
      </Link>

      <div className="rounded-xl border border-stone-700 bg-stone-900/70 p-6">
        <h2 className="text-2xl font-bold text-stone-50">{post.title}</h2>
        <p className="mt-2 text-sm text-stone-400">
          🧗 {post.name} · {formatDate(post.createdAt)}
          {edited && <span className="ml-2 text-stone-500">(수정됨 {formatDate(post.updatedAt)})</span>}
        </p>
        <hr className="my-5 border-stone-700" />
        <p className="whitespace-pre-wrap break-words leading-7 text-stone-200">{post.content}</p>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-stone-800 bg-stone-900/40 p-4">
        <Link
          href={`/posts/${post.id}/edit`}
          className="rounded-lg border border-amber-500/60 px-3 py-1.5 text-sm text-amber-300 hover:bg-amber-500/10"
        >
          ✏️ 수정하기
        </Link>
        <DeleteForm action={deletePostAction.bind(null, post.id)} />
      </div>
    </article>
  );
}
