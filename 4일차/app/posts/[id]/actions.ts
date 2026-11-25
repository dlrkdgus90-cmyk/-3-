"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { FormState } from "@/components/PostForm";
import { deletePost } from "@/lib/posts";

export async function deletePostAction(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const pw = formData.get("password");
  const password = typeof pw === "string" ? pw : "";
  if (!password) return { error: "비밀번호를 입력해주세요." };

  const result = await deletePost(id, password);
  if (result === "wrong_password") return { error: "비밀번호가 맞지 않습니다." };
  if (result === "not_found") return { error: "이미 삭제된 글입니다." };

  revalidatePath("/");
  redirect("/");
}
