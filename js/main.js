(function(){
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Nav scroll shadow ---------- */
  var nav = document.getElementById("nav");
  function onScroll(){
    if (window.scrollY > 8) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  document.addEventListener("scroll", onScroll, { passive:true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById("navBurger");
  var mobile = document.getElementById("navMobile");
  burger.addEventListener("click", function(){
    var open = mobile.classList.toggle("open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  mobile.querySelectorAll("a").forEach(function(a){
    a.addEventListener("click", function(){
      mobile.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function(el){ el.classList.add("in-view"); });
  } else {
    var revealObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function(el){ revealObserver.observe(el); });
  }

  /* ---------- Count-up stats ---------- */
  var statEls = document.querySelectorAll(".stat-num, .impact-num");
  function animateCount(el){
    var raw = el.getAttribute("data-count") || el.textContent;
    var match = raw.match(/[\d.]+/);
    var target = match ? parseFloat(match[0]) : null;
    if (target === null || reduceMotion){ return; }
    var prefix = raw.slice(0, match.index);
    var suffix = raw.slice(match.index + match[0].length);
    var duration = 1100;
    var start = null;
    function step(ts){
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(eased * target);
      el.textContent = prefix + value + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target + suffix;
    }
    requestAnimationFrame(step);
  }
  if (statEls.length){
    statEls.forEach(function(el){
      if (!el.hasAttribute("data-count")) el.setAttribute("data-count", el.textContent);
    });
    if ("IntersectionObserver" in window){
      var statObserver = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting){
            animateCount(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      statEls.forEach(function(el){ statObserver.observe(el); });
    }
  }

})();
