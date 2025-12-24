import { Controller } from "@hotwired/stimulus"

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
  handleFiles(files) {
    // ファイルが無いor空なら処理を終わらせる
    if (!files?.length) return

    // ① 複数ファイルは拒否
    if (files.length > 1) {
      alart("ファイルは1つだけ選択してください。")
      this.resetInput()
      return
    }

    // 以降は単一ファイルfileとして進める
    const file = files[0]

    // ② 10MB以上は拒否
    const maxUploadSizeBytes = 10 * 1024 * 1024
    if (file.size >= maxUploadSizeBytes) {
      alart("ファイルサイズは10MB未満にしてください")
      this.resetInput()
      return
    }

    // ③ 形式チェック（jpeg / heic / heif のみ）
    const allowedPhotoMimeTypes = ["image/jpeg", "image/heic", "image/heif"]
    if (!allowedPhotoMimeTypes.includes(file.type)) {
      alart("jpeg / heic / heif の画像のみ選択できます。")
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

  resetInput() {
    this.inputTarget.value = ""
    // プレビューも隠す（新規作成はこれでOK、編集の既存画像は別途）
    this.previewTarget.removeAttribute("src")
    this.previewTarget.classList.add("hidden")
  }
}
