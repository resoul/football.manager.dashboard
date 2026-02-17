import { Routes, Route, Navigate } from 'react-router-dom';
import { SectionLayout } from "@/modules/main/layout/components/section-layout.tsx";
import { HomePage } from "./pages/home/home/page";
import { InboxPage } from "./pages/inbox/inbox/page";
import { InboxSocialFeedPage } from "./pages/inbox/social-feed/page";
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
import {
    getInboxItems,
    getHomeItems,
    getSquadItems,
    getSquadPlannerItems,
    getDynamicsItems,
    getTacticsItems,
    getDataHubItems,
    getTrainingItems,
    getScoutingItems,
    getDevCentreItems,
    getClubVisionItems,
    getMedicalCentreItems,
    getStaffItems,
    getScheduleItems,
    getFinancesItems,
    getCompetitionsItems,
    getTransfersItems,
    getClubInfoItems
} from "@/modules/main/layout/components/menus.ts";
import { Layout } from "./layout";

export default function MainModule() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Navigate to="inbox" replace />} />
                <Route path="inbox" element={<SectionLayout menu={getInboxItems(true)}/>}>
                    <Route index element={<Navigate to="inbox" replace />} />
                    <Route path="inbox" element={<InboxPage />} />
                    <Route path="social-feed" element={<InboxSocialFeedPage />} />
                    <Route path="news" element={<InboxSocialFeedPage />} />
                    <Route path="leagues-in-focus" element={<InboxSocialFeedPage />} />
                    <Route path="around-the-world" element={<InboxSocialFeedPage />} />
                    <Route path="transfer-window-news" element={<InboxSocialFeedPage />} />
                </Route>
                <Route path="home" element={<SectionLayout menu={getHomeItems()}/>}>
                    <Route index element={<Navigate to="profile" replace />} />
                    <Route path="profile" element={<HomePage />} />
                    <Route path="start-course" element={<HomePage />} />
                    <Route path="retire" element={<HomePage />} />
                    <Route path="go-on-holiday" element={<HomePage />} />
                </Route>
                <Route path="squad" element={<SectionLayout menu={getSquadItems()}/>}>
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="overview" element={<SquadOverviewPage />} />
                    <Route path="registration" element={<SquadOverviewPage />} />
                    <Route path="all-players" element={<SquadOverviewPage />} />
                    <Route path="export-team" element={<SquadOverviewPage />} />
                    <Route path="players-on-in-duty" element={<SquadOverviewPage />} />
                    <Route path="in-friendly-availability" element={<SquadOverviewPage />} />
                </Route>
                <Route path="scouting" element={<SectionLayout menu={getScoutingItems()}/>}>
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="recruitment-focus" element={<ScoutingOverviewPage />} />
                    <Route path="scouting-centre" element={<ScoutingOverviewPage />} />
                    <Route path="players-range" element={<ScoutingOverviewPage />} />
                    <Route path="scored-players" element={<ScoutingOverviewPage />} />
                    <Route path="scout-priorities" element={<ScoutingOverviewPage />} />
                    <Route path="match-and-team-analysis" element={<ScoutingOverviewPage />} />
                    <Route path="team-report-priorities" element={<ScoutingOverviewPage />} />
                    <Route path="shortlist" element={<ScoutingOverviewPage />} />
                    <Route path="overview" element={<ScoutingOverviewPage />} />
                    <Route path="not-interested-list" element={<ScoutingOverviewPage />} />
                    <Route path="scouting-assignment" element={<ScoutingOverviewPage />} />
                </Route>
                <Route path="club-vision" element={<SectionLayout menu={getClubVisionItems()}/>}>
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="overview" element={<ClubVisionOverviewPage />} />
                    <Route path="board" element={<ClubVisionOverviewPage />} />
                    <Route path="performance" element={<ClubVisionOverviewPage />} />
                    <Route path="supporters" element={<ClubVisionOverviewPage />} />
                    <Route path="match-performance" element={<ClubVisionOverviewPage />} />
                    <Route path="transfer-activity" element={<ClubVisionOverviewPage />} />
                    <Route path="squad" element={<ClubVisionOverviewPage />} />
                    <Route path="tactics" element={<ClubVisionOverviewPage />} />
                </Route>
                <Route path="dev-centre" element={<SectionLayout menu={getDevCentreItems()}/>}>
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="overview" element={<DevCentreOverviewPage />} />
                    <Route path="loans" element={<DevCentreOverviewPage />} />
                    <Route path="metalist-under-19s-staff" element={<DevCentreOverviewPage />} />
                    <Route path="youth-candidates" element={<DevCentreOverviewPage />} />
                    <Route path="competitions" element={<DevCentreOverviewPage />} />
                    <Route path="fixtures" element={<DevCentreOverviewPage />} />
                    <Route path="match" element={<DevCentreOverviewPage />} />
                    <Route path="training" element={<DevCentreOverviewPage />} />
                    <Route path="tactics" element={<DevCentreOverviewPage />} />
                    <Route path="dynamics" element={<DevCentreOverviewPage />} />
                    <Route path="squad" element={<DevCentreOverviewPage />} />
                    <Route path="under-19s" element={<DevCentreOverviewPage />} />
                </Route>
                <Route path="planner" element={<SectionLayout menu={getSquadPlannerItems()}/>}>
                    <Route index element={<Navigate to="squad-planner" replace />} />
                    <Route path="squad-planner" element={<SquadPlannerIndexPage />} />
                    <Route path="experience-matrix" element={<SquadPlannerIndexPage />} />
                    <Route path="best-xi" element={<SquadPlannerIndexPage />} />
                    <Route path="assistant-report" element={<SquadPlannerIndexPage />} />
                    <Route path="stats" element={<SquadPlannerIndexPage />} />
                    <Route path="comparison" element={<SquadPlannerIndexPage />} />
                </Route>
                <Route path="dynamics" element={<SectionLayout menu={getDynamicsItems()}/>}>
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="overview" element={<DynamicsOverviewPage />} />
                    <Route path="hierarchy" element={<DynamicsOverviewPage />} />
                    <Route path="social-groups" element={<DynamicsOverviewPage />} />
                    <Route path="happiness" element={<DynamicsOverviewPage />} />
                    <Route path="code-of-conduct" element={<DynamicsOverviewPage />} />
                    <Route path="team-meeting" element={<DynamicsOverviewPage />} />
                    <Route path="team-talk-feedback" element={<DynamicsOverviewPage />} />
                </Route>
                <Route path="tactics" element={<SectionLayout menu={getTacticsItems()}/>}>
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="overview" element={<TacticsOverviewPage />} />
                    <Route path="player" element={<TacticsOverviewPage />} />
                    <Route path="captains" element={<TacticsOverviewPage />} />
                    <Route path="set-piece-takers" element={<TacticsOverviewPage />} />
                    <Route path="match-plans" element={<TacticsOverviewPage />} />
                    <Route path="opposition-instructions" element={<TacticsOverviewPage />} />
                    <Route path="corners" element={<TacticsOverviewPage />} />
                    <Route path="free-kicks" element={<TacticsOverviewPage />} />
                    <Route path="throw-ins" element={<TacticsOverviewPage />} />
                    <Route path="penalties" element={<TacticsOverviewPage />} />
                </Route>
                <Route path="data-hub" element={<SectionLayout menu={getDataHubItems()}/>}>
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="overview" element={<DataHubOverviewPage />} />
                    <Route path="player" element={<DataHubOverviewPage />} />
                    <Route path="team-performance" element={<DataHubOverviewPage />} />
                    <Route path="analyst-report" element={<DataHubOverviewPage />} />
                    <Route path="last-5-matches" element={<DataHubOverviewPage />} />
                    <Route path="last-match" element={<DataHubOverviewPage />} />
                    <Route path="shots" element={<DataHubOverviewPage />} />
                    <Route path="next-opponent" element={<DataHubOverviewPage />} />
                    <Route path="next-opposition-performance" element={<DataHubOverviewPage />} />
                    <Route path="scout-report" element={<DataHubOverviewPage />} />
                    <Route path="analyst-report" element={<DataHubOverviewPage />} />
                    <Route path="stat-pack" element={<DataHubOverviewPage />} />
                    <Route path="past-meetings" element={<DataHubOverviewPage />} />
                </Route>
                <Route path="training" element={<SectionLayout menu={getTrainingItems()}/>}>
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="overview" element={<TrainingOverviewPage />} />
                    <Route path="calendar" element={<TrainingOverviewPage />} />
                    <Route path="schedules" element={<TrainingOverviewPage />} />
                    <Route path="units" element={<TrainingOverviewPage />} />
                    <Route path="mentoring" element={<TrainingOverviewPage />} />
                    <Route path="individual" element={<TrainingOverviewPage />} />
                    <Route path="coaches" element={<TrainingOverviewPage />} />
                    <Route path="rest" element={<TrainingOverviewPage />} />
                </Route>
                <Route path="medical-centre" element={<SectionLayout menu={getMedicalCentreItems()}/>}>
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="overview" element={<MedicalCentreOverviewPage />} />
                    <Route path="risk-assessment" element={<MedicalCentreOverviewPage />} />
                    <Route path="current-injuries" element={<MedicalCentreOverviewPage />} />
                    <Route path="injury-history" element={<MedicalCentreOverviewPage />} />
                    <Route path="season-summary" element={<MedicalCentreOverviewPage />} />
                </Route>
                <Route path="staff" element={<SectionLayout menu={getStaffItems()}/>}>
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="overview" element={<StaffOverviewPage />} />
                    <Route path="board" element={<StaffOverviewPage />} />
                    <Route path="staff" element={<StaffOverviewPage />} />
                    <Route path="advice-and-reports" element={<StaffOverviewPage />} />
                    <Route path="transfers-and-contracts" element={<StaffOverviewPage />} />
                    <Route path="match" element={<StaffOverviewPage />} />
                    <Route path="media" element={<StaffOverviewPage />} />
                    <Route path="tactics" element={<StaffOverviewPage />} />
                    <Route path="training" element={<StaffOverviewPage />} />
                    <Route path="responsibilities" element={<StaffOverviewPage />} />
                    <Route path="coaching-team" element={<StaffOverviewPage />} />
                    <Route path="medical-team" element={<StaffOverviewPage />} />
                    <Route path="recruitment-team" element={<StaffOverviewPage />} />
                    <Route path="all" element={<StaffOverviewPage />} />
                    <Route path="staff-search" element={<StaffOverviewPage />} />
                    <Route path="staff-shortlist" element={<StaffOverviewPage />} />
                    <Route path="job-centre" element={<StaffOverviewPage />} />
                    <Route path="job-security" element={<StaffOverviewPage />} />
                </Route>
                <Route path="schedule" element={<SectionLayout menu={getScheduleItems()}/>}>
                    <Route index element={<Navigate to="fixtures" replace />} />
                    <Route path="fixtures" element={<ScheduleFixturesPage />} />
                    <Route path="calendar" element={<ScheduleFixturesPage />} />
                    <Route path="events" element={<ScheduleFixturesPage />} />
                    <Route path="reminders" element={<ScheduleFixturesPage />} />
                </Route>
                <Route path="finances" element={<SectionLayout menu={getFinancesItems()}/>}>
                    <Route index element={<Navigate to="summary" replace />} />
                    <Route path="summary" element={<FinancesSummarysPage />} />
                    <Route path="ffp" element={<FinancesSummarysPage />} />
                    <Route path="projection" element={<FinancesSummarysPage />} />
                    <Route path="sponsors-other" element={<FinancesSummarysPage />} />
                    <Route path="debt-and-loans" element={<FinancesSummarysPage />} />
                    <Route path="wages" element={<FinancesSummarysPage />} />
                    <Route path="income" element={<FinancesSummarysPage />} />
                    <Route path="expenditure" element={<FinancesSummarysPage />} />
                    <Route path="salary-commitments" element={<FinancesSummarysPage />} />
                    <Route path="code-of-conduct" element={<FinancesSummarysPage />} />
                </Route>
                <Route path="competitions" element={<SectionLayout menu={getCompetitionsItems()}/>}>
                    <Route index element={<Navigate to="competitions" replace />} />
                    <Route path="competitions" element={<CompetitionsIndexPage />} />
                </Route>
                <Route path="transfers" element={<SectionLayout menu={getTransfersItems()}/>}>
                    <Route index element={<Navigate to="transfer-centre" replace />} />
                    <Route path="transfer-centre" element={<TransfersIndexPage />} />
                    <Route path="clauses" element={<TransfersIndexPage />} />
                    <Route path="transfer-targets" element={<TransfersIndexPage />} />
                    <Route path="unwanted-list" element={<TransfersIndexPage />} />
                    <Route path="development-list" element={<TransfersIndexPage />} />
                    <Route path="suggest-transfer-targets" element={<TransfersIndexPage />} />
                    <Route path="transfer-history" element={<TransfersIndexPage />} />
                </Route>
                <Route path="club-info" element={<SectionLayout menu={getClubInfoItems()}/>}>
                    <Route index element={<Navigate to="profile" replace />} />
                    <Route path="profile" element={<ClubInfoProfilePage />} />
                    <Route path="players" element={<ClubInfoProfilePage />} />
                    <Route path="best-eleven" element={<ClubInfoProfilePage />} />
                    <Route path="managers" element={<ClubInfoProfilePage />} />
                    <Route path="landmarks" element={<ClubInfoProfilePage />} />
                    <Route path="competitions" element={<ClubInfoProfilePage />} />
                    <Route path="records" element={<ClubInfoProfilePage />} />
                    <Route path="general" element={<ClubInfoProfilePage />} />
                    <Route path="news" element={<ClubInfoProfilePage />} />
                    <Route path="facilities" element={<ClubInfoProfilePage />} />
                    <Route path="notes" element={<ClubInfoProfilePage />} />
                    <Route path="affiliated-clubs" element={<ClubInfoProfilePage />} />
                    <Route path="history" element={<ClubInfoProfilePage />} />
                    <Route path="proposed-affiliates" element={<ClubInfoProfilePage />} />
                </Route>
            </Route>
        </Routes>
    )
}