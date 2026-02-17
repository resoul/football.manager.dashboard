import { type MenuItem } from './types';

export const getInboxItems = (hasTransferAccess: boolean): MenuItem => {
    return {
        children: [
            { title: 'Inbox', path: '/inbox/inbox' },
            { title: 'Social Feed', path: '/inbox/social-feed' },
            { title: 'News', path: '/inbox/news' },
            { title: 'Leagues in Focus', path: '/inbox/leagues-in-focus' },
            { title: 'Around the World', path: '/inbox/around-the-world' },
            ...(hasTransferAccess
                ? [{ title: 'Transfer Window News', path: '/inbox/transfer-window-news' }]
                : []),
        ]
    }
}

export const getTrainingItems = (): MenuItem => {
    return {
        children: [
            { title: 'Overview', path: '/training/overview' },
            { title: 'Calendar', path: '/training/calendar' },
            { title: 'Schedules', path: '/training/schedules' },
            { title: 'Units', path: '/training/units' },
            { title: 'Mentoring', path: '/training/mentoring' },
            { title: 'Individual', path: '/training/individual' },
            { title: 'Rest', path: '/training/rest' },
            { title: 'Coaches', path: '/training/coaches' },
        ]
    }
}

export const getDynamicsItems = (): MenuItem => {
    return {
        children: [
            { title: 'Overview', path: '/dynamics/overview' },
            { title: 'Hierarchy', path: '/dynamics/hierarchy' },
            { title: 'Social Groups', path: '/dynamics/social-groups' },
            { title: 'Happiness', path: '/dynamics/happiness' },
            { title: 'Code of Conduct', path: '/dynamics/code-of-conduct' },
            { title: 'Team Meeting', path: '/dynamics/team-meeting' },
            { title: 'Team Talk Feedback', path: '/dynamics/team-talk-feedback' },
        ]
    }
}

export const getScoutingItems = (): MenuItem => {
    return {
        children: [
            { title: 'Overview', path: '/scouting' },
            { title: 'Scouting Centre', path: '/scouting/scouting-centre' },
            { title: 'Players', children: [
                    { title: 'Players in Range', path: '/scouting/players-range' },
                    { title: 'Scouted Players', path: '/scouting/scored-players' },
                ] },
            { title: 'Recruitment Focus', children: [
                    { title: 'Recruitment Focus', path: '/scouting/recruitment-focus' },
                    { title: 'Scout Priorities', path: '/scouting/scout-priorities' },
                ] },
            { title: 'Scouting Coverage', children: [
                    { title: 'Scouting Assignments', path: '/scouting/scouting-assignment' },
                    { title: 'Match and Team Analysis', path: '/scouting/match-and-team-analysis' },
                    { title: 'Team Report Priorities', path: '/scouting/team-report-priorities' },
                ] },
            { title: 'Shortlist', children: [
                    { title: 'Shortlist', path: '/scouting/shortlist' },
                    { title: 'Not Interested List', path: '/scouting/not-interested-list' },
                ] },
        ]
    }
}

export const getDataHubItems = (): MenuItem => {
    return {
        children: [
            { title: 'Overview', path: '/data-hub' },
            { title: 'Team', children: [
                    { title: 'Team Performance', path: '/data-hub/team-performance' },
                    { title: 'Analyst Report', path: '/data-hub/analyst-report' },
                    { title: 'Shots', path: '/data-hub/shots' },
                ] },
            { title: 'Player', path: '/data-hub/player' },
            { title: 'Matches', children: [
                    { title: 'Last Match', path: '/data-hub/last-match' },
                    { title: 'Last 5 Matches', path: '/data-hub/last-5-matches' },
                ] },
            { title: 'Next Opponent', children: [
                    { title: 'Overview', path: '/data-hub/next-opponent' },
                    { title: 'Next Opposition Performance', path: '/data-hub/next-opposition-performance' },
                    { title: 'Scout Report', path: '/data-hub/scout-report' },
                    { title: 'Analyst Report', path: '/data-hub/analyst-report' },
                    { title: 'Stat Pack', path: '/data-hub/stat-pack' },
                    { title: 'Past Meetings', path: '/data-hub/past-meetings' },
                ] },
        ]
    }
}

