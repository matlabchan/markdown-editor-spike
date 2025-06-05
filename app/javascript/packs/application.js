import MarkdownIt from 'markdown-it'

document.addEventListener("DOMContentLoaded", function () {
  const md = new MarkdownIt()
  const editor = document.getElementById("markdown-editor-textarea")
  const preview = document.getElementById("markdown-preview")
  const tools = document.getElementById("markdown-tools")

  editor.addEventListener("input", function () {
    console.log('input changed')
    editor.style.height = `${editor.scrollHeight}px`;
  })

  const editButton = document.getElementById("editor-edit");
  editButton.addEventListener("click", function () {
    if (preview.classList.contains("active")) {
      editor.classList.add("active")
      tools.classList.add("active")
      preview.classList.remove("active")
    }
  });

  const previewButton = document.getElementById("editor-preview");
  previewButton.addEventListener("click", function () {
    if (editor.classList.contains("active")) {
      preview.classList.add("active")
      editor.classList.remove("active")
      tools.classList.remove("active")

      let markdownText = editor.value
      if (editor.value == "") {
        markdownText = 'Nothing to preview...'
      }
      const html = md.render(markdownText)
      preview.innerHTML = html
    }
  });
});
