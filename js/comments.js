// js/comments.js — sesión obligatoria (valida contra lug_users)
(() => {
  const STORAGE_PREFIX = "lug_comments_";
  const USERS_KEY      = "lug_users";
  const SESSION_KEY    = "lug_session";

  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  const escapeHTML = (str="") =>
    String(str).replace(/[&<>"'`=\/]/g, s => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","`":"&#96;","=":"&#61;","/":"&#47;"
    }[s]));

  // Sesión válida = existe en lug_users y coincide su password
  const getValidSession = () => {
    try {
      const s = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
      if (!s || !s.email) return null;
      const u = users[s.email];
      if (!u || u.password !== s.password) return null;
      return u; // devolvemos el usuario completo guardado
    } catch { return null; }
  };

  const getDisplayName = (u) => {
    if (!u) return "";
    const name = [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
    return name || (u.email ? u.email.split("@")[0] : "Usuario");
  };

  // Storage comentarios
  const load = (postId) => {
    try { return JSON.parse(localStorage.getItem(STORAGE_PREFIX + postId) || "[]"); }
    catch { return []; }
  };
  const save = (postId, list) => {
    localStorage.setItem(STORAGE_PREFIX + postId, JSON.stringify(list));
  };

  // postId desde data-post-id o nombre de archivo
  const getPostId = () => {
    const host = $("[data-post-id]");
    if (host?.dataset?.postId) return host.dataset.postId;
    const base = location.pathname.split("/").pop() || "blog";
    return base.replace(/\.[^.]+$/, "");
  };

  const renderList = (ul, comments=[]) => {
    ul.innerHTML = "";
    if (!comments.length) {
      ul.innerHTML = `<li class="comment-empty">Sé el primero en comentar 👇</li>`;
      return;
    }
    const sorted = [...comments].sort((a,b) => b.ts - a.ts);
    for (const c of sorted) {
      const li = document.createElement("li");
      li.className = "comment-item";
      li.innerHTML = `
        <article class="comment">
          <header class="comment__head">
            <strong class="comment__user">${escapeHTML(c.user)}</strong>
            <time class="comment__time" datetime="${new Date(c.ts).toISOString()}">
              ${new Date(c.ts).toLocaleString("es-CL")}
            </time>
          </header>
          <p class="comment__text">${escapeHTML(c.text)}</p>
        </article>`;
      ul.appendChild(li);
    }
  };

  // Detalle (form + lista + bloqueo sin sesión)
  const setupDetail = () => {
    const root = $("[data-comments-root]");
    if (!root) return false;

    const postId = getPostId();
    const ul    = $("[data-comments-list]", root);
    const form  = $("[data-comment-form]", root);
    const txt   = $("[name='comment_text']", root);

    const updateCounters = (len) =>
      $$(`[data-comment-count='${postId}']`).forEach(el => el.textContent = String(len));

    let comments = load(postId);
    renderList(ul, comments);
    updateCounters(comments.length);

    let sessionUser = getValidSession();
    if (!sessionUser) {
      const warn = document.createElement("p");
      warn.className = "comment-warning";
      warn.innerHTML = `Debes <a href="login.html">iniciar sesión</a> para comentar.`;
      root.insertBefore(warn, form);
      form.querySelector("button[type='submit']")?.setAttribute("disabled", "disabled");
      txt?.setAttribute("disabled", "disabled");
      form.addEventListener("submit", (e) => e.preventDefault());
      return true;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      sessionUser = getValidSession(); // revalida por si cerraste sesión en otra pestaña
      if (!sessionUser) { alert("Tu sesión expiró. Inicia sesión nuevamente."); return; }

      const text = (txt?.value || "").trim();
      if (!text) { alert("Escribe tu comentario."); return; }

      const item = {
        id: (crypto.randomUUID?.() || String(Date.now())),
        user: getDisplayName(sessionUser),
        text,
        ts: Date.now(),
      };
      comments.push(item);
      save(postId, comments);
      renderList(ul, comments);
      updateCounters(comments.length);
      form.reset();
      txt?.blur();
    });

    return true;
  };

  // Listado (blog.html): badges
  const setupList = () => {
    const grid = document.querySelector("[data-blog-list]");
    if (!grid) return false;
    grid.querySelectorAll("[data-post-id]").forEach(card => {
      const pid   = card.dataset.postId;
      const badge = card.querySelector("[data-comment-count]");
      if (badge) badge.textContent = String(load(pid).length);
    });
    return true;
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (!setupDetail()) setupList();
  });
})();
