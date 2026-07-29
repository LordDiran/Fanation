import { Navigate, Route, Routes } from "react-router-dom";
import { ThemeChrome } from "@/components/theme";
import AppLayout from "@/routes/_shell";
import CollectionsPage from "@/routes/collections";
import CreatorProfilePage from "@/routes/creator";
import ExplorePage from "@/routes/explore";
import FeedPage from "@/routes/feed";
import LivePage from "@/routes/live";
import Login from "@/routes/login";
import MessagesPage from "@/routes/messages";
import NotificationsPage from "@/routes/notifications";
import ReelsPage from "@/routes/reels";
import SettingsPage from "@/routes/settings";
import Signup from "@/routes/signup";
import SubscriptionsPage from "@/routes/subscriptions";
import WalletPage from "@/routes/wallet";
import AnalyticsPage from "@/routes/studio/analytics";
import ContentStudioPage from "@/routes/studio/content";
import EarningsPage from "@/routes/studio/earnings";
import FansPage from "@/routes/studio/fans";
import GoLivePage from "@/routes/studio/live";
import MassMessagingPage from "@/routes/studio/messages";
import PayoutsPage from "@/routes/studio/payouts";
import PromosPage from "@/routes/studio/promos";
import StudioDashboard from "@/routes/studio";
import TiersPage from "@/routes/studio/tiers";
import VaultPage from "@/routes/studio/vault";
import VerifyPage from "@/routes/studio/verify";

/**
 * Every route in one file — deliberately. The previous build inferred routing
 * from folder names, which meant answering "what URLs exist?" required walking
 * the tree. Here it is a list you can read top to bottom.
 *
 * `/login` and `/signup` sit outside `AppLayout` because the shell renders the
 * sidebar and topbar and redirects anyone unauthenticated straight back to
 * `/login` — nesting them would loop.
 */
export default function App() {
  return (
    <>
      <ThemeChrome />
      <Routes>
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<AppLayout />}>
          {/* Fan surface */}
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/reels" element={<ReelsPage />} />
          <Route path="/live" element={<LivePage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/creator/:handle" element={<CreatorProfilePage />} />

          {/* Creator studio */}
          <Route path="/studio" element={<StudioDashboard />} />
          <Route path="/studio/earnings" element={<EarningsPage />} />
          <Route path="/studio/content" element={<ContentStudioPage />} />
          <Route path="/studio/vault" element={<VaultPage />} />
          <Route path="/studio/tiers" element={<TiersPage />} />
          <Route path="/studio/fans" element={<FansPage />} />
          <Route path="/studio/messages" element={<MassMessagingPage />} />
          <Route path="/studio/live" element={<GoLivePage />} />
          <Route path="/studio/promos" element={<PromosPage />} />
          <Route path="/studio/analytics" element={<AnalyticsPage />} />
          <Route path="/studio/payouts" element={<PayoutsPage />} />
          <Route path="/studio/verify" element={<VerifyPage />} />
        </Route>

        {/* Unknown URL — send fans home rather than showing a dead end. */}
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </>
  );
}
