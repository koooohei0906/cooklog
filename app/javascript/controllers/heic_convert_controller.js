import { Controller } from "@hotwired/stimulus"
import { isHeic, heicTo } from "heic-to"

export default class extends Controller {
  static targets = ["input"]

  async convert() {
    const file = this.inputTarget.files?.[0]
    if (!file) return

    // HEIC以外は処理を抜ける
    const heic = await isHeic(file)
    if (!heic) return

    try {
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
    } catch (e) {
      console.error("HEIC convert failed:", e)
      alert("HEIC画像の変換に失敗しました。別の画像を選択してください。")

      // 変換できないファイルを送信させないようにファイル選択をクリアする（再選択させる）
      this.inputTarget.value = ""
    }
  }
}
