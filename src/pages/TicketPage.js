import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
    formatMessageWithValues, withModulesManager, withHistory, historyPush,
} from "@openimis/fe-core";
import TicketForm from "../components/TicketForm";
import { updateTicket, createTicket } from "../actions";
import { RIGHT_TICKET_ADD, RIGHT_TICKET_EDIT } from "../constants";

const styles = theme => ({
    page: theme.page,
});

class TicketPage extends Component {

    add = () => {
        historyPush(this.props.modulesManager, this.props.history, "ticket.route.ticket")
    }

    save = (ticket) => {
        if (!ticket.uuid) {
            this.props.createTicket(
                this.props.modulesManager,
                ticket,
                formatMessageWithValues(
                    this.props.intl,
                    "ticket",
                    "createTicket.mutationLabel",
                    { label: !!ticket.ticketCode ? ticket.ticketCode : "" }
                )
            );
        } else {
            this.props.updateTicket(
                this.props.modulesManager,
                ticket,
                formatMessageWithValues(
                    this.props.intl,
                    "ticket",
                    "updateTicket.mutationLabel",
                    { label: !!ticket.ticketCode ? ticket.ticketCode : "" }
                )
            );

        }
    }

    render() {
        const { classes, modulesManager, history, rights, ticket_uuid, overview } = this.props;
        if (!rights.includes(RIGHT_TICKET_EDIT)) return null;
        return (
            <div className={classes.page}>
                <TicketForm
                    overview={overview}
                    ticket_uuid={ticket_uuid}
                    back={e => historyPush(modulesManager, history, "ticket.route.tickets")}
                    add={rights.includes(RIGHT_TICKET_ADD) ? this.add : null}
                    save={rights.includes(RIGHT_TICKET_EDIT) ? this.save : null}
                />
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    ticket_uuid: props.match.params.ticket_uuid,
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ createTicket, updateTicket }, dispatch);
};

export default withHistory(withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(withStyles(styles)(TicketPage))
    ))));