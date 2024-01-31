import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { historyPush, withModulesManager, withHistory, withTooltip, formatMessage } from "@openimis/fe-core";
import TicketSearcher from "../components/TicketSearcher";

import { RIGHT_TICKET_ADD } from "../constants";

const styles = theme => ({
    page: theme.page,
    fab: theme.fab
});

class TicketsPage extends Component {

    onDoubleClick = (i, newTab = false) => {
        historyPush(this.props.modulesManager, this.props.history, "ticket.route.ticket", [i.uuid], newTab)
    }

    onAdd = () => {
        historyPush(this.props.modulesManager, this.props.history, "ticket.route.ticket");
    }

    render() {
        const { intl, classes, rights } = this.props;
        return (
            <div className={classes.page}>
                <TicketSearcher
                    cacheFiltersKey="ticketPageFiltersCache"
                    onDoubleClick={this.onDoubleClick}
                />
                {rights.includes(RIGHT_TICKET_ADD) &&
                    withTooltip(
                        <div className={classes.fab} >
                            <Fab color="primary" onClick={this.onAdd}>
                                <AddIcon />
                            </Fab>
                        </div>,
                        formatMessage(intl, "ticket", "addNewticketTooltip")
                    )
                }
            </div >
        )
    }
}

const mapStateToProps = state => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
})

export default injectIntl(withModulesManager(withHistory(connect(mapStateToProps)(withTheme(withStyles(styles)(TicketsPage))))));