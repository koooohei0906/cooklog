import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input"]

  openDialog(event) {
    event.preventDefault()
    this.inputTarget.click()
  }

  onChange() {
    // 一旦、動作確認目的の内容
    const file = this.inputTarget.files?.[0]
    if (!file) return
    console.log("[photo-dropzone] selected:", file.name, file.type, file.size)
  }
}
