import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { bindActionCreators } from 'redux';
import ClickOutside from 'react-click-outside';
import ShouldRender from '../basic/ShouldRender';
import { Validate } from '../../config';
import { openModal, closeModal } from '../../actions/modal';
import {
    createDuplicateStatusPage,
    readStatusPage,
} from '../../actions/statusPage';
import DuplicateStatusPageConfirmation from './DuplicateStatusPageConfirmation';

function validate(values) {
    const errors = {};

    if (!Validate.text(values.name)) {
        errors.name = 'Status Page Name is required!';
    }
    return errors;
}

export class StatusPageForm extends React.Component {
    // eslint-disable-next-line
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: null,
        };
    }

    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyBoard);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyBoard);
    }

    submitForm = values => {
        const { data } = this.props;
        readStatusPage(data.statusPageId, values)
            .then(response => {
                const statusPageData = response.data;
                delete statusPageData._id;
                statusPageData.name = values.name;
                return new Promise(resolve => {
                    resolve(statusPageData);
                });
            })
            .then(res => {
                createDuplicateStatusPage(res)
                    .then(res => {
                        this.props.closeModal({
                            id: this.props.duplicateModalId,
                        });
                        this.props.openModal({
                            id: this.props.duplicateModalId,
                            content: DuplicateStatusPageConfirmation,
                            statusPageId: res.data._id,
                            subProjectId: data.subProjectId,
                            projectId: data.projectId,
                        });
                    })
                    .catch(error => {
                        if (error && error.response && error.response.data)
                            this.setState({
                                errorMessage: error.response.data,
                            });

                        if (error && error.data) {
                            this.setState({
                                errorMessage: error.data,
                            });
                        }
                        if (error && error.message) {
                            this.setState({
                                errorMessage: error.message,
                            });
                        } else {
                            this.setState({
                                errorMessage: 'Network Error',
                            });
                        }
                    });
            });
    };

    handleKeyBoard = e => {
        switch (e.key) {
            case 'Escape':
                return this.handleCloseModal();
            case 'Enter':
                return document
                    .querySelector('#btnDuplicateStatusPage')
                    .click();
            default:
                return false;
        }
    };

    handleCloseModal = () => {
        this.props.closeModal({
            id: this.props.duplicateModalId,
        });
    };

    render() {
        const { handleSubmit } = this.props;
        return (
            <form onSubmit={handleSubmit(this.submitForm.bind(this))}>
                <div className="ModalLayer-wash Box-root Flex-flex Flex-alignItems--flexStart Flex-justifyContent--center">
                    <div
                        className="ModalLayer-contents"
                        tabIndex={-1}
                        style={{ marginTop: 40 }}
                    >
                        <div className="bs-BIM">
                            <div className="bs-Modal bs-Modal--medium">
                                <ClickOutside
                                    onClickOutside={this.handleCloseModal}
                                >
                                    <div className="bs-Modal-header">
                                        <div className="bs-Modal-header-copy">
                                            <span className="Text-color--inherit Text-display--inline Text-fontSize--20 Text-fontWeight--medium Text-lineHeight--24 Text-typeface--base Text-wrap--wrap">
                                                <span>
                                                    Create Duplicate Status Page
                                                </span>
                                            </span>
                                        </div>
                                        <div className="bs-Modal-messages">
                                            <ShouldRender
                                                if={this.state.errorMessage}
                                            >
                                                <p className="bs-Modal-message">
                                                    {this.state.errorMessage}
                                                </p>
                                            </ShouldRender>
                                        </div>
                                    </div>
                                    <div className="bs-Modal-body">
                                        <Field
                                            required={true}
                                            component="input"
                                            name="name"
                                            placeholder="Status Page Name?"
                                            id="name"
                                            className="bs-TextInput"
                                            style={{
                                                width: '90%',
                                                margin: '10px 0 10px 5%',
                                            }}
                                            autoFocus={true}
                                        />
                                    </div>
                                    <div className="bs-Modal-footer">
                                        <div className="bs-Modal-footer-actions">
                                            <button
                                                className={`bs-Button bs-DeprecatedButton btn__modal`}
                                                type="button"
                                                onClick={() => {
                                                    this.props.closeModal({
                                                        id: this.props
                                                            .duplicateModalId,
                                                    });
                                                }}
                                            >
                                                <span>Cancel</span>
                                                <span className="cancel-btn__keycode">
                                                    Esc
                                                </span>
                                            </button>
                                            <button
                                                id="btnDuplicateStatusPage"
                                                className={`bs-Button bs-DeprecatedButton bs-Button--blue btn__modal`}
                                                type="save"
                                            >
                                                <span>Duplicate</span>
                                                <span className="create-btn__keycode">
                                                    <span className="keycode__icon keycode__icon--enter" />
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </ClickOutside>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

StatusPageForm.displayName = 'StatusPageForm';

const DuplicateStatusPageForm = reduxForm({
    form: 'StatusPageModalForm',
    validate,
})(StatusPageForm);

const mapStateToProps = state => {
    return {
        currentProject: state.project.currentProject,
        duplicateModalId: state.modal.modals[0].id,
        statusPage: state.statusPage,
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ openModal, closeModal }, dispatch);
};

StatusPageForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    duplicateModalId: PropTypes.string.isRequired,
    statusPageId: PropTypes.string.isRequired,
    subProjectId: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DuplicateStatusPageForm);