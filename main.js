/* Shared page enhancements: GitHub README, code-copy buttons, contact form. */
(function () {
  'use strict';

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }

  function inlineMarkdown(value) {
    var text = escapeHtml(value);
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    text = text.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    text = text.replace(/_([^_]+)_/g, '<em>$1</em>');
    return text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, function (_, label, url) {
      return '<a href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer">' + label + '</a>';
    });
  }

  function renderMarkdown(markdown) {
    var lines = markdown.replace(/\r/g, '').split('\n');
    var html = [];
    var paragraph = [];
    var listType = '';
    var codeLines = null;
    var codeLanguage = '';

    function closeParagraph() {
      if (paragraph.length) {
        html.push('<p>' + inlineMarkdown(paragraph.join(' ')) + '</p>');
        paragraph = [];
      }
    }
    function closeList() {
      if (listType) { html.push('</' + listType + '>'); listType = ''; }
    }

    lines.forEach(function (line) {
      var fence = line.match(/^\s*```([^`]*)\s*$/);
      if (fence) {
        closeParagraph(); closeList();
        if (codeLines) {
          html.push('<pre><code' + (codeLanguage ? ' class="language-' + escapeHtml(codeLanguage) + '"' : '') + '>' +
            escapeHtml(codeLines.join('\n')) + '</code></pre>');
          codeLines = null; codeLanguage = '';
        } else {
          codeLines = []; codeLanguage = fence[1].trim().replace(/[^\w+-]/g, '');
        }
        return;
      }
      if (codeLines) { codeLines.push(line); return; }

      var heading = line.match(/^\s*(#{1,6})\s+(.+?)\s*#*\s*$/);
      var item = line.match(/^\s*([-*+]\s+|\d+\.\s+)(.+)$/);
      if (heading || item || !line.trim() || /^\s*---+\s*$/.test(line)) closeParagraph();
      if (!item) closeList();

      if (heading) {
        var level = heading[1].length;
        html.push('<h' + level + '>' + inlineMarkdown(heading[2]) + '</h' + level + '>');
      } else if (/^\s*---+\s*$/.test(line)) {
        html.push('<hr>');
      } else if (item) {
        var nextType = /^\d/.test(item[1]) ? 'ol' : 'ul';
        if (listType !== nextType) { closeList(); html.push('<' + nextType + '>'); listType = nextType; }
        html.push('<li>' + inlineMarkdown(item[2]) + '</li>');
      } else if (line.trim()) {
        paragraph.push(line.trim());
      }
    });

    closeParagraph(); closeList();
    if (codeLines) html.push('<pre><code>' + escapeHtml(codeLines.join('\n')) + '</code></pre>');
    return html.join('\n');
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var field = document.createElement('textarea');
      field.value = text;
      field.setAttribute('readonly', '');
      field.className = 'visually-hidden';
      document.body.appendChild(field);
      field.select();
      var copied = document.execCommand('copy');
      field.remove();
      copied ? resolve() : reject(new Error('Không thể sao chép'));
    });
  }

  function addCopyButton(block) {
    if (block.querySelector('.copy-btn')) return;
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-btn';
    button.textContent = 'Sao chép';
    button.setAttribute('aria-label', 'Sao chép đoạn mã');
    button.addEventListener('click', function () {
      var code = block.querySelector('code');
      copyText(code ? code.textContent : block.textContent).then(function () {
        button.textContent = 'Đã sao chép';
        button.setAttribute('aria-label', 'Đã sao chép mã vào bộ nhớ tạm');
      }).catch(function () {
        button.textContent = 'Không sao chép được';
        button.setAttribute('aria-label', 'Không thể sao chép mã');
      }).then(function () {
        window.setTimeout(function () {
          button.textContent = 'Sao chép';
          button.setAttribute('aria-label', 'Sao chép đoạn mã');
        }, 2500);
      });
    });
    block.appendChild(button);
  }

  function loadReadme() {
    var container = document.getElementById('readme-content');
    if (!container) return;
    var status = document.getElementById('readme-status');
    fetch('https://api.github.com/repos/hongphong214365/Du-an/readme', {
      headers: { Accept: 'application/vnd.github.v3.raw' }
    }).then(function (response) {
      if (!response.ok) throw new Error('README không khả dụng');
      return response.text();
    }).then(function (markdown) {
      container.innerHTML = renderMarkdown(markdown);
      container.querySelectorAll('pre').forEach(addCopyButton);
      container.setAttribute('aria-busy', 'false');
      if (status) status.textContent = 'README đã tải xong.';
    }).catch(function () {
      container.textContent = '';
      var message = document.createElement('p');
      message.className = 'muted';
      message.append('Hiện chưa tải được README. ');
      var link = document.createElement('a');
      link.href = 'https://github.com/hongphong214365/Du-an';
      link.textContent = 'Mở repository Du-an trên GitHub';
      message.appendChild(link);
      container.appendChild(message);
      container.setAttribute('aria-busy', 'false');
      if (status) status.textContent = 'Không tải được README. Đã hiển thị liên kết mở GitHub.';
    });
  }

  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      var values = new FormData(form);
      if (values.get('website')) return;
      var subject = 'Liên hệ từ website – ' + values.get('name');
      var body = 'Tên: ' + values.get('name') + '\nEmail: ' + values.get('email') + '\n\n' + values.get('message');
      var status = document.getElementById('form-status');
      if (status) {
        status.className = 'form-status';
        status.textContent = 'Đang mở ứng dụng email của bạn để gửi tin nhắn.';
      }
      window.location.href = 'mailto:hongphong0909.13@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadReadme();
    document.querySelectorAll('.code-block, pre').forEach(addCopyButton);
    initContactForm();
  });
}());
