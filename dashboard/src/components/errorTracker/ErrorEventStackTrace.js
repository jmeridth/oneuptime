import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ShouldRender from '../basic/ShouldRender';

class ErrorEventStackTrace extends Component {
    render() {
        const { errorEvent } = this.props;
        const errorEventDetails = errorEvent.errorEvent;
        return (
            <ShouldRender
                if={
                    !errorEvent.requesting &&
                    errorEventDetails &&
                    errorEventDetails.content
                }
            >
                <div className="Box-divider--border-top-1 Padding-vertical--20">
                    <div>
                        <p className="SubHeader">Exception</p>
                    </div>
                    <div>
                        <span className="Text-fontSize--14 Text-fontWeight--bold">
                            {errorEventDetails &&
                                errorEventDetails.content &&
                                errorEventDetails.content.type}
                        </span>
                        <span>
                            {' '}
                            {errorEventDetails &&
                                errorEventDetails.content &&
                                errorEventDetails.content.message}
                        </span>
                    </div>
                    {errorEventDetails &&
                        errorEventDetails.content &&
                        errorEventDetails.content.stacktrace &&
                        errorEventDetails.content.stacktrace.frames && (
                            <div className="Flex-flex Flex-wrap--wrap">
                                <div className="Tag-Pill">
                                    <div className="Tag-Title">function</div>
                                    <div className="Tag-Content">
                                        {
                                            errorEventDetails.content.stacktrace
                                                .frames[0].methodName
                                        }
                                    </div>
                                </div>
                            </div>
                        )}

                    <div className="Stacktrace-Listing">
                        {errorEventDetails &&
                        errorEventDetails.content &&
                        errorEventDetails.content.stacktrace &&
                        errorEventDetails.content.stacktrace.frames &&
                        errorEventDetails.content.stacktrace.frames.length >
                            0 ? (
                            errorEventDetails.content.stacktrace.frames.map(
                                (frame, i) => {
                                    return (
                                        <div key={i}>
                                            <a
                                                href={frame.fileName}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="Text-fontWeight--bold"
                                            >
                                                {frame.fileName}
                                                {'  '}
                                            </a>
                                            <img
                                                src="/dashboard/assets/img/external.svg"
                                                alt=""
                                                style={{
                                                    height: '12px',
                                                    width: '12px',
                                                    cursor: 'pointer',
                                                }}
                                            />
                                            {'  '}
                                            in{' '}
                                            <span className="Text-fontWeight--bold">
                                                {frame.methodName}
                                            </span>{' '}
                                            at line{' '}
                                            <span className="Text-fontWeight--bold">
                                                {`${frame.lineNumber}:${frame.columnNumber}`}
                                            </span>
                                        </div>
                                    );
                                }
                            )
                        ) : (
                            <div> no stacktrace avaialble </div>
                        )}
                    </div>
                </div>
            </ShouldRender>
        );
    }
}
ErrorEventStackTrace.propTypes = {
    errorEvent: PropTypes.object,
};
ErrorEventStackTrace.displayName = 'ErrorEventStackTrace';
export default ErrorEventStackTrace;