export const getHomeItems = (): MenuItem => {
    return {
        children: [
            { title: 'Home', path: '/home' },
            { title: 'My Profile', children: [
                    { title: 'Profile', path: '/home/profile' },
                    { title: 'Start a Coaching Course', path: '/home/start-course' },
                    { title: 'Retire', path: '/home/retire' },
                    { title: 'Go On Holiday', path: '/home/go-on-holiday' },
                ] },
            { title: 'My Contract', children: [
                    { title: 'Contract Details', path: '/home/profile' },
                    { title: 'Contract Offer', path: '/home/profile' },
                    { title: 'Resign', path: '/home/profile' },
                ] },
            { title: 'Promises', path: '/inbox/leagues-in-focus' },
            { title: 'Relationships', path: '/inbox/leagues-in-focus' },
            { title: 'My History', children: [
                    { title: 'Overview', path: '/home/profile' },
                    { title: 'Job History', path: '/home/profile' },
                    { title: 'My Manager Timeline', path: '/home/profile' },
                    { title: 'Biography', path: '/home/profile' },
                    { title: 'Press Conferences', path: '/home/profile' },
                    { title: 'Keep History After Retirement', path: '/home/profile' },
                ] },
            { title: 'Notebook', path: '/inbox/around-the-world' },
        ]
    }
}

export const getTacticsItems = (): MenuItem => {
    return {
        children: [
            { title: 'Overview', path: '/tactics/overview' },
            { title: 'Player', path: '/tactics/player' },
            { title: 'Set Pieces', children: [
                    { title: 'Set Piece Takers', path: '/tactics/set-piece-takers' },
                    { title: 'Corners', path: '/tactics/corners' },
                    { title: 'Free Kicks', path: '/tactics/free-kicks' },
                    { title: 'Throw-Ins', path: '/tactics/throw-ins' },
                    { title: 'Penalties', path: '/tactics/penalties' },
                ] },
            { title: 'Captains', path: '/tactics/captains' },
            { title: 'Match Plans', path: '/tactics/match-plans' },
            { title: 'Opposition Instructions', path: '/tactics/opposition-instructions' },
        ]
    }
}

export const getSquadItems = (): MenuItem => {
    return {
        children: [
            { title: 'Overview', children: [
                    { title: 'Overview', path: '/squad/overview' },
                    { title: 'Numbers', path: '/squad/numbers' },
                    { title: 'Registration', path: '/squad/registration' },
                    { title: 'All Players', path: '/squad/all-players' },
                    { title: 'Export Team for Versus Competition', path: '/squad/export-team' },
                ] },
            { title: 'International', children: [
                    { title: 'Players on Int Duty', path: '/squad/players-on-in-duty' },
                    { title: 'Int Friendly Availability', path: '/squad/in-friendly-availability' },
                ] },
        ]
    }
}

export const getScheduleItems = (): MenuItem => {
    return {
        children: [
            { title: 'Fixtures', path: '/schedule/fixtures' },
            { title: 'Calendar', path: '/schedule/calendar' },
            { title: 'Events', path: '/schedule/events' },
            { title: 'Reminders', path: '/schedule/reminders' },
        ]
    }
}

export const getMedicalCentreItems = (): MenuItem => {
    return {
        children: [
            { title: 'Overview', path: '/medical-centre/overview' },
            { title: 'Risk Assessment', path: '/medical-centre/risk-assessment' },
            { title: 'Current Injuries', path: '/medical-centre/current-injuries' },
            { title: 'Injury History', path: '/medical-centre/injury-history' },
            { title: 'Season Summary', path: '/medical-centre/season-summary' },
        ]
    }
}

export const getTransfersItems = (): MenuItem => {
    return {
        children: [
            { title: 'Transfer Centre', path: '/transfers/transfer-centre' },
            { title: 'Director of Football', children: [
                    { title: 'Transfer Targets', path: '/transfers/transfer-targets' },
                    { title: 'Unwanted List', path: '/transfers/unwanted-list' },
                    { title: 'Development List', path: '/transfers/development-list' },
                    { title: 'Suggest Transfer Targets', path: '/transfers/suggest-transfer-targets' },
                ] },
            { title: 'Clauses', path: '/transfers/clauses' },
            { title: 'Transfer History', path: '/transfers/transfer-history' },
        ]
    }
}

export const getClubVisionItems = (): MenuItem => {
    return {
        children: [
            { title: 'Overview', path: '/club-vision/overview' },
            { title: 'Board', path: '/club-vision/board' },
            { title: 'Performance', children: [
                    { title: 'Performance', path: '/club-vision/performance' },
                    { title: 'Match Performance', path: '/club-vision/match-performance' },
                    { title: 'Transfer Activity', path: '/club-vision/transfer-activity' },
                    { title: 'Squad', path: '/club-vision/squad' },
                    { title: 'Tactics', path: '/club-vision/tactics' },
                ] },
            { title: 'Supporters', path: '/club-vision/supporters' },
        ]
    }
}

