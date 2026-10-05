#!/usr/bin/env node
/**
 * Adds one course to Supabase and (optionally) announces it on Telegram.
 *
 *   node --env-file=.env.local scripts/add-course.mjs my-course.json            # preview only
 *   node --env-file=.env.local scripts/add-course.mjs my-course.json --save     # add the course
 *   node --env-file=.env.local scripts/add-course.mjs my-course.json --save --announce
 *
 * The JSON file: see scripts/course.example.json. "category" is a category name or slug.
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (to add the course),
 *      TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (to announce; the bot must be an admin of the
 *      channel; chat id is like @mychannel or -100…), optional SITE_URL (default coursesdz.com).
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const SAVE = args.includes("--save");
const ANNOUNCE = args.includes("--announce");
const SITE = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://coursesdz.com").replace(/\/+$/, "");

function fail(msg) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

if (!file) fail("Usage: node --env-file=.env.local scripts/add-course.mjs <course.json> [--save] [--announce]");

let input;
try {
  input = JSON.parse(readFileSync(file, "utf8"));
} catch (e) {
  fail(`Can't read ${file}: ${e.message}`);
}

// ---- validate ---------------------------------------------------------------
const name = String(input.name ?? "").trim();
const price = Number(input.price);
if (!name) fail('"name" is required.');
if (!(price > 0)) fail('"price" must be a number above 0 (in DA).');
for (const key of ["image_url", "download_url", "sales_page_url"]) {
  const v = String(input[key] ?? "").trim();
  if (v && !/^https?:\/\//.test(v)) fail(`"${key}" must start with http:// or https://`);
}
if (!String(input.download_url ?? "").trim()) console.warn('⚠ No "download_url": buyers will see "Download not available yet".');

const slugify = (s) =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
const slug = String(input.slug ?? "").trim() || slugify(name);
if (!slug) fail('Couldn\'t make a URL slug from the name; add a "slug" (e.g. "my-course").');

// ---- supabase ---------------------------------------------------------------
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) fail("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (e.g. in .env.local).");
const db = createClient(url, key, { auth: { persistSession: false } });

let category = null;
if (input.category) {
  const wanted = String(input.category).trim().toLowerCase();
  const { data: cats, error } = await db.from("categories").select("id, name, slug");
  if (error) fail(`Couldn't load categories: ${error.message}`);
  category = cats.find((c) => c.name.toLowerCase() === wanted || c.slug.toLowerCase() === wanted) ?? null;
  if (!category) fail(`Category "${input.category}" not found. Existing: ${cats.map((c) => c.name).sort().join(", ")}`);
}

const { data: clash } = await db.from("courses").select("id").eq("slug", slug).maybeSingle();
if (clash) fail(`A course with slug "${slug}" already exists (${SITE}/courses/${slug}). Pick another "slug".`);

const row = {
  name,
  slug,
  description: String(input.description ?? "").trim() || null,
  image_url: String(input.image_url ?? "").trim() || null,
  price,
  sales_page_url: String(input.sales_page_url ?? "").trim() || null,
  download_url: String(input.download_url ?? "").trim() || null,
  category_id: category?.id ?? null,
  is_featured: Boolean(input.is_featured),
  is_published: input.is_published !== false,
};
const courseUrl = `${SITE}/courses/${slug}`;

// ---- telegram message -------------------------------------------------------
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const fmt = (n) => new Intl.NumberFormat("en-US").format(n);
const message = [
  "🆕 <b>دورة جديدة على Courses DZ</b>",
  "",
  `📚 <b>${esc(name)}</b>`,
  category ? `🗂 ${esc(category.name)}` : null,
  `💰 ${fmt(price)} دج فقط`,
  "",
  "⚡ تحميل فوري بعد الدفع بـ CIB أو الذهبية",
  "🎁 كود <code>WELCOME10</code>: خصم 10% على طلبك الأول",
  "",
  `👉 ${courseUrl}`,
]
  .filter((l) => l !== null)
  .join("\n");

console.log("\n— Course —");
console.table({ ...row, category: category?.name ?? "(none)", download_url: row.download_url ? "(set)" : "(missing)" });
console.log("— Telegram message —\n" + message.replace(/<[^>]+>/g, "") + "\n");

if (!SAVE) {
  console.log("Preview only. Run again with --save to add the course (and --announce to post it).");
  process.exit(0);
}

const { data: created, error: insertError } = await db.from("courses").insert(row).select("id").single();
if (insertError) fail(`Couldn't add the course: ${insertError.message}`);
console.log(`✔ Course added: ${courseUrl} (id ${created.id})`);

if (!ANNOUNCE) process.exit(0);

// ---- post to telegram -------------------------------------------------------
const token = process.env.TELEGRAM_BOT_TOKEN;
const chat = process.env.TELEGRAM_CHAT_ID;
if (!token || !chat) fail("Course added, but TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID aren't set, so nothing was posted.");

const keyboard = { inline_keyboard: [[{ text: "🛒 اشترِ الآن", url: courseUrl }]] };
const method = row.image_url ? "sendPhoto" : "sendMessage";
const body = row.image_url
  ? { chat_id: chat, photo: row.image_url, caption: message, parse_mode: "HTML", reply_markup: keyboard }
  : { chat_id: chat, text: message, parse_mode: "HTML", reply_markup: keyboard };

const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
const json = await res.json().catch(() => ({}));
if (!json.ok) fail(`Course added, but Telegram refused the post: ${json.description ?? res.status}`);
console.log("✔ Announced on Telegram.");
