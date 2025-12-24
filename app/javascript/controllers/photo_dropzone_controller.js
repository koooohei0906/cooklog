import { Controller } from "@hotwired/stimulus"
import { convertHeicFileToJpegFile } from "../lib/image/heic_to_jpeg"

export default class extends Controller {
  static targets = ["input", "preview"]

  // ページ全体で「dragover/drop」のブラウザ標準の挙動を無効化する（ファイルをドロップしてもブラウザ遷移しないようにする）
  connect() {
    this.initialSrc = this.previewTarget?.dataset?.initialSrc || ""
    // メモリの解放が目的（画像を選び直すたびに URL.createObjectURL を作ることになってる
    this.previewObjectUrl = null

    this._preventDefaults = (e) => e.preventDefault()
    document.addEventListener("dragover", this._preventDefaults)
    document.addEventListener("drop", this._preventDefaults)
  }

  disconnect() {
    document.removeEventListener("dragover", this._preventDefaults)
    document.removeEventListener("drop", this._preventDefaults)
  }

  openDialog(event) {
    event.preventDefault()
    this.inputTarget.click()
  }

  onChange() {
    const files = this.inputTarget.files
    this.handleFiles(files)
  }

  // ドロップゾーン内をドラッグ中、ゾーン内はドロップ可能とする
  onDragOver(event) {
    event.preventDefault()
  }

  // ドロップゾーン内でドロップした時、ドロップ時のブラウザ標準の挙動（ページ遷移してファイルを開く挙動）を無効化し、
  // 代わりにドロップしたファイル情報を取得して自前の処理（handleFiles）に渡す
  onDrop(event) {
    event.preventDefault()
    const files = event.dataTransfer?.files
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
    // 前回の画像URLがあれば無くしてメモリを解放する
    if (this.previewObjectUrl) {
      URL.revokeObjectURL(this.previewObjectUrl)
      this.previewObjectUrl = null
    }

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
    // バリデーションエラーでresetInputが動いた際の各画面のプレビューについて
    if (this.initialSrc) {
      // 編集：既存画像に戻す
      this.previewTarget.src = this.initialSrc
      this.previewTarget.classList.remove("hidden")
    } else {
      // 新規：消す
      this.previewTarget.removeAttribute("src")
      this.previewTarget.classList.add("hidden")
    }
  }
}
