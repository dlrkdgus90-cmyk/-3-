import { notFound } from "next/navigation";
import { connection } from "next/server";
import PostForm from "@/components/PostForm";
import { getPost } from "@/lib/posts";
import { updatePostAction } from "./actions";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  return (
    <section>
      <h2 className="mb-1 text-xl font-bold">✏️ 등반 기록 수정</h2>
      <p className="mb-5 text-sm text-stone-400">글을 쓸 때 입력한 비밀번호가 맞아야 수정됩니다.</p>
      <PostForm
        action={updatePostAction.bind(null, post.id)}
        mode="edit"
        defaults={{ name: post.name, title: post.title, content: post.content }}
        cancelHref={`/posts/${post.id}`}
      />
    </section>
  );
}
