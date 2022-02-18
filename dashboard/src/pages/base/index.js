import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import Fade from 'react-reveal/Fade';
import PropTypes from 'prop-types';
import ShouldRender from '../components/basic/ShouldRender';
import TutorialBox from '../components/tutorial/TutorialBox';
import BreadCrumbItem from '../components/breadCrumb/BreadCrumbItem';

class Page extends Component {

    constructor({ pageName, pageFriendlyName, pagePath, breadCrumbsProps, showTutorial, ...props }) {
        super({ pageName, pageFriendlyName, pagePath, breadCrumbsProps, showTutorial, ...props });
    }

    renderCommon(children) {
        const {
            projectId,
            project,
        } = this.props;

        const projectName = project ? project.name : '';
        const projectSlug = project ? project.slug : '';

        return (
            <Fade>

                <BreadCrumbItem
                    route="/"
                    name={projectName}
                    projectId={projectId}
                    slug={projectSlug}
                />

                <BreadCrumbItem route={pagePath} name={pageFriendlyName} />

                <ShouldRender if={showTutorial}>
                    <TutorialBox
                        type={pageName}
                        currentProjectId={projectId}
                    />
                </ShouldRender>
                {/** Render Children */}
                {children}
            </Fade>
        );
    }
}

export const defaultMapDispatchToProps = dispatch => {
    return bindActionCreators({}, dispatch);
};

export const defaultMapStateToProps = (state) => {

    // try to get custom project tutorial by project ID
    const projectCustomTutorial = state.tutorial[projectId];

    // set a default show to true for the tutorials to display
    const tutorialStat = {
        statusPage: { show: true },
    };

    // loop through each of the tutorial stat, if they have a value based on the project id, replace it with it
    for (const key in tutorialStat) {
        if (projectCustomTutorial && projectCustomTutorial[key]) {
            tutorialStat[key].show = projectCustomTutorial[key].show;
        }
    }

    return {
        projectId: state.project?.currentProject?._id,
        subProjectId: state.subProject?.activeSubProject?._id,
        project: state.project?.currentProject,
        subproject: state.subProject?.activeSubProject,
        currentActiveProjectId: state.project?.currentProject?._id || state.subProject?.activeSubProject?._id,
        currentActiveProject: state.project?.currentProject || state.subProject?.activeSubProject,
        user: PropTypes.object,
        userId: PropTypes.string,
        userRoleByCurrentActiveProject: PropTypes.string,
        userRoleByProject: PropTypes.string,
        userRoleBySubProject: PropTypes.string,
    };
}

Page.defaultPropTypes = {
    projectId: PropTypes.string,
    subProjectId: PropTypes.string,
    project: PropTypes.object,
    subproject: PropTypes.object,
    currentActiveProjectId: PropTypes.string,
    currentActiveProject: PropTypes.object,
    user: PropTypes.object,
    userId: PropTypes.string,
    userRoleByCurrentActiveProject: PropTypes.string,
};

Page.displayName = 'Page';

export default Page;