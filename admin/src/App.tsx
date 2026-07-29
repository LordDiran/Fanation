import { Navigate, Route, Routes } from "react-router-dom";
import { AdminChrome } from "@/components/admin-chrome";
import AdminLayout from "@/routes/_shell";
import AuditPage from "@/routes/audit";
import CreatorsPage from "@/routes/creators";
import FinancePage from "@/routes/finance";
import KycPage from "@/routes/kyc";
import AdminLogin from "@/routes/login";
import ModerationPage from "@/routes/moderation";
import OverviewPage from "@/routes/overview";
import PayoutsPage from "@/routes/payouts";
import ReportsPage from "@/routes/reports";
import UsersPage from "@/routes/users";

/**
 * Every console URL in one list. `/login` sits outside `AdminLayout` — the shell
 * redirects unauthenticated staff to it, so nesting it would loop.
 *
 * `AdminChrome` is mounted above `<Routes>` on purpose: the governance confirm
 * dialog it hosts must survive the navigation its own action triggers.
 */
export default function App() {
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
