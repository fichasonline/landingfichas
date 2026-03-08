"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  motion,
  type MotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";

type SequenceConfig = {
  frameExtension?: string;
  frameCount: number;
  framePadding?: number;
  framePrefix: string;
  frameStart?: number;
  frameSuffix?: string;
  imagePath?: string;
  fit?: "contain" | "cover";
  backdrop?: "none" | "soft-cover";
};

type ExplodedProductStoryProps = {
  backgroundColor?: string;
  brandName: string;
  desktopBreakpoint?: number;
  desktopSequence?: SequenceConfig;
  formOverlay?: {
    eyebrow?: string;
    subtitle?: string;
    submitLabel?: string;
    title: string;
  };
  hero?: {
    eyebrow?: string;
    title: string;
    subtitle: string;
  };
  mobileSequence: SequenceConfig;
  productName: string;
  reverse?: boolean;
  showLayoutGuides?: boolean;
  whatsappOverlay?: {
    body?: string;
    buttonLabel: string;
    href: string;
    linkProps?: {
      rel?: string;
      target?: string;
    };
    title: string;
  };
};

function TimedOverlay({
  children,
  progress,
  range,
  className = "",
}: {
  children: ReactNode;
  className?: string;
  progress: MotionValue<number>;
  range: [number, number, number, number];
}) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const y = useTransform(progress, range, [36, 0, 0, -28]);
  const filter = useTransform(progress, range, [
    "blur(12px)",
    "blur(0px)",
    "blur(0px)",
    "blur(12px)",
  ]);
  const [isActive, setIsActive] = useState(() => {
    const current = progress.get();
    return current >= range[0] && current <= range[3];
  });

  useMotionValueEvent(progress, "change", (latest) => {
    setIsActive(latest >= range[0] && latest <= range[3]);
  });

  return (
    <motion.div
      className={`${className} ${isActive ? "pointer-events-auto" : "pointer-events-none"}`}
      style={{ opacity, y, filter }}
    >
      {children}
    </motion.div>
  );
}

function HeroOverlay({
  hero,
  progress,
}: {
  hero: {
    eyebrow?: string;
    title: string;
    subtitle: string;
  };
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, [0, 0.08, 0.16, 0.24], [1, 1, 0.45, 0]);
  const y = useTransform(progress, [0, 0.08, 0.16, 0.24], [0, 0, -16, -48]);
  const filter = useTransform(progress, [0, 0.08, 0.16, 0.24], [
    "blur(0px)",
    "blur(0px)",
    "blur(6px)",
    "blur(14px)",
  ]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 bottom-[10vh] z-20"
      style={{ opacity, y, filter }}
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
        {hero.eyebrow ? (
          <p className="mb-5 text-[10px] uppercase tracking-[0.34em] text-white/45 sm:text-[11px]">
            {hero.eyebrow}
          </p>
        ) : null}
        <div className="max-w-5xl">
          <p className="text-4xl font-medium tracking-[-0.05em] text-white/88 sm:text-5xl lg:text-[4.75rem] lg:leading-[0.94]">
            {hero.title}
          </p>
          <h1 className="mt-2 text-6xl font-medium tracking-[-0.08em] text-white/95 sm:text-7xl lg:text-[8.5rem] lg:leading-[0.9]">
            {hero.subtitle}
          </h1>
        </div>
      </div>
    </motion.div>
  );
}

