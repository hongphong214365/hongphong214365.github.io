/**
 * main.js — Hồng Phong Personal Site
 *
 * Responsibilities:
 *  1. Fetch README from GitHub API (hongphong214365/Du-an) and render it
 *  2. Add "Copy" buttons to all <pre> code blocks
 *  3. Handle contact form submission via Formspree (AJAX, no redirect)
 */

/* ── 1. Fetch & Render README ────────────────────────────── */

/**
 * Adds "Copy" buttons to all <pre> elements within a given container.
 * @param {HTMLElement} container
 */
function addCopyButtons(container) {
  container.querySelectorAll('pre').forEach(function (pre) {
    // Avoid adding duplicate buttons
    if (pre.querySelector('.copy-btn')) return;

    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.type = 'button';
    btn.textContent = 'Sao chép';
    btn.setAttribute('aria-label', 'Sao chép đoạn code');

    btn.addEventListener('click', function () {
      var code = pre.querySelector('code') ? pre.querySelector('code').textContent : pre.textContent;
      navigator.clipboard.writeText(code).then(function () {
        btn.textContent = 'Đã sao chép!';
        btn.setAttribute('aria-label', 'Đã sao chép thành công');
        setTimeout(function () {
          btn.textContent = 'Sao chép';
          btn.setAttribute('aria-label', 'Sao chép đoạn code');
        }, 2000);
      }).catch(function () {
        btn.textContent = 'Lỗi!';
        setTimeout(function () { btn.textContent = 'Sao chép'; }, 2000);
      });
    });

    // Make pre position:relative so button can be absolutely positioned via CSS
    pre.style.position = 'relative';
    pre.appendChild(btn);
  });
}

/**
 * Converts a basic Markdown string to HTML.
 * Supports: headings, bold, inline code, fenced code blocks, links, lists, paragraphs.
 * This is a minimal renderer to avoid loading an external library.
 * @param {string} md
 * @returns {string} HTML string
 */
function renderMarkdown(md) {
  // Escape HTML entities in code blocks first, then restore them properly
  var lines = md.split('\n');
  var html = '';
  var inCodeBlock = false;
  var codeLang = '';
  var codeLines = [];

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];

    // Fenced code block start/end
    if (/^```/.test(line)) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
        codeLines = [];
      } else {
        inCodeBlock = false;
        var codeContent = codeLines
          .join('\n')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        html += '<pre><code' + (codeLang ? ' class="language-' + escAttr(codeLang) + '"' : '') + '>' + codeContent + '</code></pre>\n';
        codeLines = [];
        codeLang = '';
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Headings
    var heading = line.match(/^(#{1,6})\s+(.*)/);
    if (heading) {
      var level = heading[1].length;
      html += '<h' + level + '>' + inlineMarkdown(heading[2]) + '</h' + level + '>\n';
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      html += '<hr>\n';
      continue;
    }

    // Unordered list item
    var ulItem = line.match(/^[\-\*\+]\s+(.*)/);
    if (ulItem) {
      html += '<ul><li>' + inlineMarkdown(ulItem[1]) + '</li></ul>\n';
      continue;
    }

    // Ordered list item
    var olItem = line.match(/^\d+\.\s+(.*)/);
    if (olItem) {
      html += '<ol><li>' + inlineMarkdown(olItem[1]) + '</li></ol>\n';
      continue;
    }

    // Blank line
    if (line.trim() === '') {
      html += '<br>\n';
      continue;
    }

    // Paragraph
    html += '<p>' + inlineMarkdown(line) + '</p>\n';
  }

  // Merge consecutive <ul><li>…</li></ul> into one <ul>
  html = html.replace(/<\/ul>\n<ul>/g, '');
  html = html.replace(/<\/ol>\n<ol>/g, '');

  return html;
}

/**
 * Process inline Markdown: bold, italic, inline code, links.
 * @param {string} text
 * @returns {string}
 */
function inlineMarkdown(text) {
  // HTML-escape special chars first (except those used for markdown)
  text = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Inline code (backticks)
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Bold+italic ***text***
  text = text.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');

  // Bold **text**
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic *text* or _text_
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  text = text.replace(/_(.+?)_/g, '<em>$1</em>');

  // Links [label](url)
  text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, function (_, label, url) {
    return '<a href="' + escAttr(url) + '" target="_blank" rel="noopener noreferrer">' + label + '</a>';
  });

  return text;
}

/** Escape an HTML attribute value */
function escAttr(str) {
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** Fetch and render the README */
function loadReadme() {
  var container = document.getElementById('readme-content');
  if (!container) return;

  var apiUrl = 'https://api.github.com/repos/hongphong214365/Du-an/readme';

  fetch(apiUrl, {
    headers: {
      'Accept': 'application/vnd.github.v3.raw',
      'User-Agent': 'hongphong214365-site'
    }
  })
    .then(function (res) {
      if (!res.ok) {
        throw new Error('HTTP ' + res.status);
      }
      return res.text();
    })
    .then(function (markdown) {
      container.innerHTML = renderMarkdown(markdown);
      addCopyButtons(container);
    })
    .catch(function (err) {
      container.innerHTML =
        '<p class="muted">Không thể tải README lúc này. ' +
        '<a href="https://github.com/hongphong214365/Du-an" target="_blank" rel="noopener">Xem trên GitHub</a>.</p>' +
        '<!-- Error: ' + err.message + ' -->';
    });
}

/* ── 2. Add Copy Buttons to project page code blocks ─────── */

/**
 * Add copy buttons to static .code-block elements (project pages).
 */
function addCopyButtonsToStaticBlocks() {
  document.querySelectorAll('.code-block').forEach(function (block) {
    if (block.querySelector('.copy-btn')) return;

    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.type = 'button';
    btn.textContent = 'Sao chép';
    btn.setAttribute('aria-label', 'Sao chép đoạn code');

    btn.addEventListener('click', function () {
      var code = block.querySelector('code') ? block.querySelector('code').textContent : block.textContent;
      navigator.clipboard.writeText(code.trim()).then(function () {
        btn.textContent = 'Đã sao chép!';
        setTimeout(function () { btn.textContent = 'Sao chép'; }, 2000);
      }).catch(function () {
        btn.textContent = 'Lỗi!';
        setTimeout(function () { btn.textContent = 'Sao chép'; }, 2000);
      });
    });

    block.appendChild(btn);
  });
}

/* ── 3. Contact Form (AJAX via Formspree) ────────────────── */

function initContactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var status = document.getElementById('form-status');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Đang gửi…';

    if (status) {
      status.className = 'form-status';
      status.textContent = '';
      status.classList.remove('visually-hidden');
    }

    var data = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    })
      .then(function (res) {
        if (res.ok) {
          form.reset();
          if (status) {
            status.className = 'form-status success';
            status.textContent = '✅ Tin nhắn đã gửi thành công! Mình sẽ phản hồi sớm nhé.';
          }
        } else {
          return res.json().then(function (data) {
            throw new Error(data.error || 'Lỗi máy chủ');
          });
        }
      })
      .catch(function (err) {
        if (status) {
          status.className = 'form-status error';
          status.textContent = '❌ Gửi thất bại: ' + err.message + '. Hãy thử gửi email trực tiếp.';
        }
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Gửi tin nhắn';
      });
  });
}

/* ── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  loadReadme();
  addCopyButtonsToStaticBlocks();
  initContactForm();
});