export const getDevCentreItems = (): MenuItem => {
    return {
        children: [
            { title: 'Overview', path: '/dev-centre/overview' },
            { title: 'Loans', path: '/dev-centre/loans' },
            { title: 'Under 19s', children: [
                    { title: 'Overview', path: '/dev-centre/under-19s' },
                    { title: 'Squad', path: '/dev-centre/squad' },
                    { title: 'Dynamics', path: '/dev-centre/dynamics' },
                    { title: 'Tactics', path: '/dev-centre/tactics' },
                    { title: 'Training', path: '/dev-centre/training' },
                    { title: 'Match', path: '/dev-centre/match' },
                    { title: 'Fixtures', path: '/dev-centre/fixtures' },
                    { title: 'Competitions', path: '/dev-centre/competitions' },
                ] },
            { title: 'Youth Candidates', path: '/dev-centre/youth-candidates' },
            { title: 'Staff', children: [
                    { title: 'Metalist Under 19s Staff', path: '/dev-centre/metalist-under-19s-staff' },
                ] },
        ]
    }
}

export const getCompetitionsItems = (): MenuItem => {
    return {
        children: [
            { title: 'Competitions', path: '/finances/competitions' },
        ]
    }
}

export const getFinancesItems = (): MenuItem => {
    return {
        children: [
            { title: 'Summary', path: '/finances/summary' },
            { title: 'Income', path: '/finances/income' },
            { title: 'Expenditure', path: '/finances/expenditure' },
            { title: 'Wages', children: [
                    { title: 'Summary', path: '/finances/wages' },
                    { title: 'Salary Commitments', path: '/finances/salary-commitments' },
                    { title: 'Code of Conduct', path: '/finances/code-of-conduct' },
                ] },
            { title: 'FFP', children: [
                    { title: 'Summary', path: '/finances/ffp' },
                ] },
            { title: 'Debt and Loans', path: '/finances/debt-and-loans' },
            { title: 'Sponsors and Other', path: '/finances/sponsors-other' },
            { title: 'Projection', path: '/finances/projection' },
        ]
    }
}

export const getStaffItems = (): MenuItem => {
    return {
        children: [
            { title: 'Overview', children: [
                    { title: 'Overview', path: '/staff/overview' },
                    { title: 'Coaching Team', path: '/staff/coaching-team' },
                    { title: 'Medical Team', path: '/staff/medical-team' },
                    { title: 'Recruitment Team', path: '/staff/recruitment-team' },
                    { title: 'All', path: '/staff/all' },
                ] },
            { title: 'Responsibilities', children: [
                    { title: 'Overview', path: '/staff/responsibilities' },
                    { title: 'Board', path: '/staff/board' },
                    { title: 'Staff', path: '/staff/staff' },
                    { title: 'Advice and Reports', path: '/staff/advice-and-reports' },
                    { title: 'Transfers and Contracts', path: '/staff/transfers-and-contracts' },
                    { title: 'Match', path: '/staff/match' },
                    { title: 'Media', path: '/staff/media' },
                    { title: 'Training', path: '/staff/training' },
                    { title: 'Tactics', path: '/staff/tactics' },
                ] },
            { title: 'Staff Search', path: '/staff/staff-search' },
            { title: 'Staff Shortlist', path: '/staff/staff-shortlist' },
            { title: 'Job Centre', path: '/staff/job-centre' },
            { title: 'Job Security', path: '/staff/job-security' },
        ]
    }
}

export const getClubInfoItems = (): MenuItem => {
    return {
        children: [
            { title: 'Profile', path: '/club-info/profile' },
            { title: 'General', path: '/club-info/general' },
            { title: 'News', path: '/club-info/news' },
            { title: 'Facilities', path: '/club-info/facilities' },
            { title: 'Affiliates', children: [
                    { title: 'Affiliated Clubs', path: '/club-info/affiliated-clubs' },
                    { title: 'Proposed Affiliates', path: '/club-info/proposed-affiliates' },
                ] },
            { title: 'History', children: [
                    { title: 'Overview', path: '/club-info/history' },
                    { title: 'Competitions', path: '/club-info/competitions' },
                    { title: 'Landmarks', path: '/club-info/landmarks' },
                    { title: 'Managers', path: '/club-info/managers' },
                    { title: 'Records', path: '/club-info/records' },
                    { title: 'Best Eleven', path: '/club-info/best-eleven' },
                    { title: 'Players', path: '/club-info/players' },
                    { title: 'Notes', path: '/club-info/notes' },
                ] },
        ]
    }
}

export const getSquadPlannerItems = (): MenuItem => {
    return {
        children: [
            { title: 'Squad Planner', path: '/planner/squad-planner' },
            { title: 'Experience Matrix', path: '/planner/experience-matrix' },
            { title: 'Report', children: [
                    { title: 'Best XI', path: '/planner/best-xi' },
                    { title: 'Assistant Report', path: '/squad/assistant-report' },
                    { title: 'Stats', path: '/squad/stats' },
                    { title: 'Comparison', path: '/squad/comparison' },
                ] },
        ]
    }
}
