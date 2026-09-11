/* Joshua.Tech portfolio — static site interactions */
(function () {
  "use strict";

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var nodes = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (n) { n.setAttribute("data-visible", "true"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-visible", "true");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    nodes.forEach(function (n) {
      n.setAttribute("data-visible", "false");
      io.observe(n);
    });
  }

  /* ---------- Sticky header state ---------- */
  function initHeader() {
    var header = document.querySelector("header");
    if (!header) return;
    function onScroll() {
      var on = window.scrollY > 12;
      header.classList.toggle("border-border", on);
      header.classList.toggle("bg-background/85", on);
      header.classList.toggle("backdrop-blur-xl", on);
      header.classList.toggle("border-transparent", !on);
      header.classList.toggle("bg-transparent", !on);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  function initMenu() {
    var toggle = document.getElementById("menu-toggle");
    var menu = document.getElementById("mobile-menu");
    var close = document.getElementById("menu-close");
    if (!toggle || !menu) return;

    function setOpen(open) {
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
      if (open) {
        var first = menu.querySelector("a");
        if (first) first.focus();
      } else {
        toggle.focus();
      }
    }

    toggle.addEventListener("click", function () { setOpen(menu.hidden); });
    if (close) close.addEventListener("click", function () { setOpen(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) setOpen(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768 && !menu.hidden) setOpen(false);
    });
  }

  /* ---------- Project filtering ---------- */
  function initFilters() {
    var tabs = document.querySelectorAll("[data-filter]");
    var items = document.querySelectorAll(".project-item");
    if (!tabs.length || !items.length) return;

    var ACTIVE = ["border-primary", "bg-primary/10", "text-primary"];
    var IDLE = ["border-border", "text-muted-foreground", "hover:border-border-strong", "hover:text-foreground"];

    function apply(value) {
      tabs.forEach(function (tab) {
        var on = tab.getAttribute("data-filter") === value;
        tab.setAttribute("aria-selected", on ? "true" : "false");
        ACTIVE.forEach(function (c) { tab.classList.toggle(c, on); });
        IDLE.forEach(function (c) { tab.classList.toggle(c, !on); });
      });
      items.forEach(function (item) {
        var show = value === "All" || item.getAttribute("data-category") === value;
        item.style.display = show ? "" : "none";
        if (show) item.setAttribute("data-visible", "true");
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () { apply(tab.getAttribute("data-filter")); });
    });
    apply("All");
  }

  /* ---------- Smooth scroll for in-page anchors ---------- */
  function initAnchors() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      var id = a.getAttribute("href").slice(1);
      var target = id && document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", "#" + id);
    });
  }

  function init() {
    initReveal();
    initHeader();
    initMenu();
    initFilters();
    initAnchors();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
