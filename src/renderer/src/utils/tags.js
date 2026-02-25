// 6 preset tag colors
export const TAG_COLORS = [
  '#6366f1', // indigo
  '#ec4899', // pink
  '#14b8a6', // teal
  '#facc15', // yellow
  '#ef4444', // red
  '#84cc16', // lime
]

// Fallback: deterministic color from tag name when not in saved tags
export function getTagColor(name, savedTags) {
  if (savedTags && savedTags[name]) return savedTags[name]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length]
}
