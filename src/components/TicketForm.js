import React, { Component, Fragment } from "react";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import ReplayIcon from "@material-ui/icons/Replay";
import {
    formatMessageWithValues, withModulesManager, journalize,
    Form, ProgressOrError
} from "@openimis/fe-core";
import { bindActionCreators } from "redux";
import { fetchTicket, fetchTicketAttachments } from "../actions";
import { ticketLabel } from "../utils/utils";
import EditTicketPage from "../pages/EditTicketPage";
import AddTicketPage from "../pages/AddTicketPage";
import TicketAttachmentPanel from "./TicketAttachmentPanel";

const styles = theme => ({
    page: theme.page,
});

class TicketForm extends Component {

    state = {
        lockNew: false,
        reset: 0,
        ticket_uuid: null,
        ticket: this._newTicket(),
        newTicket: true,
    }

    _newTicket() {
        let ticket = {};
        return ticket;
    }

    componentDidMount() {
        if (this.props.ticket_uuid) {
            this.setState((state, props) => ({ ticket_uuid: props.ticket_uuid }))
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.ticket.ticketCode !== this.state.ticket.ticketCode) {
            document.title = formatMessageWithValues(this.props.intl, "ticket", "ticket.title.bar", { label: ticketLabel(this.state.ticket) })
        }
        if (prevProps.fetchedTicket !== this.props.fetchedTicket
            && !!this.props.fetchedTicket
            && !!this.props.ticket) {
            this.setState((state, props) => ({
                ticket: { ...props.ticket },
                ticket_uuid: props.ticket.uuid,
                lockNew: false,
                newTicket: false,
            }));
        } else if (prevState.ticket_uuid !== this.state.ticket_uuid) {
            this.props.fetchTicket(
                this.props.modulesManager,
                this.state.ticket_uuid,
                null
            )
        } else if (prevProps.ticket_uuid && !this.props.ticket_uuid) {
            this.setState({ ticket: this._newTicket(), lockNew: false, ticket_uuid: null });
        } else if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
            this.setState((state) => ({ reset: state.reset + 1 }));
        }
    }


    _add = () => {
        this.setState((state) => ({
            ticket: this._newTicket(),
            newTicket: true,
            lockNew: false,
            reset: state.reset + 1,
        }),
            e => {
                this.props.add();
                this.forceUpdate();
            }
        )
    }

    reload = () => {
        this.props.fetchTicketAttachments(
            this.props.modulesManager,
            this.state.ticket_uuid,
            this.state.ticket.code,

        );
    }

    canSave = () => {
        if (!this.state.ticket.name) return false;
        if (!this.state.ticket.insuree) return false;
        if (!this.state.ticket.category) return false;
        return true;
    }

    _save = (ticket) => {
        this.setState(
            { lockNew: !ticket.uuid },
            e => this.props.save(ticket))
    }

    onEditedChanged = ticket => {
        this.setState({ ticket, newTicket: false })
    }

    render() {
        const {
            fetchingTicket,
            fetchedTicket,
            errorTicket,
            add, save, back
        } = this.props;

        const {
            lockNew,
            newTicket,
            reset,
            update,
            overview,
            ticket_uuid,
            ticket
        } = this.state;

        let readOnly = lockNew || !!ticket.validityTo;
        let actions = [];

        if (ticket_uuid) {
            actions.push({
                doIt: e => this.reload(ticket_uuid),
                icon: <ReplayIcon />,
                onlyIfDirty: !readOnly
            });
        }


        return (
            <Fragment>
                <ProgressOrError progress={fetchingTicket} error={errorTicket} />
                {(!!fetchedTicket || !ticket_uuid) && (
                    <Fragment>
                        <Form
                            module="ticket"
                            edited_id={ticket_uuid}
                            edited={ticket}
                            reset={reset}
                            update={update}
                            title="ticket.title.bar"
                            titleParams={{ label: ticketLabel(this.state.ticket) }}
                            back={back}
                            save={!!save ? this._save : null}
                            canSave={this.canSave}
                            reload={(ticket_uuid || readOnly) && this.reload}
                            readOnly={readOnly}
                            overview={overview}
                            Panels={ticket_uuid ? [EditTicketPage, TicketAttachmentPanel] : [AddTicketPage]}
                            onEditedChanged={this.onEditedChanged}
                            actions={actions}
                        />
                    </Fragment>
                )}
            </Fragment>
        )
    }
}

const mapStateToProps = (state, props) => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    fetchingTicket: state.ticket.fetchingTicket,
    errorTicket: state.ticket.errorTicket,
    fetchedTicket: state.ticket.fetchedTicket,
    ticket: state.ticket.ticket,
    submittingMutation: state.ticket.submittingMutation,
    mutation: state.ticket.mutation,
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchTicket, fetchTicketAttachments, journalize }, dispatch);
};

export default withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(TicketForm)

));