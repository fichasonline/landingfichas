(function () {
  const config = window.LANDING_CONFIG || {};
  const leadForm = document.getElementById("lead-form");
  const formStatus = document.getElementById("form-status");
  const storageKey = "landing-attribution-v1";
  const sessionKey = "landing-session-id";
  const attribution = captureAttribution();
  const sessionId = getSessionId();

  document.addEventListener("DOMContentLoaded", () => {
    applyBrandName();
    renderRooms();
    hydrateWhatsAppLinks();
    injectGoogleAnalytics();
    injectMetaPixel();
    bindTrackedLinks();
    bindForm();
    initMotion();

    trackEvent("landing_view", {
      session_id: sessionId,
      utm_source: attribution.utm_source || null,
      utm_campaign: attribution.utm_campaign || null,
      referrer_host: attribution.referrer_host || null
    });
  });

  function applyBrandName() {
    const brandNodes = document.querySelectorAll("[data-brand-name]");
    brandNodes.forEach((node) => {
      node.textContent = config.brandName || "Mesa Abierta";
    });
  }

  function renderRooms() {
    const rooms = Array.isArray(config.rooms) && config.rooms.length
      ? config.rooms
      : ["PokerStars", "GGPoker", "partypoker", "888poker"];
    const marquee = document.querySelector("[data-room-marquee]");
    const grid = document.querySelector("[data-room-grid]");

    if (marquee) {
      marquee.innerHTML = rooms
        .map((room) => `<span class="room-chip">${escapeHtml(room)}</span>`)
        .join("");
    }

    if (grid) {
      grid.innerHTML = rooms
        .map((room) => `<div class="room-logo">${escapeHtml(room)}</div>`)
        .join("");
    }
  }

  function hydrateWhatsAppLinks() {
    const number = (config.whatsappNumber || "").replace(/\D/g, "");
    const messages = config.whatsappMessages || {};
    const links = document.querySelectorAll(".whatsapp-link");

    links.forEach((link) => {
      const key = link.dataset.messageKey || "primary";
      const text = messages[key] || messages.primary || "Hola, quiero recibir mas informacion.";

      if (!number) {
        link.classList.add("is-disabled");
        link.setAttribute("aria-disabled", "true");
        link.removeAttribute("target");
        link.removeAttribute("rel");
        link.href = "#newsletter";
        return;
      }

      const params = new URLSearchParams({ text });
      link.href = `https://wa.me/${number}?${params.toString()}`;
    });
  }

  function bindTrackedLinks() {
    const tracked = document.querySelectorAll("[data-track]");
    tracked.forEach((node) => {
      node.addEventListener("click", () => {
        trackEvent(node.dataset.track, {
          session_id: sessionId,
          utm_source: attribution.utm_source || null,
          utm_campaign: attribution.utm_campaign || null
        });
      });
    });
  }

  function bindForm() {
    if (!leadForm) {
      return;
    }

    leadForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearStatus();

      const formData = new FormData(leadForm);
      const email = String(formData.get("email") || "").trim();
      const consent = formData.get("consent") === "on";
      const honeypot = String(formData.get("website") || "").trim();
      const submitButton = leadForm.querySelector('button[type="submit"]');

      if (!email || !isValidEmail(email)) {
        setStatus("Ingresa un email valido.", true);
        return;
      }

      if (!consent) {
        setStatus("Necesitas aceptar el envio semanal para suscribirte.", true);
        return;
      }

      const payload = {
        email,
        consent,
        website: honeypot,
        sessionId,
        page: window.location.pathname,
        pageTitle: document.title,
        referrer: attribution.referrer || document.referrer || "",
        landingVersion: "v3-film-scroll",
        attribution,
        userAgent: window.navigator.userAgent,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
        submittedAt: new Date().toISOString()
      };

      submitButton.disabled = true;
      setStatus("Enviando...", false);

      trackEvent("lead_submit_attempt", {
        session_id: sessionId,
        utm_source: attribution.utm_source || null,
        utm_campaign: attribution.utm_campaign || null
      });

      try {
        const response = await fetch("/api/lead", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const data = await safeJson(response);

        if (!response.ok) {
          throw new Error(data && data.error ? data.error : "No se pudo enviar.");
        }

        leadForm.reset();
        setStatus("Listo. Revisa tu bandeja y, si quieres, escribenos por WhatsApp.", false, true);
        trackEvent("lead_submit_success", {
          session_id: sessionId,
          utm_source: attribution.utm_source || null,
          utm_campaign: attribution.utm_campaign || null
        });
      } catch (error) {
        setStatus(error.message || "No se pudo enviar el formulario.", true);
        trackEvent("lead_submit_error", {
          session_id: sessionId,
          error: error.message || "submit_error"
        });
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  function initMotion() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    if (!window.gsap || !window.ScrollTrigger) {
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);
    initRevealAnimations(window.gsap);
    initFilmStage(window.gsap, window.ScrollTrigger);
  }

  function initRevealAnimations(gsap) {
    const elements = gsap.utils.toArray("[data-reveal]");
    elements.forEach((element) => {
      gsap.fromTo(
        element,
        {
          autoAlpha: 0,
          y: 36,
          filter: "blur(10px)"
        },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 84%",
            once: true
          }
        }
      );
    });
  }

  function initFilmStage(gsap, ScrollTrigger) {
    const stage = document.querySelector("[data-film-stage]");
    if (!stage) {
      return;
    }

    const sticky = stage.querySelector(".film-stage__sticky");
    const canvas = stage.querySelector("[data-film-canvas]");
    const captions = gsap.utils.toArray(stage.querySelectorAll("[data-film-caption]"));
    const progress = stage.querySelector("[data-film-progress]");
    const sequence = resolveHeroSequence(config.heroSequence);

    if (!sticky || !canvas || !captions.length || !sequence.length) {
      return;
    }

    preloadFrames(sequence)
      .then((frames) => {
        stage.classList.add("is-enhanced");

        gsap.set(captions, {
          autoAlpha: 0,
          y: 18
        });

        const renderer = createFrameRenderer(canvas, frames);
        const frameState = { index: 0 };

        renderer.resize();
        renderer.draw(0);

        const onResize = () => {
          renderer.resize();
          renderer.draw(frameState.index);
        };

        window.addEventListener("resize", onResize);

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: `+=${getFilmScrollLength(stage)}`,
            scrub: 0.18,
            pin: sticky,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onEnter: () => {
              trackEvent("film_stage_view", {
                session_id: sessionId,
                utm_source: attribution.utm_source || null,
                utm_campaign: attribution.utm_campaign || null
              });
            },
            onUpdate: (self) => {
              if (progress) {
                progress.style.transform = `scaleX(${self.progress})`;
              }
            }
          }
        });

        timeline.to(
          frameState,
          {
            index: sequence.length - 1,
            duration: 1,
            ease: "none",
            snap: "index",
            onUpdate: () => {
              renderer.draw(frameState.index);
            }
          },
          0
        );

        captions.forEach((caption) => {
          const start = clamp(parseFloat(caption.dataset.start || "0"), 0, 1);
          const end = clamp(parseFloat(caption.dataset.end || "1"), 0, 1);
          const fadeOutAt = Math.max(start + (end - start) * 0.7, end - 0.12);

          timeline.to(
            caption,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.08,
              ease: "power2.out"
            },
            start
          );

          if (caption.dataset.persist !== "true") {
            timeline.to(
              caption,
              {
                autoAlpha: 0,
                y: -12,
                duration: 0.07,
                ease: "power2.in"
              },
              fadeOutAt
            );
          }
        });

        ScrollTrigger.addEventListener("refresh", onResize);
        ScrollTrigger.refresh();
      })
      .catch(() => {
        // If the frame sequence fails to load, the rest of the landing still works.
      });
  }

  function resolveHeroSequence(sequenceConfig) {
    const basePath = sequenceConfig && sequenceConfig.basePath
      ? String(sequenceConfig.basePath)
      : "/frames/video 1";
    const filePrefix = sequenceConfig && sequenceConfig.filePrefix
      ? String(sequenceConfig.filePrefix)
      : "ezgif-frame-";
    const extension = sequenceConfig && sequenceConfig.extension
      ? String(sequenceConfig.extension)
      : "jpg";
    const start = sequenceConfig && Number.isFinite(sequenceConfig.start)
      ? Number(sequenceConfig.start)
      : 1;
    const count = sequenceConfig && Number.isFinite(sequenceConfig.count)
      ? Number(sequenceConfig.count)
      : 40;
    const pad = sequenceConfig && Number.isFinite(sequenceConfig.pad)
      ? Number(sequenceConfig.pad)
      : 3;

    return Array.from({ length: count }, (_, offset) => {
      const number = String(start + offset).padStart(pad, "0");
      return encodeURI(`${basePath}/${filePrefix}${number}.${extension}`);
    });
  }

  function preloadFrames(urls) {
    return Promise.all(
      urls.map((url) => new Promise((resolve, reject) => {
        const image = new Image();
        image.decoding = "async";
        image.loading = "eager";
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`frame_load_error:${url}`));
        image.src = url;
      }))
    );
  }

  function createFrameRenderer(canvas, frames) {
    const context = canvas.getContext("2d", { alpha: false });

    if (!context) {
      return {
        resize() {},
        draw() {}
      };
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
    }

    function draw(index) {
      const safeIndex = clamp(Math.round(index), 0, frames.length - 1);
      const image = frames[safeIndex];

      if (!image || !image.naturalWidth || !image.naturalHeight) {
        return;
      }

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imageWidth = image.naturalWidth;
      const imageHeight = image.naturalHeight;
      const scale = Math.max(canvasWidth / imageWidth, canvasHeight / imageHeight);
      const drawWidth = imageWidth * scale;
      const drawHeight = imageHeight * scale;
      const offsetX = (canvasWidth - drawWidth) * 0.5;
      const offsetY = (canvasHeight - drawHeight) * 0.5;

      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
    }

    return { resize, draw };
  }

  function getFilmScrollLength(stage) {
    const base = Number(stage.dataset.scrollLength || 4200);
    if (window.innerWidth <= 640) {
      return Math.round(base * 0.72);
    }
    if (window.innerWidth <= 980) {
      return Math.round(base * 0.84);
    }
    return base;
  }

  function injectGoogleAnalytics() {
    const measurementId = (config.gaMeasurementId || "").trim();
    if (!measurementId) {
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", measurementId, { anonymize_ip: true });

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
  }

  function injectMetaPixel() {
    const pixelId = (config.metaPixelId || "").trim();
    if (!pixelId || typeof window.fbq === "function") {
      return;
    }

    (function (f, b, e, v, n, t, s) {
      if (f.fbq) {
        return;
      }
      n = f.fbq = function () {
        if (n.callMethod) {
          n.callMethod.apply(n, arguments);
          return;
        }
        n.queue.push(arguments);
      };
      if (!f._fbq) {
        f._fbq = n;
      }
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js"));

    window.fbq("init", pixelId);
    window.fbq("track", "PageView");
  }

  function captureAttribution() {
    const allowedKeys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "fbclid",
      "gclid"
    ];
    const params = new URLSearchParams(window.location.search);
    const next = {};
    const stored = loadStoredAttribution();

    allowedKeys.forEach((key) => {
      const value = params.get(key);
      if (value) {
        next[key] = value;
      }
    });

    next.referrer = stored.referrer || document.referrer || "";
    next.referrer_host = stored.referrer_host || getHost(next.referrer);
    next.landing_path = window.location.pathname;
    next.first_seen_at = stored.first_seen_at || new Date().toISOString();

    const merged = Object.assign({}, stored, next);
    saveStoredAttribution(merged);
    return merged;
  }

  function loadStoredAttribution() {
    try {
      const raw = window.localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      return {};
    }
  }

  function saveStoredAttribution(value) {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch (error) {
      // Ignore storage issues in private browsing modes.
    }
  }

  function getSessionId() {
    try {
      const existing = window.sessionStorage.getItem(sessionKey);
      if (existing) {
        return existing;
      }
      const created = window.crypto && typeof window.crypto.randomUUID === "function"
        ? window.crypto.randomUUID()
        : `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      window.sessionStorage.setItem(sessionKey, created);
      return created;
    } catch (error) {
      return `session-${Date.now()}`;
    }
  }

  function trackEvent(name, data) {
    const payload = flattenPayload(Object.assign({ event: name }, data || {}));
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);

    if (typeof window.gtag === "function") {
      window.gtag("event", name, payload);
    }

    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", name, payload);
    }
  }

  function flattenPayload(payload) {
    const next = {};
    Object.keys(payload).forEach((key) => {
      const value = payload[key];
      if (
        value === null ||
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        next[key] = value;
      }
    });
    return next;
  }

  function setStatus(message, isError, isSuccess) {
    if (!formStatus) {
      return;
    }

    formStatus.textContent = message;
    formStatus.classList.toggle("is-error", Boolean(isError));
    formStatus.classList.toggle("is-success", Boolean(isSuccess));
  }

  function clearStatus() {
    if (!formStatus) {
      return;
    }
    formStatus.textContent = "";
    formStatus.classList.remove("is-error", "is-success");
  }

  function safeJson(response) {
    return response
      .json()
      .catch(() => ({}));
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function getHost(value) {
    if (!value) {
      return "";
    }
    try {
      return new URL(value).hostname;
    } catch (error) {
      return "";
    }
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
}());