function ScrollCue({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.1, 0.16, 0.24], [1, 1, 1, 0]);
  const y = useTransform(progress, [0, 0.1, 0.16, 0.24], [0, 0, 0, -8]);

  return (
    <motion.div
      className="pointer-events-none absolute right-4 top-14 z-20 sm:right-6 sm:top-16 lg:right-8 lg:top-20"
      style={{ opacity, y }}
    >
      <motion.div
        className="flex items-center gap-3 rounded-full border border-white/15 bg-black/35 px-3 py-2 backdrop-blur"
        animate={{
          scale: [1, 1.035, 1],
          boxShadow: [
            "0 0 0 rgba(30,227,159,0)",
            "0 0 0.9rem rgba(30,227,159,0.12)",
            "0 0 0 rgba(30,227,159,0)",
          ],
        }}
        transition={{
          duration: 1.8,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#1ee39f]/25 bg-[#0a1712]">
          <motion.svg
            aria-hidden="true"
            className="h-3.5 w-3.5 text-[#1ee39f]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ y: [-1, 5, -1], opacity: [0.9, 1, 0.9] }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            <path d="M12 5v14" />
            <path d="m7 14 5 5 5-5" />
          </motion.svg>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-[0.34em] text-white/45">
            Segui
          </span>
          <span className="text-[11px] uppercase tracking-[0.24em] text-white/72 sm:text-xs">
            Scroll
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function LayoutGuides({ isDesktop }: { isDesktop: boolean }) {
  const columnCount = isDesktop ? 12 : 4;
  const rowCount = isDesktop ? 6 : 8;
  const columns = Array.from({ length: columnCount }, (_, index) => index + 1);
  const rows = Array.from({ length: rowCount }, (_, index) => index + 1);

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <div className="absolute inset-4 rounded-[1.5rem] border border-[#1ee39f]/20 sm:inset-6 lg:inset-8" />

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(30,227,159,0.16) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(30,227,159,0.14) 1px, transparent 1px)
          `,
          backgroundSize: `${100 / columnCount}% 100%, 100% ${100 / rowCount}%`,
        }}
      />

      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#1ee39f]/50" />
      <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#1ee39f]/35" />

      <div className="absolute inset-x-4 top-4 flex justify-between text-[9px] uppercase tracking-[0.28em] text-[#8bf5cb]/80 sm:inset-x-6 sm:top-6 lg:inset-x-8 lg:top-8">
        {columns.map((column) => (
          <span key={`col-${column}`}>C{column}</span>
        ))}
      </div>

      <div className="absolute inset-y-4 left-4 flex flex-col justify-between text-[9px] uppercase tracking-[0.28em] text-[#8bf5cb]/80 sm:inset-y-6 sm:left-6 lg:inset-y-8 lg:left-8">
        {rows.map((row) => (
          <span key={`row-${row}`}>R{row}</span>
        ))}
      </div>

      <div className="absolute left-1/2 top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#1ee39f]/60 bg-[#050505]/65">
        <div className="h-1.5 w-1.5 rounded-full bg-[#1ee39f]" />
      </div>

      <div className="absolute bottom-4 left-4 rounded-full border border-[#1ee39f]/20 bg-[#050505]/70 px-3 py-1 text-[9px] uppercase tracking-[0.28em] text-[#8bf5cb]/80 backdrop-blur sm:bottom-6 sm:left-6 lg:bottom-8 lg:left-8">
        Layout Guides
      </div>
    </div>
  );
}

function ScrollProgressHud({ scrollPercent }: { scrollPercent: number }) {
  return (
    <div className="pointer-events-none absolute inset-y-4 right-4 z-20 flex flex-col justify-between sm:inset-y-6 sm:right-6 lg:inset-y-8 lg:right-8">
      <div className="rounded-full border border-[#1ee39f]/20 bg-[#050505]/70 px-3 py-1 text-[9px] uppercase tracking-[0.28em] text-[#8bf5cb]/80 backdrop-blur">
        Scroll {scrollPercent}%
      </div>

      <div className="flex flex-col items-end gap-2 text-[9px] uppercase tracking-[0.28em] text-[#8bf5cb]/65">
        <span>100%</span>
        <span>75%</span>
        <span>50%</span>
        <span>25%</span>
        <span>0%</span>
      </div>
    </div>
  );
}

function WhatsAppOverlay({
  overlay,
  progress,
}: {
  overlay: {
    body?: string;
    buttonLabel: string;
    href: string;
    linkProps?: {
      rel?: string;
      target?: string;
    };
    title: string;
  };
  progress: MotionValue<number>;
}) {
  return (
    <TimedOverlay
      className="absolute inset-x-0 top-[26vh] z-20"
      progress={progress}
      range={[0.2, 0.25, 0.34, 0.42]}
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="max-w-xl rounded-[2rem] border border-white/12 bg-black/38 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-7">
          <p className="text-[10px] uppercase tracking-[0.34em] text-[#8bf5cb]/90 sm:text-[11px]">
            25% / Contacto
          </p>
          <h2 className="mt-4 text-3xl font-medium tracking-[-0.05em] text-white/92 sm:text-4xl">
            {overlay.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/62 sm:text-base">
            {overlay.body}
          </p>
          <a
            href={overlay.href}
            className="mt-7 inline-flex items-center justify-center rounded-full bg-[#1ee39f] px-6 py-3 text-sm font-medium text-[#04110c] transition hover:bg-[#43f0b4]"
            {...overlay.linkProps}
          >
            {overlay.buttonLabel}
          </a>

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-2xl font-medium tracking-[-0.04em] text-white/88 sm:text-3xl">
              Si queres dejanos tu email y te enviamos todas las novedades.
            </p>
          </div>
        </div>
      </div>
    </TimedOverlay>
  );
}

function LeadFormOverlay({
  overlay,
  progress,
}: {
  overlay: {
    eyebrow?: string;
    subtitle?: string;
    submitLabel?: string;
    title: string;
  };
  progress: MotionValue<number>;
}) {
  return (
    <TimedOverlay
      className="absolute inset-x-0 top-[44vh] z-20 -translate-y-1/2"
      progress={progress}
      range={[0.44, 0.5, 0.62, 0.72]}
    >
      <div className="mx-auto flex w-full max-w-7xl justify-center px-6 sm:px-8 lg:px-12">
        <form
          className="w-full max-w-2xl rounded-[2rem] border border-white/12 bg-black/42 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:p-7"
          onSubmit={(event) => event.preventDefault()}
        >
          <p className="text-[10px] uppercase tracking-[0.34em] text-[#8bf5cb]/90 sm:text-[11px]">
            {overlay.eyebrow ?? "50% / Formulario"}
          </p>
          <h2 className="mt-4 text-3xl font-medium tracking-[-0.05em] text-white/92 sm:text-4xl">
            {overlay.title}
          </h2>
          {overlay.subtitle ? (
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
              {overlay.subtitle}
            </p>
          ) : null}

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <input
              type="email"
              placeholder="Email"
              className="h-12 rounded-2xl border border-white/10 bg-black/25 px-4 text-sm text-white outline-none placeholder:text-white/28 focus:border-[#1ee39f]/60"
            />
            <input
              type="tel"
              placeholder="Phone"
              className="h-12 rounded-2xl border border-white/10 bg-black/25 px-4 text-sm text-white outline-none placeholder:text-white/28 focus:border-[#1ee39f]/60"
            />
            <input
              type="text"
              placeholder="Nombre"
              className="h-12 rounded-2xl border border-white/10 bg-black/25 px-4 text-sm text-white outline-none placeholder:text-white/28 focus:border-[#1ee39f]/60 md:col-span-2"
            />
          </div>

          <button
            type="submit"
            className="mt-6 inline-flex items-center justify-center rounded-full border border-[#1ee39f]/25 bg-[#0a1712] px-6 py-3 text-sm font-medium text-white transition hover:border-[#1ee39f]/45 hover:bg-[#11231b]"
          >
            {overlay.submitLabel ?? "Quiero recibir novedades"}
          </button>
        </form>
      </div>
    </TimedOverlay>
  );
}

export function ExplodedProductStory({
  backgroundColor = "#050505",
  brandName,
  desktopBreakpoint = 1024,
  desktopSequence,
  formOverlay,
  hero,
  mobileSequence,
  productName,
  reverse = false,
  showLayoutGuides = false,
  whatsappOverlay,
}: ExplodedProductStoryProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const drawRafRef = useRef<number | null>(null);
  const frameIndexRef = useRef(0);
  const viewportRef = useRef({ width: 0, height: 0 });

  const [loadedCount, setLoadedCount] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const activeSequence = useMemo(
    () => ({
      frameExtension: "webp",
      framePadding: 4,
      frameStart: 0,
      imagePath: "/sequence",
      fit: "contain" as const,
      backdrop: "none" as const,
      ...(isDesktop && desktopSequence ? desktopSequence : mobileSequence),
    }),
    [desktopSequence, isDesktop, mobileSequence],
  );

  const frameSources = useMemo(
    () =>
      Array.from({ length: activeSequence.frameCount }, (_, index) => {
        const sequenceIndex = String(index + activeSequence.frameStart).padStart(
          activeSequence.framePadding,
          "0",
        );
        const suffix = activeSequence.frameSuffix
          ? `_${activeSequence.frameSuffix}`
          : "";
        return `${activeSequence.imagePath}/${activeSequence.framePrefix}-${sequenceIndex}${suffix}.${activeSequence.frameExtension}`;
      }),
    [
      activeSequence.frameCount,
      activeSequence.frameExtension,
      activeSequence.framePadding,
      activeSequence.framePrefix,
      activeSequence.frameStart,
      activeSequence.frameSuffix,
      activeSequence.imagePath,
    ],
  );

  const progressLabel = `${Math.round((loadedCount / activeSequence.frameCount) * 100)}%`;

  const getFrameIndexFromProgress = (progress: number, totalFrames: number) => {
    const mappedIndex = Math.min(
      totalFrames - 1,
      Math.max(0, Math.round(progress * (totalFrames - 1))),
    );

    return reverse ? totalFrames - 1 - mappedIndex : mappedIndex;
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${desktopBreakpoint}px)`);
    const updateViewport = (event?: MediaQueryListEvent) => {
      setIsDesktop(event ? event.matches : mediaQuery.matches);
    };

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => {
      mediaQuery.removeEventListener("change", updateViewport);
    };
  }, [desktopBreakpoint]);

  useEffect(() => {
    setScrollPercent(Math.round(scrollYProgress.get() * 100));
  }, [scrollYProgress]);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const frame = framesRef.current[index];

    if (!canvas || !frame) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const { width, height } = viewportRef.current;

    if (width === 0 || height === 0) {
      return;
    }

    const sourceWidth = frame.naturalWidth || frame.width;
    const sourceHeight = frame.naturalHeight || frame.height;
    const containScale = Math.min(width / sourceWidth, height / sourceHeight);
    const coverScale = Math.max(width / sourceWidth, height / sourceHeight);
    const scale =
      activeSequence.fit === "cover" ? coverScale : containScale;
    const renderWidth = sourceWidth * scale;
    const renderHeight = sourceHeight * scale;
    const offsetX = (width - renderWidth) / 2;
    const offsetY = (height - renderHeight) / 2;

    context.clearRect(0, 0, width, height);
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);

    if (
      activeSequence.backdrop === "soft-cover" &&
      activeSequence.fit === "contain"
    ) {
      const backdropWidth = sourceWidth * coverScale;
      const backdropHeight = sourceHeight * coverScale;
      const backdropX = (width - backdropWidth) / 2;
      const backdropY = (height - backdropHeight) / 2;

      context.save();
      context.globalAlpha = 0.32;
      context.filter = "blur(64px) brightness(0.45) saturate(1.15)";
      context.drawImage(
        frame,
        backdropX,
        backdropY,
        backdropWidth,
        backdropHeight,
      );
      context.restore();
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(frame, offsetX, offsetY, renderWidth, renderHeight);
  };

  const scheduleDraw = (index: number) => {
    if (drawRafRef.current !== null) {
      cancelAnimationFrame(drawRafRef.current);
    }

    drawRafRef.current = requestAnimationFrame(() => {
      frameIndexRef.current = index;
      drawFrame(index);
      drawRafRef.current = null;
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const resizeCanvas = () => {
      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      viewportRef.current = { width, height };
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (status === "ready") {
        drawFrame(frameIndexRef.current);
      } else {
        context.clearRect(0, 0, width, height);
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, width, height);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("orientationchange", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("orientationchange", resizeCanvas);
    };
  }, [activeSequence.backdrop, activeSequence.fit, backgroundColor, status]);

  useEffect(() => {
    let isCancelled = false;

    const loadFrame = (source: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.decoding = "async";
        image.src = source;

        image.onload = async () => {
          try {
            await image.decode();
          } catch {
            // Decode support is inconsistent; onload is enough to render.
          }

          if (!isCancelled) {
            setLoadedCount((current) => current + 1);
          }

          resolve(image);
        };

        image.onerror = () => {
          reject(new Error(`Failed to load frame: ${source}`));
        };
      });

    const preloadSequence = async () => {
      try {
        setLoadedCount(0);
        setStatus("loading");
        const frames = await Promise.all(frameSources.map(loadFrame));

        if (isCancelled) {
          return;
        }

        framesRef.current = frames;
        setStatus("ready");
        const initialIndex = getFrameIndexFromProgress(
          scrollYProgress.get(),
          frames.length,
        );
        scheduleDraw(initialIndex);
      } catch {
        if (!isCancelled) {
          isCancelled = true;
          framesRef.current = [];
          setStatus("error");
        }
      }
    };

    preloadSequence();

    return () => {
      isCancelled = true;

      if (drawRafRef.current !== null) {
        cancelAnimationFrame(drawRafRef.current);
      }
    };
  }, [frameSources, scrollYProgress]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    if (status === "loading") {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    } else {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    }

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [status]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollPercent(Math.round(latest * 100));

    if (status !== "ready" || framesRef.current.length === 0) {
      return;
    }

    const nextIndex = getFrameIndexFromProgress(
      latest,
      framesRef.current.length,
    );

    if (nextIndex !== frameIndexRef.current) {
      scheduleDraw(nextIndex);
    }
  });

  return (
    <section
      ref={sectionRef}
      className="relative h-[400vh]"
      style={{ backgroundColor }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas
          ref={canvasRef}
          aria-label={`${brandName} ${productName} image sequence`}
          className="absolute inset-0 h-full w-full"
        />

        {hero ? <HeroOverlay hero={hero} progress={scrollYProgress} /> : null}
        {whatsappOverlay ? (
          <WhatsAppOverlay overlay={whatsappOverlay} progress={scrollYProgress} />
        ) : null}
        {formOverlay ? (
          <LeadFormOverlay overlay={formOverlay} progress={scrollYProgress} />
        ) : null}
        <ScrollCue progress={scrollYProgress} />
        {showLayoutGuides ? <LayoutGuides isDesktop={isDesktop} /> : null}
        {showLayoutGuides ? <ScrollProgressHud scrollPercent={scrollPercent} /> : null}

        {status === "loading" ? (
          <div
            className="absolute inset-0 z-20 grid place-items-center"
            style={{ backgroundColor }}
          >
            <div className="flex flex-col items-center gap-5 text-center">
              <div className="h-12 w-12 animate-spin rounded-full border border-white/15 border-t-white/80" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.36em] text-white/45 sm:text-[11px]">
                  Loading Sequence
                </p>
                <p className="mt-2 text-sm text-white/65">{progressLabel}</p>
              </div>
            </div>
          </div>
        ) : null}

        {status === "error" ? (
          <div
            className="absolute inset-0 z-20 grid place-items-center px-6 text-center"
            style={{ backgroundColor }}
          >
            <div className="max-w-lg">
              <p className="text-[10px] uppercase tracking-[0.36em] text-white/45 sm:text-[11px]">
                Sequence Missing
              </p>
              <h3 className="mt-4 text-3xl font-medium tracking-[-0.05em] text-white/90 sm:text-4xl">
                Add the frame sequence to begin the scroll experience.
              </h3>
              <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">
                Expected pattern: {activeSequence.framePrefix}-
                {String(activeSequence.frameStart).padStart(
                  activeSequence.framePadding,
                  "0",
                )}
                {activeSequence.frameSuffix
                  ? `_${activeSequence.frameSuffix}`
                  : ""}
                .{activeSequence.frameExtension} through{" "}
                {activeSequence.framePrefix}-
                {String(
                  activeSequence.frameStart + activeSequence.frameCount - 1,
                ).padStart(activeSequence.framePadding, "0")}
                {activeSequence.frameSuffix
                  ? `_${activeSequence.frameSuffix}`
                  : ""}
                .{activeSequence.frameExtension} in {activeSequence.imagePath}.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
