import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AdminChrome } from "@/components/admin-chrome";
import { useIdlePrefetch } from "@/lib/prefetch";
import AdminLayout from "@/routes/_shell";
import AdminLogin from "@/routes/login";

/**
 * Every console URL in one list. `/login` sits outside `AdminLayout` — the shell
 * redirects unauthenticated staff to it, so nesting it would loop.
 *
 * `AdminChrome` is mounted above `<Routes>` on purpose: the governance confirm
 * dialog it hosts must survive the navigation its own action triggers.
 *
 * `/login` and the shell are the only eager imports. A cold hit on any console
 * URL lands on `/login`, so it is the first paint every time and splitting it
 * would only add a round trip — the browser cannot discover a chunk it has not
 * parsed the entry for yet. The nine pages behind the door are split and then
 * warmed during idle time, so staff get a smaller first load without paying for
 * it on every click afterwards. See `lib/prefetch.ts`.
 */
const load = {
  overview: () => import("@/routes/overview"),
  users: () => import("@/routes/users"),
  creators: () => import("@/routes/creators"),
  kyc: () => import("@/routes/kyc"),
  moderation: () => import("@/routes/moderation"),
  finance: () => import("@/routes/finance"),
  payouts: () => import("@/routes/payouts"),
  reports: () => import("@/routes/reports"),
  audit: () => import("@/routes/audit"),
};

const OverviewPage = lazy(load.overview);
const UsersPage = lazy(load.users);
const CreatorsPage = lazy(load.creators);
const KycPage = lazy(load.kyc);
const ModerationPage = lazy(load.moderation);
const FinancePage = lazy(load.finance);
const PayoutsPage = lazy(load.payouts);
const ReportsPage = lazy(load.reports);
const AuditPage = lazy(load.audit);

export default function App() {
  useIdlePrefetch(load);

  return (
    <>
      <AdminChrome />
      <Routes>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route path="/login" element={<AdminLogin />} />

        <Route element={<AdminLayout />}>
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/creators" element={<CreatorsPage />} />
          <Route path="/kyc" element={<KycPage />} />
          <Route path="/moderation" element={<ModerationPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/payouts" element={<PayoutsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/audit" element={<AuditPage />} />
        </Route>

        {/* Unknown URL — back to the console home, not a dead end. */}
        <Route path="*" element={<Navigate to="/overview" replace />} />
      </Routes>
    </>
  );
}
