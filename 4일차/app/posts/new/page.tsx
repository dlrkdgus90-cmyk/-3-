import PostForm from "@/components/PostForm";
import { createPostAction } from "./actions";

export default function NewPostPage() {
  return (
    <section>
      <h2 className="mb-1 text-xl font-bold">🧗 새 등반 기록</h2>
      <p className="mb-5 text-sm text-stone-400">
        비밀번호는 나중에 글을 수정하거나 삭제할 때 필요합니다. 잊지 마세요!
      </p>
      <PostForm action={createPostAction} mode="create" cancelHref="/" />
    </section>
  );
}
