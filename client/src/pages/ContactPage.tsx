import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, Linkedin, Facebook, Twitter, ChevronDown, Check } from "lucide-react";
import UnauthorizedToastHandler from "../components/ui/Toast";
import Header from "../components/Header";
import MapBlock from "../components/ui/MapBlock";

const easeOut = [0.16, 1, 0.3, 1] as const;
const appear = { opacity: 1, y: 0 };
const hidden = { opacity: 0, y: 18 };

export default function Contact() {
  const [showToast, setShowToast] =
    useState<{ message: string; isError: boolean } | null>(null);
  const show = (m: string, isError = false) => {
    setShowToast({ message: m, isError });
    window.setTimeout(() => setShowToast(null), 4000);
  };

  type Topic = "support" | "partnership" | "feedback";
  const [values, setValues] = useState<{
    name: string; email: string; topic: Topic; message: string; consent: boolean;
  }>({
    name: "", email: "", topic: "support", message: "", consent: true,
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.name || !values.email || !values.message) {
      show("Please fill all required fields.", true);
      return;
    }
    show("Message sent! We'll get back to you soon.");
    setValues({ name: "", email: "", topic: "support", message: "", consent: true });
  };

  return (
    <>
      <Header />
      <main className="relative isolate overflow-hidden pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        {/* background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[#0f1d14]" />
          <div className="absolute inset-0 bg-[radial-gradient(50%_35%_at_65%_35%,rgba(255,255,255,0.08),transparent)]" />
        </div>

        {/* header */}
        <div className="mx-auto w-[min(1100px,100%)]">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="mb-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur"
          >
            <p className="mb-2 inline-block rounded-lg border border-white/15 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wider text-emerald-200/80">
              Get in touch
            </p>
            <h1 className="text-[clamp(28px,5vw,44px)] font-semibold leading-tight text-emerald-50">
              Contact Planto
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-emerald-200/80">
              Questions, feedback or partnerships — write to us. We usually respond within one business day.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-[1.05fr_1fr]">
            {/* left: form */}
            <motion.form
              initial={hidden}
              animate={appear}
              transition={{ duration: 0.45, ease: easeOut }}
              onSubmit={onSubmit}
              className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-white/[0.03] p-6 backdrop-blur shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_20px_60px_rgba(0,0,0,0.45)]"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Your name"
                  required
                  placeholder="Jane Green"
                  value={values.name}
                  onChange={(v) => setValues((s) => ({ ...s, name: v }))}
                />
                <Field
                  label="Email"
                  type="email"
                  required
                  placeholder="jane@company.com"
                  value={values.email}
                  onChange={(v) => setValues((s) => ({ ...s, email: v }))}
                />
              </div>

              {/* custom dark select */}
              <div className="mt-4">
                <Label>Topic</Label>
                <NiceSelect<"support" | "partnership" | "feedback">
                  className="mt-1"
                  value={values.topic}
                  onChange={(v) => setValues((s) => ({ ...s, topic: v }))}
                  options={[
                    { value: "support", label: "Support" },
                    { value: "partnership", label: "Partnership" },
                    { value: "feedback", label: "Feedback" },
                  ]}
                />
              </div>

              <div className="mt-4">
                <Label>Message</Label>
                <textarea
                  className="mt-1 h-36 w-full resize-none rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-emerald-50 outline-none transition placeholder:text-emerald-200/50 focus:border-emerald-400/60"
                  placeholder="Write a couple of lines…"
                  value={values.message}
                  onChange={(e) => setValues((s) => ({ ...s, message: e.target.value }))}
                />
              </div>

              <div className="mt-4 flex items-center gap-2">
                <input
                  id="consent"
                  type="checkbox"
                  checked={values.consent}
                  onChange={(e) => setValues((s) => ({ ...s, consent: e.target.checked }))}
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-400/50"
                />
                <label htmlFor="consent" className="text-xs text-emerald-200/80">
                  I agree to the processing of my personal data as described in the Privacy Policy.
                </label>
              </div>

              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ y: 0, scale: 0.98 }}
                type="submit"
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-emerald-500/90 px-4 py-2 text-sm font-medium text-emerald-950 shadow-inner shadow-emerald-300/40 hover:bg-emerald-500"
              >
                <Send className="h-4 w-4" />
                Send message
              </motion.button>
            </motion.form>

            {/* right: info cards */}
            <div className="space-y-4">
              <InfoCard
                icon={<Mail className="h-5 w-5" />}
                title="Email"
                lines={["hello@planto.app", "support@planto.app"]}
              />
              <InfoCard
                icon={<Phone className="h-5 w-5" />}
                title="Phone"
                lines={["+1 (415) 555-0132", "Mon–Fri 9:00–17:00"]}
              />
              <InfoCard
                icon={<MapPin className="h-5 w-5" />}
                title="Office"
                lines={["299 Green St, San Francisco, CA"]}
              />
              <InfoCard
                icon={<Clock className="h-5 w-5" />}
                title="Business Hours"
                lines={["Mon–Fri 9:00–18:00", "Weekend — closed"]}
              />
              <motion.div
                initial={hidden}
                animate={appear}
                transition={{ duration: 0.45, ease: easeOut }}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-emerald-100 backdrop-blur"
              >
                <p className="text-sm/6 opacity-90">Follow us</p>
                <div className="mt-2 flex items-center gap-2">
                  <Social icon={<Twitter className="h-4 w-4" />} label="Twitter" />
                  <Social icon={<Linkedin className="h-4 w-4" />} label="LinkedIn" />
                  <Social icon={<Facebook className="h-4 w-4" />} label="Facebook" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* map placeholder */}
          <motion.div
            initial={hidden}
            animate={appear}
            transition={{ duration: 0.45, ease: easeOut }}
            className="mt-8 rounded-3xl border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
          >
            <MapBlock address="299 Green St, San Francisco, CA" zoom={15} />
          </motion.div>

          {/* FAQ */}
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {FAQ.map((f, i) => (
              <motion.details
                key={i}
                initial={hidden}
                animate={appear}
                transition={{ duration: 0.45, ease: easeOut, delay: i * 0.05 }}
                className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-emerald-100">
                  <span className="text-sm font-medium">{f.q}</span>
                  <span className="ml-3 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px]">
                    <ChevronDown />
                  </span>
                </summary>
                <AnimatePresence initial={false}>
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-2 overflow-hidden text-sm text-emerald-200/80"
                  >
                    {f.a}
                  </motion.p>
                </AnimatePresence>
              </motion.details>
            ))}
          </div>
        </div>

        {showToast && ( <UnauthorizedToastHandler message={showToast.message} isError={showToast.isError} /> )}
      </main>
    </>
  );
}


