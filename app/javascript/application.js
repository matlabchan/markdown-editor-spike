// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

import MarkdownIt from 'markdown-it'

document.addEventListener("DOMContentLoaded", function () {
    const md = new MarkdownIt()

    const editor = document.getElementById("markdown-editor-textarea")
    const preview = document.getElementById("markdown-preview")

    const editButton = document.getElementById("editor-edit");
    editButton.addEventListener("click", function () {
    console.log("Edit clicked")

    if (preview.classList.contains("active")) {
        editor.classList.add("active")
        preview.classList.remove("active")
    }
    });

    const previewButton = document.getElementById("editor-preview");
    previewButton.addEventListener("click", function () {
    console.log("Preview clicked")

    if (editor.classList.contains("active")) {
        console.log(preview)
        preview.classList.add("active")
        editor.classList.remove("active")

        const markdownText = editor.value
        console.log(markdownText)
        const html = md.render(markdownText)
        console.log(html)
    }
    });
});
