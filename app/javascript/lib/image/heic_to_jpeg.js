import { isHeic, heicTo } from "heic-to"

// HEIC/HEIF なら JPEG を返す。それ以外は null を返す。
// 例外は投げる（呼び出し側でcatchしてalert）
export async function convertHeicFileToJpegFile(file, { quality = 0.9 } = {}) {
  const heic = await isHeic(file)
  if (!heic) return null

  const jpegBlob = await heicTo({
    blob: file,
    type: "image/jpeg",
    quality,
  })

  return new File(
    [jpegBlob],
    file.name.replace(/\.(heic|heif)$/i, ".jpg"),
    { type: "image/jpeg", lastModified: file.lastModified }
  )
}
