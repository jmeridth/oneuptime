import 'ejs';
import Redis from 'CommonServer/Infrastructure/Redis';
import Express, { ExpressApplication } from 'CommonServer/Utils/Express';
import logger from 'CommonServer/Utils/Logger';
import BaseAPI from 'CommonServer/API/BaseAPI';
import App from 'CommonServer/Utils/StartServer';
import { PostgresAppInstance } from 'CommonServer/Infrastructure/PostgresDatabase';

import User from 'Model/Models/User';
import UserService, {
    Service as UserServiceType,
} from 'CommonServer/Services/UserService';

import BillingPaymentMethodAPI from 'CommonServer/API/BillingPaymentMethodAPI';

import BillingInvoiceAPI from 'CommonServer/API/BillingInvoiceAPI';

import Project from 'Model/Models/Project';
import ProjectService, {
    Service as ProjectServiceType,
} from 'CommonServer/Services/ProjectService';

import Probe from 'Model/Models/Probe';
import ProbeService, {
    Service as ProbeServiceType,
} from 'CommonServer/Services/ProbeService';

import StatusPagePrivateUser from 'Model/Models/StatusPagePrivateUser';
import StatusPagePrivateUserService, {
    Service as StatusPagePrivateUserServiceType,
} from 'CommonServer/Services/StatusPagePrivateUserService';

import StatusPageFooterLink from 'Model/Models/StatusPageFooterLink';
import StatusPageFooterLinkService, {
    Service as StatusPageFooterLinkServiceType,
} from 'CommonServer/Services/StatusPageFooterLinkService';

import StatusPageHeaderLink from 'Model/Models/StatusPageHeaderLink';
import StatusPageHeaderLinkService, {
    Service as StatusPageHeaderLinkServiceType,
} from 'CommonServer/Services/StatusPageHeaderLinkService';

import StatusPageAnnouncement from 'Model/Models/StatusPageAnnouncement';
import StatusPageAnnouncementService, {
    Service as StatusPageAnnouncementServiceType,
} from 'CommonServer/Services/StatusPageAnnouncementService';

import EmailVerificationToken from 'Model/Models/EmailVerificationToken';
import EmailVerificationTokenService, {
    Service as EmailVerificationTokenServiceType,
} from 'CommonServer/Services/EmailVerificationTokenService';

import Team from 'Model/Models/Team';
import TeamService, {
    Service as TeamServiceType,
} from 'CommonServer/Services/TeamService';

import TeamMember from 'Model/Models/TeamMember';
import TeamMemberService, {
    Service as TeamMemberServiceType,
} from 'CommonServer/Services/TeamMemberService';

import TeamPermission from 'Model/Models/TeamPermission';
import TeamPermissionService, {
    Service as TeamPermissionServiceType,
} from 'CommonServer/Services/TeamPermissionService';

import Label from 'Model/Models/Label';
import LabelService, {
    Service as LabelServiceType,
} from 'CommonServer/Services/LabelService';

import ProjectSmtpConfig from 'Model/Models/ProjectSmtpConfig';
import ProjectSmtpConfigService, {
    Service as ProjectSMTPConfigServiceType,
} from 'CommonServer/Services/ProjectSmtpConfigService';

import ApiKey from 'Model/Models/ApiKey';
import ApiKeyService, {
    Service as ApiKeyServiceType,
} from 'CommonServer/Services/ApiKeyService';

import ApiKeyPermission from 'Model/Models/ApiKeyPermission';
import ApiKeyPermissionService, {
    Service as ApiKeyPermissionServiceType,
} from 'CommonServer/Services/ApiKeyPermissionService';

import Monitor from 'Model/Models/Monitor';
import MonitorService, {
    Service as MonitorServiceType,
} from 'CommonServer/Services/MonitorService';

import OnCallDuty from 'Model/Models/OnCallDuty';
import OnCallDutyService, {
    Service as OnCallDutyServiceType,
} from 'CommonServer/Services/OnCallDutyService';

import MonitorStatus from 'Model/Models/MonitorStatus';
import MonitorStatusService, {
    Service as MonitorStatusServiceType,
} from 'CommonServer/Services/MonitorStatusService';

import MonitorTimelineStatus from 'Model/Models/MonitorStatusTimeline';
import MonitorTimelineStatusService, {
    Service as MonitorTimelineStatusServiceType,
} from 'CommonServer/Services/MonitorStatusTimelineService';

