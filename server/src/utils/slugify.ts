export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function generateUniqueSlug(
  text: string,
  model: { countDocuments: (query: object) => Promise<number> },
  existingSlug?: string,
): Promise<string> {
  const base = slugify(text)
  if (existingSlug === base) return base

  let slug = base
  let counter = 1

  while ((await model.countDocuments({ slug })) > 0) {
    slug = `${base}-${counter}`
    counter++
  }

  return slug
}
