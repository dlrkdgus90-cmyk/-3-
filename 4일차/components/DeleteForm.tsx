"use client";

import { useActionState } from "react";
import type { FormState } from "./PostForm";

export default function DeleteForm({
  action,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm("정말 이 기록을 삭제할까요? 되돌릴 수 없습니다.")) e.preventDefault();
      }}
      className="flex flex-wrap items-center gap-2"
    >
      <input
        name="password"
        type="password"
        required
        placeholder="비밀번호"
        className="w-36 rounded-lg border border-stone-600 bg-stone-950/70 px-3 py-1.5 text-sm focus:border-rose-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-rose-500/60 px-3 py-1.5 text-sm text-rose-300 hover:bg-rose-500/10 disabled:opacity-50"
      >
        {pending ? "삭제 중..." : "삭제"}
      </button>
      {state.error && <p className="w-full text-sm text-rose-300">⚠️ {state.error}</p>}
    </form>
  );
}