import ScheduledMaintenanceState from 'Model/Models/ScheduledMaintenanceState';
import ScheduledMaintenanceStateService, {
    Service as ScheduledMaintenanceStateServiceType,
} from 'CommonServer/Services/ScheduledMaintenanceStateService';

import ScheduledMaintenance from 'Model/Models/ScheduledMaintenance';
import ScheduledMaintenanceService, {
    Service as ScheduledMaintenanceServiceType,
} from 'CommonServer/Services/ScheduledMaintenanceService';

import ScheduledMaintenanceStateTimeline from 'Model/Models/ScheduledMaintenanceStateTimeline';
import ScheduledMaintenanceStateTimelineService, {
    Service as ScheduledMaintenanceStateTimelineServiceType,
} from 'CommonServer/Services/ScheduledMaintenanceStateTimelineService';

import ScheduledMaintenanceInternalNote from 'Model/Models/ScheduledMaintenanceInternalNote';
import ScheduledMaintenanceInternalNoteService, {
    Service as ScheduledMaintenanceInternalNoteServiceType,
} from 'CommonServer/Services/ScheduledMaintenanceInternalNoteService';

import ScheduledMaintenancePublicNote from 'Model/Models/ScheduledMaintenancePublicNote';
import ScheduledMaintenancePublicNoteService, {
    Service as ScheduledMaintenancePublicNoteServiceType,
} from 'CommonServer/Services/ScheduledMaintenancePublicNoteService';

import IncidentState from 'Model/Models/IncidentState';
import IncidentStateService, {
    Service as IncidentStateServiceType,
} from 'CommonServer/Services/IncidentStateService';

import Incident from 'Model/Models/Incident';
import IncidentService, {
    Service as IncidentServiceType,
} from 'CommonServer/Services/IncidentService';

import IncidentStateTimeline from 'Model/Models/IncidentStateTimeline';
import IncidentStateTimelineService, {
    Service as IncidentStateTimelineServiceType,
} from 'CommonServer/Services/IncidentStateTimelineService';

import IncidentInternalNote from 'Model/Models/IncidentInternalNote';
import IncidentInternalNoteService, {
    Service as IncidentInternalNoteServiceType,
} from 'CommonServer/Services/IncidentInternalNoteService';

import IncidentPublicNote from 'Model/Models/IncidentPublicNote';
import IncidentPublicNoteService, {
    Service as IncidentPublicNoteServiceType,
} from 'CommonServer/Services/IncidentPublicNoteService';

import Domain from 'Model/Models/Domain';
import DomainService, {
    Service as DomainServiceType,
} from 'CommonServer/Services/DomainService';

import StatusPageGroup from 'Model/Models/StatusPageGroup';
import StatusPageGroupService, {
    Service as StatusPageGroupServiceType,
} from 'CommonServer/Services/StatusPageGroupService';

import StatusPageResource from 'Model/Models/StatusPageResource';
import StatusPageResourceService, {
    Service as StatusPageResourceServiceType,
} from 'CommonServer/Services/StatusPageResourceService';

import IncidentSeverity from 'Model/Models/IncidentSeverity';
import IncidentSeverityService, {
    Service as IncidentSeverityServiceType,
} from 'CommonServer/Services/IncidentSeverityService';

import StatusPageDomain from 'Model/Models/StatusPageDomain';
import StatusPageDomainService, {
    Service as StatusPageDomainServiceType,
} from 'CommonServer/Services/StatusPageDomainService';

// Import API

import StatusPageAPI from 'CommonServer/API/StatusPageAPI';

import StatusPageSubscriberAPI from 'CommonServer/API/StatusPageSubscriberAPI';

const app: ExpressApplication = Express.getExpressApp();

const APP_NAME: string = 'api';

