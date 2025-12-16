import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["panel", "button", "line1", "line2", "line3"]
  static values = { open: Boolean }

  connect() {
    this.update()
  }

  toggle() {
    this.openValue = !this.openValue
    this.update()
  }

  close() {
    this.openValue = false
    this.update()
  }

  update() {
    const open = this.openValue

    // panel
    this.panelTarget.classList.toggle("translate-x-0", open)
    this.panelTarget.classList.toggle("translate-x-full", !open)

    // line1：top-0 → 中央(top-1/2)へ → 回転
    this.line1Target.classList.toggle("top-0", !open)
    this.line1Target.classList.toggle("top-1/2", open)
    this.line1Target.classList.toggle("-translate-y-1/2", open)
    this.line1Target.classList.toggle("rotate-45", open)

    // line2：フェード
    this.line2Target.classList.toggle("opacity-0", open)

    // line3：top-full → 中央(top-1/2)へ → 回転
    this.line3Target.classList.toggle("top-full", !open)
    this.line3Target.classList.toggle("-translate-y-full", !open)
    this.line3Target.classList.toggle("top-1/2", open)
    this.line3Target.classList.toggle("-translate-y-1/2", open)
    this.line3Target.classList.toggle("-rotate-45", open)

    // bodyスクロール禁止
    document.body.classList.toggle("overflow-hidden", open)

    // aria
    this.buttonTarget.setAttribute("aria-expanded", String(open))
  }
}
