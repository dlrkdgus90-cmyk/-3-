"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { FormState } from "@/components/PostForm";
import { LIMITS, readField, updatePost } from "@/lib/posts";

export async function updatePostAction(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const title = readField(formData, "title");
  const content = readField(formData, "content");
  const fail = (error: string): FormState => ({ error, values: { title, content } });
  const pw = formData.get("password");
  const password = typeof pw === "string" ? pw : "";

  if (!password) return fail("비밀번호를 입력해주세요.");
  if (!title || title.length > LIMITS.title) return fail(`제목은 1~${LIMITS.title}자로 입력해주세요.`);
  if (!content || content.length > LIMITS.content)
    return fail(`내용은 1~${LIMITS.content}자로 입력해주세요.`);

  const result = await updatePost(id, password, { title, content });
  if (result === "wrong_password") return fail("비밀번호가 맞지 않습니다.");
  if (result === "not_found") return fail("삭제되었거나 없는 글입니다.");

  revalidatePath("/");
  revalidatePath(`/posts/${id}`);
  redirect(`/posts/${id}`);
}