//attach api's
app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<User, UserServiceType>(User, UserService).getRouter()
);
app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<Project, ProjectServiceType>(
        Project,
        ProjectService
    ).getRouter()
);
app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<Probe, ProbeServiceType>(Probe, ProbeService).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<StatusPageAnnouncement, StatusPageAnnouncementServiceType>(
        StatusPageAnnouncement,
        StatusPageAnnouncementService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<Team, TeamServiceType>(Team, TeamService).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<TeamMember, TeamMemberServiceType>(
        TeamMember,
        TeamMemberService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<TeamPermission, TeamPermissionServiceType>(
        TeamPermission,
        TeamPermissionService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<MonitorStatus, MonitorStatusServiceType>(
        MonitorStatus,
        MonitorStatusService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<IncidentState, IncidentStateServiceType>(
        IncidentState,
        IncidentStateService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<
        ScheduledMaintenanceState,
        ScheduledMaintenanceStateServiceType
    >(ScheduledMaintenanceState, ScheduledMaintenanceStateService).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<StatusPageResource, StatusPageResourceServiceType>(
        StatusPageResource,
        StatusPageResourceService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<Domain, DomainServiceType>(Domain, DomainService).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<StatusPageGroup, StatusPageGroupServiceType>(
        StatusPageGroup,
        StatusPageGroupService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<StatusPageDomain, StatusPageDomainServiceType>(
        StatusPageDomain,
        StatusPageDomainService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<IncidentStateTimeline, IncidentStateTimelineServiceType>(
        IncidentStateTimeline,
        IncidentStateTimelineService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<
        ScheduledMaintenanceStateTimeline,
        ScheduledMaintenanceStateTimelineServiceType
    >(
        ScheduledMaintenanceStateTimeline,
        ScheduledMaintenanceStateTimelineService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<StatusPagePrivateUser, StatusPagePrivateUserServiceType>(
        StatusPagePrivateUser,
        StatusPagePrivateUserService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<Incident, IncidentServiceType>(
        Incident,
        IncidentService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<ScheduledMaintenance, ScheduledMaintenanceServiceType>(
        ScheduledMaintenance,
        ScheduledMaintenanceService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<ApiKey, ApiKeyServiceType>(ApiKey, ApiKeyService).getRouter()
);
app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<ApiKeyPermission, ApiKeyPermissionServiceType>(
        ApiKeyPermission,
        ApiKeyPermissionService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<StatusPageHeaderLink, StatusPageHeaderLinkServiceType>(
        StatusPageHeaderLink,
        StatusPageHeaderLinkService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<StatusPageFooterLink, StatusPageFooterLinkServiceType>(
        StatusPageFooterLink,
        StatusPageFooterLinkService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<ApiKey, ApiKeyServiceType>(ApiKey, ApiKeyService).getRouter()
);
app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<ApiKeyPermission, ApiKeyPermissionServiceType>(
        ApiKeyPermission,
        ApiKeyPermissionService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<IncidentSeverity, IncidentSeverityServiceType>(
        IncidentSeverity,
        IncidentSeverityService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<Label, LabelServiceType>(Label, LabelService).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<EmailVerificationToken, EmailVerificationTokenServiceType>(
        EmailVerificationToken,
        EmailVerificationTokenService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<ProjectSmtpConfig, ProjectSMTPConfigServiceType>(
        ProjectSmtpConfig,
        ProjectSmtpConfigService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<Monitor, MonitorServiceType>(
        Monitor,
        MonitorService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<MonitorTimelineStatus, MonitorTimelineStatusServiceType>(
        MonitorTimelineStatus,
        MonitorTimelineStatusService
    ).getRouter()
);

app.use(`/${APP_NAME.toLocaleLowerCase()}`, new StatusPageAPI().getRouter());
app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new StatusPageSubscriberAPI().getRouter()
);
app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BillingPaymentMethodAPI().getRouter()
);
app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BillingInvoiceAPI().getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<
        ScheduledMaintenancePublicNote,
        ScheduledMaintenancePublicNoteServiceType
    >(
        ScheduledMaintenancePublicNote,
        ScheduledMaintenancePublicNoteService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<
        ScheduledMaintenanceInternalNote,
        ScheduledMaintenanceInternalNoteServiceType
    >(
        ScheduledMaintenanceInternalNote,
        ScheduledMaintenanceInternalNoteService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<IncidentPublicNote, IncidentPublicNoteServiceType>(
        IncidentPublicNote,
        IncidentPublicNoteService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<IncidentInternalNote, IncidentInternalNoteServiceType>(
        IncidentInternalNote,
        IncidentInternalNoteService
    ).getRouter()
);

app.use(
    `/${APP_NAME.toLocaleLowerCase()}`,
    new BaseAPI<OnCallDuty, OnCallDutyServiceType>(
        OnCallDuty,
        OnCallDutyService
    ).getRouter()
);

const init: Function = async (): Promise<void> => {
    try {
        // init the app
        await App(APP_NAME);
        // connect to the database.
        await PostgresAppInstance.connect(
            PostgresAppInstance.getDatasourceOptions()
        );

        // connect redis
        await Redis.connect();
    } catch (err) {
        logger.error('App Init Failed:');
        logger.error(err);
    }
};

init();
