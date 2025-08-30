import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, UserCheck, Cookie, Database, Trash2, Globe, Mail } from "lucide-react";
import UnauthorizedToastHandler from "../components/ui/Toast";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";

const sectionAnim = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function Privacy() {
  const { user } = useAuth?.() ?? { user: null as any };
  const [showToast, setShowToast] = useState<{ message: string; isError: boolean } | null>(null);
  const show = (m: string, isError = false) => {
    setShowToast({ message: m, isError });
    window.setTimeout(() => setShowToast(null), 4000);
  };

  const needsLogin = () => {
    if (!user) {
      show("Please log in to manage your data.", true);
      return true;
    }
    return false;
  };

  return (
    <>
      <Header />
      <main className="relative isolate overflow-hidden pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        {/* background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[#0f1d14]" />
          <div className="absolute inset-0 bg-[radial-gradient(50%_35%_at_35%_35%,rgba(255,255,255,0.08),transparent)]" />
        </div>

        <div className="mx-auto w-[min(1100px,100%)]">
          {/* header */}
          <motion.header
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="mb-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur"
          >
            <p className="mb-2 inline-block rounded-lg border border-white/15 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wider text-emerald-200/80">
              Policy
            </p>
            <h1 className="text-[clamp(28px,5vw,44px)] font-semibold leading-tight text-emerald-50">Privacy Policy</h1>
            <p className="mt-2 max-w-3xl text-sm text-emerald-200/80">
              We respect your privacy. This page explains what data we collect, how we use it, and the choices you have.
            </p>
          </motion.header>

          {/* quick actions */}
          <motion.div
            variants={sectionAnim}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="mb-8 grid gap-3 sm:grid-cols-3"
          >
            <Action
              icon={<Database className="h-4 w-4" />}
              title="Download my data"
              onClick={() => {
                if (needsLogin()) return;
                show("We'll prepare your data export and email you a link.");
              }}
            />
            <Action
              icon={<Trash2 className="h-4 w-4" />}
              title="Delete my account"
              onClick={() => {
                if (needsLogin()) return;
                show("We’ve received your deletion request. Support will confirm shortly.");
              }}
            />
            <Action
              icon={<Cookie className="h-4 w-4" />}
              title="Cookie preferences"
              onClick={() => show("Cookie preferences UI coming soon.")}
            />
          </motion.div>

          {/* body sections */}
          <div className="space-y-6">
            <Section
              id="overview"
              icon={<Shield className="h-5 w-5" />}
              title="Overview"
              body="We only collect data necessary to operate Planto: account info, purchase details, and analytics that help us improve the product."
            />
            <Section
              id="data-we-collect"
              icon={<Database className="h-5 w-5" />}
              title="Data we collect"
              items={[
                "Account: name, email, password hash.",
                "Orders: items, amounts, delivery info.",
                "Usage analytics: pages visited, device and session metadata.",
                "Support messages and reviews you submit.",
              ]}
            />
            <Section
              id="how-we-use"
              icon={<UserCheck className="h-5 w-5" />}
              title="How we use data"
              items={[
                "Provide and improve our services.",
                "Process orders and deliver products.",
                "Detect fraud, abuse, and technical issues.",
                "Send important notices about your account and orders.",
              ]}
            />
            <Section
              id="cookies"
              icon={<Cookie className="h-5 w-5" />}
              title="Cookies"
              body="We use strictly necessary cookies to keep you signed in, and optional analytics cookies to understand usage. You can opt out at any time in your browser settings."
            />
            <Section
              id="sharing"
              icon={<Globe className="h-5 w-5" />}
              title="Sharing and third parties"
              body="We may share limited data with payment processors, delivery partners, and analytics providers — strictly to provide the service. We do not sell your personal data."
            />
            <Section
              id="security"
              icon={<Lock className="h-5 w-5" />}
              title="Security"
              body="We use industry-standard encryption in transit and at rest, role-based access, and regular security reviews."
            />
            <Section
              id="retention"
              icon={<Database className="h-5 w-5" />}
              title="Retention"
              body="We keep your data only as long as your account is active or as required by law. You can request deletion at any time."
            />
            <Section
              id="changes"
              icon={<Shield className="h-5 w-5" />}
              title="Changes to this policy"
              body="We may update this policy to reflect changes in our practices. We will notify you of material changes within the app."
            />
            <Section
              id="contact"
              icon={<Mail className="h-5 w-5" />}
              title="Contact"
              body="For privacy questions, email privacy@planto.app or use the contact form."
            />
          </div>
        </div>

        {showToast && <UnauthorizedToastHandler message={showToast.message} isError={showToast.isError} />}
      </main>
    </>
  );
}

/* ---------- building blocks ---------- */

function Action({ icon, title, onClick, }: {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left text-emerald-100 transition hover:bg-white/10"
    >
      <span className="inline-flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/15 bg-white/5">{icon}</span>
        <span className="text-sm font-medium">{title}</span>
      </span>
      <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] opacity-70 transition group-hover:translate-x-0.5">
        → 
      </span>
    </button>
  );
}

function Section({ id, icon, title, body, items, }: {
  id: string;
  icon: React.ReactNode;
  title: string;
  body?: string;
  items?: string[];
}) {
  return (
    <motion.section
      id={id}
      variants={sectionAnim}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-emerald-100 backdrop-blur"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 bg-white/5">{icon}</span>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {body && <p className="text-sm text-emerald-200/85">{body}</p>}
      {items && (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-emerald-200/85">
          {items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      )}
    </motion.section>
  );
}
