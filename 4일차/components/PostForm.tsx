"use client";

import Link from "next/link";
import { useActionState } from "react";

// 오류가 나도 입력한 내용이 지워지지 않도록 values에 담아 되돌려줍니다.
export type FormState = { error?: string; values?: { name?: string; title?: string; content?: string } };

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  mode: "create" | "edit";
  defaults?: { name: string; title: string; content: string };
  cancelHref: string;
};

const inputCls =
  "w-full rounded-lg border border-stone-600 bg-stone-950/70 px-3 py-2 text-stone-100 placeholder:text-stone-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

export default function PostForm({ action, mode, defaults, cancelHref }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const v = { ...defaults, ...state.values };

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-stone-700 bg-stone-900/70 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm text-stone-300">클라이머 이름</span>
          {mode === "edit" ? (
            <input value={defaults?.name ?? ""} disabled readOnly className={`${inputCls} opacity-60`} />
          ) : (
            <input
              name="name"
              required
              maxLength={20}
              defaultValue={v.name}
              placeholder="예: 크림프장인"
              className={inputCls}
            />
          )}
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-stone-300">
            비밀번호 {mode === "edit" && <span className="text-amber-400">(작성할 때 쓴 비밀번호)</span>}
          </span>
          <input
            name="password"
            type="password"
            required
            minLength={4}
            maxLength={50}
            placeholder="4자 이상"
            className={inputCls}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm text-stone-300">제목</span>
        <input
          name="title"
          required
          maxLength={100}
          defaultValue={v.title}
          placeholder="예: 인수봉 취나드B 완등 후기"
          className={inputCls}
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm text-stone-300">내용</span>
        <textarea
          name="content"
          required
          maxLength={5000}
          rows={10}
          defaultValue={v.content}
          placeholder="루트 정보, 베타, 컨디션, 장비 등을 자유롭게 적어주세요."
          className={inputCls}
        />
      </label>

      {state.error && (
        <p className="rounded-lg border border-rose-500/50 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          ⚠️ {state.error}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Link href={cancelHref} className="rounded-lg px-4 py-2 text-sm text-stone-300 hover:bg-stone-800">
          취소
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-bold text-stone-950 hover:bg-amber-400 disabled:opacity-50"
        >
          {pending ? "저장 중..." : mode === "create" ? "🧗 기록 등록" : "수정 완료"}
        </button>
      </div>
    </form>
  );
}