function NiceSelect<T extends string>({ className = "", value, onChange, options, }: {
  className?: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const current = options.find((o) => o.value === value) ?? options[0];

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
          if (e.key === "Enter" || e.key === " ") setOpen((v) => !v);
        }}
        className="flex w-full items-center justify-between rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-left text-sm text-emerald-50 outline-none transition focus:border-emerald-400/60"
      >
        <span>{current?.label}</span>
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-emerald-950/95 p-1 shadow-2xl backdrop-blur"
          >
            {options.map((o) => {
              const selected = o.value === value;
              return (
                <li key={o.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition
                    ${selected ? "bg-emerald-700/30 text-emerald-100" : "text-emerald-100/90 hover:bg-white/5"}`}
                  >
                    <span>{o.label}</span>
                    {selected && <Check className="h-4 w-4 opacity-90" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}


function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs text-emerald-200/80">{children}</label>;
}

function Field({ label, value, onChange, placeholder, type = "text", required, }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <Label>
        {label}
        {required && " *"}
      </Label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-emerald-50 outline-none transition placeholder:text-emerald-200/50 focus:border-emerald-400/60"
      />
    </div>
  );
}

function InfoCard({ icon, title, lines }: { icon: React.ReactNode; title: string; lines: string[] }) {
  return (
    <motion.div
      initial={hidden}
      animate={appear}
      transition={{ duration: 0.45, ease: easeOut }}
      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-emerald-100 backdrop-blur"
    >
      <div className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 bg-white/5">{icon}</div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <div className="mt-1 text-sm/6 text-emerald-200/80">
          {lines.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Social({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/0 px-3 py-1 text-sm text-emerald-100 transition hover:bg-white/5"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}

const FAQ = [
  { q: "How fast do you reply?", a: "Most messages are answered within 24 hours on weekdays." },
  { q: "Do you ship internationally?", a: "Yes, we ship to most countries. Delivery time depends on your region." },
  { q: "Can I change my order?", a: "If your order is not fulfilled yet, contact support and we’ll help." },
  { q: "Do you offer wholesale?", a: "Sure. Drop us a line with 'Partnership' topic, we’ll get back to you." },
];
