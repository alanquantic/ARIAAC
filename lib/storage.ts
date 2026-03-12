import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { get, list, put } from "@vercel/blob";
import { SubmissionRecord } from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "diagnostics.json");
const BLOB_PREFIX = "diagnostics/";

function shouldUseBlobStore() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function getBlobPath(id: string) {
  return `${BLOB_PREFIX}${id}.json`;
}

async function readBlobRecord(pathname: string) {
  const response = await get(pathname, { access: "private" });

  if (!response || response.statusCode !== 200 || !response.stream) {
    return null;
  }

  const raw = await new Response(response.stream).text();

  try {
    return JSON.parse(raw) as SubmissionRecord;
  } catch {
    return null;
  }
}

async function ensureStore() {
  await mkdir(DATA_DIR, { recursive: true });

  try {
    await readFile(DATA_FILE, "utf8");
  } catch {
    await writeFile(DATA_FILE, "[]", "utf8");
  }
}

async function readStore(): Promise<SubmissionRecord[]> {
  await ensureStore();

  const raw = await readFile(DATA_FILE, "utf8");

  try {
    return JSON.parse(raw) as SubmissionRecord[];
  } catch {
    return [];
  }
}

export async function listSubmissions() {
  if (shouldUseBlobStore()) {
    const result = await list({ prefix: BLOB_PREFIX });
    const submissions = await Promise.all(
      result.blobs.map((blob) => readBlobRecord(blob.pathname)),
    );

    return submissions
      .filter((item): item is SubmissionRecord => Boolean(item))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const submissions = await readStore();
  return submissions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getSubmission(id: string) {
  if (shouldUseBlobStore()) {
    return readBlobRecord(getBlobPath(id));
  }

  const submissions = await readStore();
  return submissions.find((item) => item.id === id) ?? null;
}

export async function saveSubmission(record: SubmissionRecord) {
  if (shouldUseBlobStore()) {
    await put(getBlobPath(record.id), JSON.stringify(record, null, 2), {
      access: "private",
      addRandomSuffix: false,
      contentType: "application/json",
    });

    return record;
  }

  const submissions = await readStore();
  submissions.unshift(record);
  await writeFile(DATA_FILE, JSON.stringify(submissions, null, 2), "utf8");
  return record;
}
