import { useEffect, useRef, useState } from "react";

const TARGET = new Date(2026, 10, 1, 8, 0, 0, 0);

const QUIPS = {
  waiting: [
    "08:00. Not 08:07. Not “around 8”.",
    "I will know if the snacks moved.",
    "Do not rehearse your hello. It will sound like a confession.",
    "Cyan cardigan. You will see me before you are ready.",
    "Looking busy is the trailer. Being useful is the film.",
  ],
  here: [
    "I arrived at 8. The story about traffic has been archived.",
    "Nice countdown. I already walked past it.",
    "The fuzzy cardigan is not camouflage.",
    "If this tab is open, the work tab is feeling lonely.",
    "The plant and I are both watching. The plant is kinder.",
    "Stand up straighter. The badge can hear your posture.",
  ],
};

function pad(n) {
  return String(n).padStart(2, "0");
}

function breakdown(ms) {
  const abs = Math.abs(ms);
  const totalTenths = Math.floor(abs / 100);
  const tenths = totalTenths % 10;
  const totalSeconds = Math.floor(totalTenths / 10);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, tenths, done: ms <= 0 };
}

function chaosFor(parts) {
  if (parts.done) return { value: 6, label: "too quiet" };
  const value = Math.max(12, Math.min(99, Math.round((parts.days / (parts.days + 4)) * 100)));
  const label =
    value > 85 ? "feral" : value > 65 ? "unsupervised" : value > 40 ? "sketchy" : value > 20 ? "alphabetizing" : "suddenly professional";
  return { value, label };
}

export default function App() {
  const [now, setNow] = useState(() => new Date());
  const [quip, setQuip] = useState(null);
  const [panic, setPanic] = useState(false);
  const [panicKey, setPanicKey] = useState(0);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!quip) return undefined;
    const id = setTimeout(() => setQuip(null), 4600);
    return () => clearTimeout(id);
  }, [quip]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (panicKey === 0) return undefined;
    setPanic(true);
    const id = setTimeout(() => setPanic(false), 680);
    return () => clearTimeout(id);
  }, [panicKey]);

  const remaining = TARGET.getTime() - now.getTime();
  const parts = breakdown(remaining);
  const chaos = chaosFor(parts);
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const arrivalLabel = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(TARGET);
  const clockLabel = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    timeZoneName: "short",
  }).format(now);

  useEffect(() => {
    document.title = parts.done
      ? `${parts.days}d on site · Hadeel Abid`
      : `${parts.days}d until Hadeel`;
  }, [parts.days, parts.done]);

  const summary = parts.done
    ? `Hadeel Abid has been on site for ${parts.days} days, ${parts.hours} hours, and ${parts.minutes} minutes.`
    : `${parts.days} days, ${parts.hours} hours, and ${parts.minutes} minutes until Hadeel Abid arrives.`;

  const tapePhrase = parts.done
    ? "ON SITE  ·  HADEEL ABID  ·  SENIOR SITE MANAGEMENT OFFICER  ·  THE BADGE HAS LANDED  ·  "
    : "EXPECTED  ·  HADEEL ABID  ·  1 NOVEMBER 2026  ·  08:00 SHARP  ·  SENIOR SITE MANAGEMENT OFFICER  ·  ";

  function panicAnyway() {
    setPanicKey((n) => n + 1);
    setToast(
      parts.done
        ? "Panic noted. Please return it to a professional volume."
        : "Panic received. The doorway is still empty."
    );
  }

  function pokeBadge() {
    const pool = parts.done ? QUIPS.here : QUIPS.waiting;
    const next = pool[Math.floor(Math.random() * pool.length)];
    setQuip(next);
  }

  return (
    <div className={`page${panic ? " is-panicking" : ""}`}>
      <div className="stripes" aria-hidden="true" />
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          <span>{tapePhrase.repeat(4)}</span>
          <span>{tapePhrase.repeat(4)}</span>
        </div>
      </div>

      <main className="wrap">
        <p className="eyebrow">Unofficial site instrument · pass no. 08:00-1001</p>
        <p className="sr-only" aria-live="polite">
          {summary}
        </p>

        <section className="board">
          <div className="countdown">
            <p className="mode">
              {parts.done ? "Time since the 08:00 landing" : "Time until she hits the office"}
            </p>
            <div className="tiles" aria-hidden="true">
              <Tile value={String(parts.days)} unit="days" />
              <Tile value={pad(parts.hours)} unit="hours" />
              <Tile value={pad(parts.minutes)} unit="minutes" />
              <Tile value={pad(parts.seconds)} unit="seconds" />
            </div>
          </div>

          <header className="board-head">
            <div>
              <p className="kicker">Senior site management officer</p>
              <h1>Hadeel Abid</h1>
              <p className="appointment">
                Due {arrivalLabel}
                <span>Office clock · {zone}</span>
              </p>
            </div>
          </header>

          <figure className="badge">
            <button type="button" className="portrait-btn" onClick={pokeBadge}>
              <img
                src="/hadeel.png"
                alt="Hadeel Abid smiling on site, wearing glasses, a black hijab, a pale blue fuzzy cardigan, and a staff lanyard"
              />
              <span className="poke">Tap the badge</span>
            </button>
            <figcaption>
              <strong>Hadeel Abid</strong>
              <span>Senior site management officer</span>
              <span>Clearance: the whole floor</span>
            </figcaption>
            {quip ? <p className="quip">{quip}</p> : null}
          </figure>

          <div className="readout">
              <div className="chaos">
                <div className="chaos-top">
                  <span>Office chaos index</span>
                  <strong>
                    {chaos.value}% · {chaos.label}
                  </strong>
                </div>
                <div
                  className="meter"
                  role="meter"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={chaos.value}
                  aria-label={`Office chaos index ${chaos.value} percent, ${chaos.label}`}
                >
                  <span style={{ width: `${chaos.value}%` }} />
                </div>
              </div>

              <div className="actions">
                <button type="button" className="btn btn-hot" onClick={panicAnyway}>
                  Panic anyway
                </button>
              </div>
              <p className="clock">Office clock {clockLabel}</p>
              <p className="toast" role="status">
                {toast}
              </p>
          </div>
        </section>
      </main>

      <div className="stripes stripes-bottom" aria-hidden="true" />
    </div>
  );
}

function Tile({ value, unit }) {
  const digits = String(value).split("");
  return (
    <div className="tile">
      <div className="flip-row">
        {digits.map((digit, index) => (
          <FlipDigit key={`${unit}-${digits.length - index}`} digit={digit} />
        ))}
      </div>
      <span className="tile-unit">{unit}</span>
    </div>
  );
}

function FlipDigit({ digit }) {
  const shown = useRef(digit);
  const [current, setCurrent] = useState(digit);
  const [previous, setPrevious] = useState(digit);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (digit === shown.current) return undefined;
    const last = shown.current;
    shown.current = digit;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setCurrent(digit);
      setPrevious(digit);
      return undefined;
    }
    setPrevious(last);
    setCurrent(digit);
    setFlipping(true);
    const id = setTimeout(() => setFlipping(false), 600);
    return () => clearTimeout(id);
  }, [digit]);

  return (
    <div className={`flip${flipping ? " is-flipping" : ""}`}>
      <div className="flip-face flip-top">
        <span>{current}</span>
      </div>
      <div className="flip-face flip-bottom">
        <span>{flipping ? previous : current}</span>
      </div>
      {flipping ? (
        <>
          <div className="flip-flap flap-top">
            <span>{previous}</span>
          </div>
          <div className="flip-flap flap-bottom">
            <span>{current}</span>
          </div>
        </>
      ) : null}
    </div>
  );
}
