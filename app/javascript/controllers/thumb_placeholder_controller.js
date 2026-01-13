import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { templateId: String }

  replace() {
    const template = document.getElementById(this.templateIdValue)
    if (!template) return

    // templateの中身を複製してimgを差し替える
    const fragment = template.content.cloneNode(true)
    this.element.replaceWith(fragment)
  }
}
