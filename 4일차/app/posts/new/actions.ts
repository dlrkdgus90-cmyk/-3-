"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { FormState } from "@/components/PostForm";
import { createPost, LIMITS, readField } from "@/lib/posts";

export async function createPostAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = readField(formData, "name");
  const title = readField(formData, "title");
  const content = readField(formData, "content");
  const fail = (error: string): FormState => ({ error, values: { name, title, content } });
  const pw = formData.get("password");
  const password = typeof pw === "string" ? pw : "";

  if (!name || name.length > LIMITS.name) return fail(`이름은 1~${LIMITS.name}자로 입력해주세요.`);
  if (password.length < LIMITS.password.min || password.length > LIMITS.password.max)
    return fail(`비밀번호는 ${LIMITS.password.min}~${LIMITS.password.max}자로 입력해주세요.`);
  if (!title || title.length > LIMITS.title) return fail(`제목은 1~${LIMITS.title}자로 입력해주세요.`);
  if (!content || content.length > LIMITS.content)
    return fail(`내용은 1~${LIMITS.content}자로 입력해주세요.`);

  const id = await createPost({ name, password, title, content });
  revalidatePath("/");
  redirect(`/posts/${id}`);
}
