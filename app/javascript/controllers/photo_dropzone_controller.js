import { Controller } from "@hotwired/stimulus"
import { convertHeicFileToJpegFile } from "../lib/image/heic_to_jpeg"

export default class extends Controller {
  static targets = ["input", "preview"]

  openDialog(event) {
    event.preventDefault()
    this.inputTarget.click()
  }

  onChange() {
    const files = this.inputTarget.files
    this.handleFiles(files)
  }

  // バリデーション＋プレビュー表示
  async handleFiles(files) {
    // ファイルが無いor空なら処理を終わらせる
    if (!files?.length) return

    // ① 複数ファイルは拒否
    if (files.length > 1) {
      alert("ファイルは1つだけ選択してください。")
      this.resetInput()
      return
    }

    // 以降は単一ファイルfileとして進める
    let file = files[0]

    // ② 10MB以上は拒否
    const maxUploadSizeBytes = 10 * 1024 * 1024
    if (file.size >= maxUploadSizeBytes) {
      alert("ファイルサイズは10MB未満にしてください")
      this.resetInput()
      return
    }

    // ③ 形式チェック（jpeg / heic / heif のみ）
    const allowedPhotoMimeTypes = ["image/jpeg", "image/heic", "image/heif"]
    if (!allowedPhotoMimeTypes.includes(file.type)) {
      alert("jpeg / heic / heif の画像のみ選択できます。")
      this.resetInput()
      return
    }

    // HEICだけJPEG変換＋添付画像の差し替え
    try {
      const converted = await convertHeicFileToJpegFile(file, { quality: 0.9 })
      if (converted) {
        file = converted
        this.replaceInputFiles(file)
      }
    } catch(e) {
      alert("HEIC画像の変換に失敗しました。別の画像を選択してください。")
      this.resetInput()
      return
    }

    // 全て通過したらプレビュー表示へ繋ぐ
    this.showPreview(file)
  }

  showPreview(file) {
    const url = URL.createObjectURL(file)
    this.previewTarget.src = url
    this.previewTarget.classList.remove("hidden")
  }

  replaceInputFiles(file) {
    const dt = new DataTransfer()
    dt.items.add(file)
    this.inputTarget.files = dt.files
  }

  resetInput() {
    this.inputTarget.value = ""
    // プレビューも隠す（新規作成はこれでOK、編集の既存画像は別途）
    this.previewTarget.removeAttribute("src")
    this.previewTarget.classList.add("hidden")
  }
}
