import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from "./pages/home/home/page";
import { InboxPage } from "./pages/inbox/inbox/page";
import { SquadOverviewPage } from "./pages/squad/overview/page";
import { SquadPlannerIndexPage } from "./pages/planner/squad-planner/page";
import { DynamicsOverviewPage } from "./pages/dynamics/overview/page";
import { TacticsOverviewPage } from "./pages/tactics/overview/page";
import { DataHubOverviewPage } from "./pages/data-hub/overview/page";
import { StaffOverviewPage } from "./pages/staff/overview/page";
import { TrainingOverviewPage } from "./pages/training/overview/page";
import { MedicalCentreOverviewPage } from "./pages/medical-centre/overview/page";
import { DevCentreOverviewPage } from "./pages/dev-centre/overview/page";
import { ScoutingOverviewPage } from "./pages/scouting/overview/page";
import { ClubVisionOverviewPage } from "./pages/club-vision/overview/page";
import { ScheduleFixturesPage } from "./pages/schedule/fixtures/page";
import { FinancesSummarysPage } from "./pages/finances/summary/page";
import { CompetitionsIndexPage } from "./pages/competitions/competitions/page";
import { ClubInfoProfilePage } from "./pages/club-info/profile/page";
import { TransfersIndexPage } from "./pages/transfers/transfer-centre/page";
import { Layout } from "./layout";

export default function MainModule() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Navigate to="inbox" replace />} />
                <Route path="profile" element={<InboxPage />} />
                <Route path="inbox">
                    <Route index element={<Navigate to="inbox" replace />} />
                    <Route path="inbox" element={<InboxPage />} />
                </Route>
                <Route path="home">
                    <Route index element={<Navigate to="home" replace />} />
                    <Route path="home" element={<HomePage />} />
                </Route>
                <Route path="squad">
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="overview" element={<SquadOverviewPage />} />
                </Route>
                <Route path="scouting">
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="overview" element={<ScoutingOverviewPage />} />
                </Route>
                <Route path="club-vision">
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="overview" element={<ClubVisionOverviewPage />} />
                </Route>
                <Route path="dev-centre">
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="overview" element={<DevCentreOverviewPage />} />
                </Route>
                <Route path="planner">
                    <Route index element={<Navigate to="squad-planner" replace />} />
                    <Route path="squad-planner" element={<SquadPlannerIndexPage />} />
                </Route>
                <Route path="dynamics">
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="overview" element={<DynamicsOverviewPage />} />
                </Route>
                <Route path="tactics">
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="overview" element={<TacticsOverviewPage />} />
                </Route>
                <Route path="data-hub">
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="overview" element={<DataHubOverviewPage />} />
                </Route>
                <Route path="training">
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="overview" element={<TrainingOverviewPage />} />
                </Route>
                <Route path="medical-centre">
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="overview" element={<MedicalCentreOverviewPage />} />
                </Route>
                <Route path="staff">
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="overview" element={<StaffOverviewPage />} />
                </Route>
                <Route path="schedule">
                    <Route index element={<Navigate to="fixtures" replace />} />
                    <Route path="fixtures" element={<ScheduleFixturesPage />} />
                </Route>
                <Route path="finances">
                    <Route index element={<Navigate to="summary" replace />} />
                    <Route path="summary" element={<FinancesSummarysPage />} />
                </Route>
                <Route path="competitions">
                    <Route index element={<Navigate to="competitions" replace />} />
                    <Route path="competitions" element={<CompetitionsIndexPage />} />
                </Route>
                <Route path="transfers">
                    <Route index element={<Navigate to="transfer-centre" replace />} />
                    <Route path="transfer-centre" element={<TransfersIndexPage />} />
                </Route>
                <Route path="club-info">
                    <Route index element={<Navigate to="profile" replace />} />
                    <Route path="profile" element={<ClubInfoProfilePage />} />
                </Route>
            </Route>
        </Routes>
    )
}