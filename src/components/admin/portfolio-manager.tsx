"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Trash2, Upload, ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Field, Input, Select, Textarea } from "@/components/ui/inputs";
import { Button } from "@/components/ui/button";
import { portfolioCategories } from "@/content/portfolio";

interface PortfolioRow {
  id: string;
  src: string;
  category: string;
  title: string;
  caption: string;
  location: string;
  date: string;
}

const PORTFOLIO_BUCKET = "portfolio";

export function PortfolioManager() {
  const router = useRouter();
  const [items, setItems] = React.useState<PortfolioRow[]>([]);
  const [loaded, setLoaded] = React.useState(false);
  const [adding, setAdding] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [deleting, setDeleting] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [form, setForm] = React.useState({
    title: "",
    category: "Events",
    caption: "",
    location: "",
    date: "",
  });

  React.useEffect(() => {
    fetch("/api/admin/portfolio")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setItems(data.items);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      let src = "";
      if (imageFile) {
        setUploading(true);
        const supabase = createClient();
        const path = `images/portfolio/${crypto.randomUUID()}.${
          (imageFile.name.split(".").pop() || "jpg").toLowerCase()
        }`;
        const { error: upErr } = await supabase.storage
          .from(PORTFOLIO_BUCKET)
          .upload(path, imageFile, { upsert: false });
        if (upErr) {
          setError("Image upload failed: " + upErr.message);
          setSaving(false);
          setUploading(false);
          return;
        }
        const { data: pub } = supabase.storage.from(PORTFOLIO_BUCKET).getPublicUrl(path);
        src = pub.publicUrl;
      }

      const res = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, src }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message ?? "Could not save the portfolio item.");
        return;
      }
      setForm({ title: "", category: "Events", caption: "", location: "", date: "" });
      setImageFile(null);
      setAdding(false);
      router.refresh();
      const list = await fetch("/api/admin/portfolio").then((r) => r.json());
      if (list.ok) setItems(list.items);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this portfolio item from the site?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((list) => list.filter((i) => i.id !== id));
        router.refresh();
      }
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="mt-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-3xl text-deep">Portfolio items</h2>
          <p className="mt-1 text-sm text-charcoal-soft">
            Items added here appear on the public portfolio gallery. Upload a
            photo and add its caption and category.
          </p>
        </div>
        <Button type="button" variant="primary" onClick={() => setAdding((v) => !v)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add project
        </Button>
      </div>

      {adding ? (
        <form
          onSubmit={addItem}
          className="mt-6 grid gap-5 rounded-3xl border border-bronze/20 bg-white p-6 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <Field
              label="Photo"
              htmlFor="portfolio-file"
              hint="JPG, PNG or WEBP up to 5 MB."
            >
              <label
                htmlFor="portfolio-file"
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-bronze/30 bg-ivory px-4 py-5 text-sm text-charcoal-soft hover:border-bronze/50"
              >
                <Upload className="h-5 w-5 text-bronze-dark" aria-hidden="true" />
                {imageFile ? imageFile.name : "Choose an image…"}
                <input
                  id="portfolio-file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </Field>
          </div>
          <Field label="Title" htmlFor="pf-title">
            <Input
              id="pf-title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Amara & Tunde's Wedding"
            />
          </Field>
          <Field label="Category" htmlFor="pf-category">
            <Select
              id="pf-category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="Events">Events (uncategorised)</option>
              {portfolioCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Caption" htmlFor="pf-caption">
              <Textarea
                id="pf-caption"
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                placeholder="Short description of the image"
              />
            </Field>
          </div>
          <Field label="Location" htmlFor="pf-location">
            <Input
              id="pf-location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Manchester"
            />
          </Field>
          <Field label="Date" htmlFor="pf-date">
            <Input
              id="pf-date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              placeholder="e.g. August 2025"
            />
          </Field>
          {error ? (
            <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800 sm:col-span-2">
              {error}
            </p>
          ) : null}
          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit" disabled={saving || uploading}>
              {saving || uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Plus className="h-4 w-4" aria-hidden="true" />
              )}
              {uploading ? "Uploading…" : "Add to portfolio"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setAdding(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : null}

      {!loaded ? (
        <p className="mt-6 text-sm text-charcoal-soft">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-bronze/30 bg-white p-8 text-center text-sm text-charcoal-soft">
          No portfolio items added yet. Items shown on the gallery come from{" "}
          <code className="font-mono">src/content/portfolio.ts</code> until you
          add them here.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex gap-4 rounded-2xl border border-bronze/15 bg-white p-4"
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-lavender/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={item.title || "Portfolio item"} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-deep">
                  {item.title || "Untitled"}
                </p>
                <p className="text-xs text-bronze-dark">{item.category}</p>
                {item.caption ? (
                  <p className="mt-1 line-clamp-2 text-xs text-charcoal-soft">{item.caption}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => remove(item.id)}
                disabled={deleting === item.id}
                aria-label={`Delete ${item.title || "item"}`}
                className="h-9 w-9 shrink-0 self-start rounded-full border border-bronze/20 text-charcoal/50 hover:border-red-300 hover:text-red-600"
              >
                {deleting === item.id ? (
                  <Loader2 className="mx-auto h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Trash2 className="mx-auto h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 flex items-center gap-2 text-xs text-charcoal/50">
        <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
        Tip: to caption the original 40 photos, edit{" "}
        <code className="font-mono">src/content/portfolio.ts</code>.
      </p>
    </div>
  );
}