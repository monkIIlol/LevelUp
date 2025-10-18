// js/comments.js
(() => {
    const STORAGE_PREFIX = "lug_comments_";

    // Utilidad: escapar HTML para evitar inyecciones
    const escapeHTML = (str) =>
        str.replace(/[&<>"'`=\/]/g, (s) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
            "`": "&#96;",
            "=": "&#61;",
            "/": "&#47;",
        }[s]));

    // Helpers de storage
    const loadComments = (postId) => {
        try {
            const raw = localStorage.getItem(STORAGE_PREFIX + postId);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    };
    const saveComments = (postId, comments) => {
        localStorage.setItem(STORAGE_PREFIX + postId, JSON.stringify(comments));
    };

    // Render de una lista de comentarios
    const renderComments = (ul, comments) => {
        ul.innerHTML = "";
        const sorted = [...comments].sort((a, b) => b.ts - a.ts); // más nuevos arriba
        if (sorted.length === 0) {
            ul.innerHTML = `<li class="comment-empty">Sé el primero en comentar 👇</li>`;
            return;
        }
        for (const c of sorted) {
            const li = document.createElement("li");
            li.className = "comment-item";
            const fecha = new Date(c.ts).toLocaleString("es-CL");
            li.innerHTML = `
        <article class="comment">
          <header class="comment__head">
            <strong class="comment__user">${escapeHTML(c.user)}</strong>
            <time class="comment__time" datetime="${new Date(c.ts).toISOString()}">${fecha}</time>
          </header>
          <p class="comment__text">${escapeHTML(c.text)}</p>
        </article>
      `;
            ul.appendChild(li);
        }
    };

    // Deducción del ID de post
    const getPostId = (rootEl) => {
        // Preferimos data-post-id si existe
        const fromData = rootEl?.dataset?.postId;
        if (fromData) return fromData;
        // Si no, usamos el nombre del archivo (sin extensión)
        const base = location.pathname.split("/").pop() || "";
        return base.replace(/\.[^.]+$/, ""); // ej. blog-detalle -> "blog-detalle"
    };

    // Inicialización de páginas de detalle (con formulario)
    const setupDetailPage = () => {
        const root = document.querySelector("[data-comments-root]");
        if (!root) return false;

        const postId = getPostId(root);
        const listEl = root.querySelector("[data-comments-list]");
        const form = root.querySelector("[data-comment-form]");
        const nameInput = root.querySelector("[name='comment_name']");
        const textInput = root.querySelector("[name='comment_text']");
        const counterEls = document.querySelectorAll(`[data-comment-count='${postId}']`);

        const updateCounters = (len) => {
            counterEls.forEach((el) => (el.textContent = String(len)));
        };

        // Carga inicial
        let comments = loadComments(postId);
        renderComments(listEl, comments);
        updateCounters(comments.length);

        // Envío
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const user = (nameInput.value || "").trim();
            const text = (textInput.value || "").trim();

            if (!user || !text) {
                alert("Por favor, completa tu nombre y comentario.");
                return;
            }
            if (text.length > 2000) {
                alert("Tu comentario es muy largo (máx. 2000 caracteres).");
                return;
            }

            const comment = {
                id: (crypto?.randomUUID && crypto.randomUUID()) || String(Date.now()),
                user,
                text,
                ts: Date.now(),
            };
            comments.push(comment);
            saveComments(postId, comments);
            renderComments(listEl, comments);
            updateCounters(comments.length);
            form.reset();
            textInput.blur();
        });

        return true;
    };

    // Inicialización de listado (mostrar contadores)
    const setupListPage = () => {
        const container = document.querySelector("[data-blog-list]");
        if (!container) return false;

        // Para cada card con data-post-id, pintamos el contador
        container.querySelectorAll("[data-post-id]").forEach((card) => {
            const pid = card.dataset.postId;
            const count = loadComments(pid).length;
            const badge = card.querySelector("[data-comment-count]");
            if (badge) badge.textContent = String(count);
        });

        return true;
    };

    document.addEventListener("DOMContentLoaded", () => {
        // Intentamos detalle; si no, intentamos listado
        if (!setupDetailPage()) {
            setupListPage();
        }
    });
})();