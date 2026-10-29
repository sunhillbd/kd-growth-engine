import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import { Layout } from './components/common/Layout';

// Auth Pages
import { LoginPage } from './pages/Auth/LoginPage';
import { TwoFactorPage } from './pages/Auth/TwoFactorPage';
import { ForgotPasswordPage } from './pages/Auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/Auth/ResetPasswordPage';
import { AcceptInvitePage } from './pages/Auth/AcceptInvitePage';

// Onboarding & Account
import { OnboardingPage } from './pages/Onboarding/OnboardingPage';
import { AccountPage } from './pages/Account/AccountPage';

// Error Pages
import { NotFoundPage } from './pages/Errors/NotFoundPage';
import { NoAccessPage } from './pages/Errors/NoAccessPage';

// Main Pages
import { OverviewPage } from './pages/Overview/OverviewPage';
import { OffersPage } from './pages/Brain/OffersPage';
import { OfferDetailPage } from './pages/Brain/OfferDetailPage';
import { IcpsPage } from './pages/Brain/IcpsPage';
import { IcpDetailPage } from './pages/Brain/IcpDetailPage';
import { ProofPage } from './pages/Brain/ProofPage';
import { QueuePage } from './pages/Leads/QueuePage';
import { PipelinePage } from './pages/Leads/PipelinePage';
import { SignalsPage } from './pages/Leads/SignalsPage';
import { SourcesPage } from './pages/Leads/SourcesPage';
import { ContentWorkspacePage } from './pages/Content/ContentWorkspacePage';
import { PatternsPage } from './pages/Content/PatternsPage';
import { PublishPage } from './pages/Publish/PublishPage';
import { IdeasPage } from './pages/Ideas/IdeasPage';
import { InsightsPage } from './pages/Insights/InsightsPage';
import { SettingsPage } from './pages/Settings/SettingsPage';

// Route guards
const ProtectedLayout: React.FC = () => {
  const { isAuthenticated } = useStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Layout />;
};

const RootRedirect: React.FC = () => {
  const { isAuthenticated, onboardingCompleted, userRole } = useStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!onboardingCompleted && userRole === 'Owner') {
    return <Navigate to="/onboarding" replace />;
  }
  return <Navigate to="/overview" replace />;
};

export const App: React.FC = () => {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/two-factor" element={<TwoFactorPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/accept-invite" element={<AcceptInvitePage />} />
          <Route path="/invite/:token" element={<AcceptInvitePage />} />

          {/* Full-Page Onboarding Stepper */}
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* Protected Application Routes */}
          <Route path="/" element={<ProtectedLayout />}>
            <Route index element={<RootRedirect />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="account" element={<AccountPage />} />

            {/* Brain */}
            <Route path="brain">
              <Route path="offers" element={<OffersPage />} />
              <Route path="offers/:id" element={<OfferDetailPage />} />
              <Route path="icps" element={<IcpsPage />} />
              <Route path="icps/:id" element={<IcpDetailPage />} />
              <Route path="proof" element={<ProofPage />} />
            </Route>

            {/* Leads */}
            <Route path="leads">
              <Route path="queue" element={<QueuePage />} />
              <Route path="pipeline" element={<PipelinePage />} />
              <Route path="signals" element={<SignalsPage />} />
              <Route path="sources" element={<SourcesPage />} />
            </Route>

            {/* Publishing UX (Buffer model) & Ideas */}
            <Route path="publish" element={<PublishPage />} />
            <Route path="ideas" element={<IdeasPage />} />

            {/* Old routes redirect to the right tab */}
            <Route path="content">
              <Route index element={<Navigate to="/publish" replace />} />
              <Route path="approvals" element={<Navigate to="/publish?tab=approvals" replace />} />
              <Route path="calendar" element={<Navigate to="/publish?tab=calendar" replace />} />
              <Route path="posts" element={<Navigate to="/publish?tab=sent" replace />} />
              <Route path="drafts" element={<Navigate to="/publish?tab=drafts" replace />} />
              <Route path="compose" element={<Navigate to="/publish?action=new" replace />} />
              <Route path="plan" element={<Navigate to="/ideas" replace />} />
              <Route path="patterns" element={<Navigate to="/ideas?tab=patterns" replace />} />
              <Route path="swipe" element={<Navigate to="/ideas?tab=swipe" replace />} />
            </Route>

            {/* Insights */}
            <Route path="insights" element={<InsightsPage />} />

            {/* Settings */}
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Standalone Error Routes */}
          <Route path="/no-access" element={<NoAccessPage />} />
          <Route path="/404" element={<NotFoundPage />} />

          {/* Catch-all Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
};

export default App;
