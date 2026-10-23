import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  CircleDot,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";

const rows = [
  { company: "Priority sponsor queue", contact: "Decision-maker verified", stage: "FOLLOW_UP", value: "₹2.0L" },
  { company: "Regional infrastructure partner", contact: "Office line · needs review", stage: "CONTACTED", value: "₹1.0L" },
  { company: "Technical workshop prospect", contact: "CSR representative", stage: "PROPOSAL_SENT", value: "₹50K" },
];

const stageLabel: Record<string, string> = {
  FOLLOW_UP: "Follow-up",
  CONTACTED: "Contacted",
  PROPOSAL_SENT: "Proposal sent",
};

export function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-lg border border-border-strong/70 bg-surface shadow-sm">
      <div className="flex items-center justify-between border-b border-border bg-table-header px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <CircleDot className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-[0.14em] text-text-primary">PRAROHA&apos;26</p>
            <p className="text-[10px] text-text-muted">Sponsorship command center</p>
          </div>
        </div>
        <div className="hidden items-center gap-3 text-[10px] text-text-muted sm:flex">
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-success" />Verified workspace</span>
          <span className="rounded-md border border-border bg-surface px-2 py-1">⌘ K</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr]">
        <aside className="hidden border-r border-border bg-sidebar-background p-3 lg:block">
          <p className="px-2 pb-2 text-[9px] font-bold uppercase tracking-[0.16em] text-text-muted">Workspace</p>
          <div className="space-y-1 text-[11px] font-semibold">
            <div className="rounded-md bg-sidebar-active px-2.5 py-2 text-primary">Today&apos;s work</div>
            <div className="px-2.5 py-2 text-text-secondary">My leads</div>
            <div className="px-2.5 py-2 text-text-secondary">Follow-ups</div>
            <div className="px-2.5 py-2 text-text-secondary">Pipeline</div>
          </div>
          <div className="mt-8 border-t border-border-subtle pt-3">
            <p className="px-2 text-[9px] font-bold uppercase tracking-[0.16em] text-text-muted">Today</p>
            <p className="px-2 pt-2 text-xs font-semibold text-text-primary">3 calls remaining</p>
            <p className="px-2 pt-1 text-[10px] text-text-muted">2 callbacks need attention</p>
          </div>
        </aside>

        <div className="min-w-0 p-4 sm:p-5">
          <div className="flex flex-col justify-between gap-3 border-b border-border pb-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">Outreach desk</p>
              <h3 className="mt-1 text-lg font-bold tracking-tight text-text-primary sm:text-xl">Move the next sponsor forward.</h3>
              <p className="mt-1 max-w-xl text-xs leading-relaxed text-text-secondary">Every record connects ownership, contact quality, call history, follow-up, and sponsorship value.</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-semibold text-text-secondary">
              <span className="flex items-center gap-1.5 rounded-md border border-border bg-surface-subtle px-2 py-1.5"><PhoneCall className="h-3.5 w-3.5 text-primary" />12 calls</span>
              <span className="flex items-center gap-1.5 rounded-md border border-border bg-surface-subtle px-2 py-1.5"><CalendarClock className="h-3.5 w-3.5 text-warning" />2 due</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 divide-x divide-border overflow-hidden rounded-md border border-border bg-surface-subtle">
            <div className="p-3"><p className="text-[9px] font-bold uppercase tracking-wider text-text-muted">Assigned</p><p className="mt-1 text-xl font-bold tabular-nums text-text-primary">18</p></div>
            <div className="p-3"><p className="text-[9px] font-bold uppercase tracking-wider text-text-muted">Pipeline</p><p className="mt-1 text-xl font-bold tabular-nums text-text-primary">₹7.8L</p></div>
            <div className="p-3"><p className="text-[9px] font-bold uppercase tracking-wider text-text-muted">Won</p><p className="mt-1 text-xl font-bold tabular-nums text-success">₹1.2L</p></div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-md border border-border">
            <div className="grid min-w-[620px] grid-cols-[1.4fr_1fr_0.9fr_0.6fr] border-b border-border bg-table-header px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-text-muted">
              <span>Sponsor / company</span><span>Contact quality</span><span>Stage</span><span>Ask</span>
            </div>
            {rows.map((row) => (
              <div key={row.company} className="grid min-w-[620px] grid-cols-[1.4fr_1fr_0.9fr_0.6fr] items-center border-b border-border-subtle px-3 py-3 last:border-0 hover:bg-table-row-hover">
                <div><p className="text-[11px] font-semibold text-text-primary">{row.company}</p><p className="mt-0.5 text-[10px] text-text-muted">Next action · today</p></div>
                <span className="text-[10px] text-text-secondary">{row.contact}</span>
                <span className="w-fit rounded-md border border-primary/20 bg-accent-mint px-2 py-1 text-[9px] font-semibold text-accent-mint-text">{stageLabel[row.stage]}</span>
                <span className="text-[11px] font-semibold tabular-nums text-text-primary">{row.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-md border border-primary/20 bg-accent-mint px-3 py-2.5">
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /><span className="text-[10px] font-semibold text-accent-mint-text">Human-reviewed activity keeps the pipeline trustworthy.</span></div>
            <ArrowUpRight className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}
