// 게시글 저장소: DB 대신 서버의 data/posts.json 파일에 저장합니다.
// 이 파일은 서버에서만 실행됩니다 (node:fs 사용).
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";

type StoredPost = {
  id: string;
  name: string;
  title: string;
  content: string;
  passwordHash: string; // "salt:hash" 형태, 원래 비밀번호는 저장하지 않음
  createdAt: string;
  updatedAt: string;
};

// 화면(클라이언트)에 넘겨도 안전한 필드만 담은 형태
export type PublicPost = Omit<StoredPost, "passwordHash">;

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "posts.json");

function toPublic(p: StoredPost): PublicPost {
  return {
    id: p.id,
    name: p.name,
    title: p.title,
    content: p.content,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

async function readAll(): Promise<StoredPost[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw) as StoredPost[];
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
}

async function writeAll(posts: StoredPost[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  // 임시 파일에 먼저 쓰고 바꿔치기 → 저장 도중 꺼져도 파일이 깨지지 않음
  const tmp = `${DATA_FILE}.${randomUUID()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(posts, null, 2), "utf8");
  await fs.rename(tmp, DATA_FILE);
}

// 여러 명이 동시에 저장해도 순서대로 처리되도록 줄 세우기
let queue: Promise<unknown> = Promise.resolve();
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => {});
  return run;
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, 64);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function listPosts(): Promise<PublicPost[]> {
  const posts = await readAll();
  return posts
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(toPublic);
}

export async function getPost(id: string): Promise<PublicPost | null> {
  const posts = await readAll();
  const found = posts.find((p) => p.id === id);
  return found ? toPublic(found) : null;
}

export async function createPost(input: {
  name: string;
  password: string;
  title: string;
  content: string;
}): Promise<string> {
  return withLock(async () => {
    const posts = await readAll();
    const now = new Date().toISOString();
    const id = randomUUID();
    posts.push({
      id,
      name: input.name,
      title: input.title,
      content: input.content,
      passwordHash: hashPassword(input.password),
      createdAt: now,
      updatedAt: now,
    });
    await writeAll(posts);
    return id;
  });
}

export type MutationResult = "ok" | "not_found" | "wrong_password";

export async function updatePost(
  id: string,
  password: string,
  input: { title: string; content: string },
): Promise<MutationResult> {
  return withLock(async () => {
    const posts = await readAll();
    const post = posts.find((p) => p.id === id);
    if (!post) return "not_found";
    if (!verifyPassword(password, post.passwordHash)) return "wrong_password";
    post.title = input.title;
    post.content = input.content;
    post.updatedAt = new Date().toISOString();
    await writeAll(posts);
    return "ok";
  });
}

export async function deletePost(id: string, password: string): Promise<MutationResult> {
  return withLock(async () => {
    const posts = await readAll();
    const post = posts.find((p) => p.id === id);
    if (!post) return "not_found";
    if (!verifyPassword(password, post.passwordHash)) return "wrong_password";
    await writeAll(posts.filter((p) => p.id !== id));
    return "ok";
  });
}

// 입력값 검사 (서버에서 다시 확인)
export function readField(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export const LIMITS = {
  name: 20,
  password: { min: 4, max: 50 },
  title: 100,
  content: 5000,
};

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
