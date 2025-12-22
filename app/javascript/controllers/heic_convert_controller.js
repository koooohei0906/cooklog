import { Controller } from "@hotwired/stimulus"
import { isHeic, heicTo } from "heic-to"

export default class extends Controller {
  static targets = ["input"]

  async convert() {
    const file = this.inputTarget.files?.[0]
    if (!file) return

    // JPEGなどはそのまま
    if (!isHeic(file)) return

    // HEICだけをJPEGに変換
    const jpegBlob = await heicTo({
      blob: file,
      type: "image/jpeg",
      quality: 0.9,
    })

    // input.files を「変換後JPEG」に差し替える
    const convertedFile = new File(
      [jpegBlob],
      file.name.replace(/\.(heic|heif)$/i, ".jpg"),
      { type: "image/jpeg", lastModified: file.lastModified }
    )

    const dt = new DataTransfer()
    dt.items.add(convertedFile)
    this.inputTarget.files = dt.files
  }
}
