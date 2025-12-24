import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "preview"]

  openDialog(event) {
    event.preventDefault()
    this.inputTarget.click()
  }

  onChange() {
    const file = this.inputTarget.files?.[0]
    if (!file) return

    // プレビュー表示
    const url = URL.createObjectURL(file)
    this.previewTarget.src = url
    this.previewTarget.classList.remove("hidden")
  }
}
