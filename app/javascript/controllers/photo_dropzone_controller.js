import { Controller } from "@hotwired/stimulus"
import { convertHeicFileToJpegFile } from "../lib/image/heic_to_jpeg"

export default class extends Controller {
  static targets = ["inputPc", "inputSp", "preview", "zone", "title", "subtitle", "overlay"]

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
    this.inputPcTarget.click()
  }

  onChange(event) {
    const inputEl = event.target
    const files = inputEl.files
    this.handleFiles(files, inputEl)
  }

  // ドロップゾーン内をドラッグ中、ゾーン内はドロップ可能とする
  onDragOver(event) {
    event.preventDefault()
    this.activateDragUI()
  }

  onDragLeave(event) {
    event.preventDefault()
    this.deactivateDragUI()
  }

  // ドロップゾーン内でドロップした時、ドロップ時のブラウザ標準の挙動（ページ遷移してファイルを開く挙動）を無効化して handleFiles に渡す
  onDrop(event) {
    event.preventDefault()
    this.deactivateDragUI()
    const files = event.dataTransfer?.files
    this.handleFiles(files, this.inputPcTarget)
  }

  // バリデーション＋プレビュー表示
  async handleFiles(files, inputEl) {
    // ファイルが無いor空なら処理を終わらせる
    if (!files?.length) return

    // ① 複数ファイルは拒否
    if (files.length > 1) {
      alert("ファイルは1つだけ選択してください。")
      this.resetInput(inputEl)
      return
    }

    // 以降は単一ファイルfileとして進める
    let file = files[0]

    // ② 10MB以上は拒否
    const maxUploadSizeBytes = 10 * 1024 * 1024
    if (file.size >= maxUploadSizeBytes) {
      alert("ファイルサイズは10MB未満にしてください")
      this.resetInput(inputEl)
      return
    }

    // ③ 形式チェック（jpeg / heic / heif のみ）
    const allowedPhotoMimeTypes = ["image/jpeg", "image/heic", "image/heif"]
    if (!allowedPhotoMimeTypes.includes(file.type)) {
      alert("jpeg / heic / heif の画像のみ選択できます。")
      this.resetInput(inputEl)
      return
    }

    // HEICだけJPEG変換＋添付画像の差し替え
    if (file.type === "image/heic" || file.type === "image/heif") {
      this.showOverlay()
      try {
        const converted = await convertHeicFileToJpegFile(file, { quality: 0.9 })
        if (converted) {
          file = converted
          this.replaceInputFiles(file, inputEl)
        }
      } catch (e) {
        alert("HEIC画像の変換に失敗しました。別の画像を選択してください。")
        this.resetInput(inputEl)
        return
      } finally {
        this.hideOverlay()
      }
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
    this.previewObjectUrl = url
    this.previewTarget.src = url
    this.previewTarget.classList.remove("hidden")
  }

  replaceInputFiles(file, inputEl) {
    const dt = new DataTransfer()
    dt.items.add(file)
    inputEl.files = dt.files
  }


  resetInput(inputEl) {
    if (inputEl) inputEl.value = ""

    // ドラッグ中UIを戻す（メソッドがある前提）
    if (typeof this.deactivateDragUI === "function") this.deactivateDragUI()

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

    this.hideOverlay()
  }

  // 以下メソッドはドロップゾーンをドラッグ中のUIを切り替えるところ！
  activateDragUI() {
    this.zoneTarget.classList.add("border-green-500", "bg-green-50")
    this.titleTarget.textContent = "ファイルをアップロードします"
    this.subtitleTarget.textContent = "ここにドロップしてください"
  }

  deactivateDragUI() {
    this.zoneTarget.classList.remove("border-green-500", "bg-green-50")
    this.titleTarget.textContent = "ファイルを登録してください。"
    this.subtitleTarget.textContent = "ファイルを選択するか、ドラッグ&ドロップしてください。"
  }

  // 以下メソッドはHEIC→JPEG変換中のアニメーション用
  showOverlay() {
    if (!this.hasOverlayTarget) return
    this.overlayTarget.classList.remove("hidden")
    this.overlayTarget.setAttribute("aria-hidden", "false")
  }

  hideOverlay() {
    if (!this.hasOverlayTarget) return
    this.overlayTarget.classList.add("hidden")
    this.overlayTarget.setAttribute("aria-hidden", "true")
  }
}
