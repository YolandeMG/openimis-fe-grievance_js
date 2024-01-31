import React, { Component, Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { IconButton } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
    withModulesManager, formatMessageWithValues, formatMessage,
    withHistory, historyPush, coreConfirm, journalize,
    Searcher
} from "@openimis/fe-core";
import { RIGHT_TICKET_ADD } from "../constants";
import { fetchTicketSummaries, resolveTicket } from "../actions";

import AddIcon from "@material-ui/icons/Add";
// import {CheckCircle as CloseIcon} from '@material-ui/icons';

const styles = (theme) => ({
    paper: {
        ...theme.paper.paper,
        margin: 0,
    },
    paperHeader: {
        ...theme.paper.header,
        padding: 10,
    },
    tableTitle: theme.table.title,
    fab: theme.fab,
    button: {
        margin: theme.spacing(1),
    },
    item: {
        padding: theme.spacing(1),
    },
});


class TicketSearcher extends Component {

    state = {
        open: false,
        chfid: null,
        confirmedAction: null,
        reset: 0,
    }

    constructor(props) {
        super(props);
        this.rowsPerPageOptions = props.modulesManager.getConf("fe-ticket", "ticketFilter.rowsPerPageOptions", [10, 20, 50, 100]);
        this.defaultPageSize = props.modulesManager.getConf("fe-ticket", "ticketFilter.defaultPageSize", 10);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
            this.setState({ reset: this.state.reset + 1 });
        } else if (!prevProps.confirmed && this.props.confirmed) {
            this.state.confirmedAction();
        }
    }

    onAdd = () => {
        historyPush(this.props.modulesManager, this.props.history, "ticket.route.addticket");
    }

    fetch = (prms) => {
        this.props.fetchTicketSummaries(
            this.props.modulesManager,
            prms
        )
    }

    rowIdentifier = (r) => r.uuid

    filtersToQueryParams = (state) => {
        let prms = Object.keys(state.filters)
            .filter(f => !!state.filters[f]['filter'])
            .map(f => state.filters[f]['filter']);
        prms.push(`first: ${state.pageSize}`);
        if (!!state.afterCursor) {
            prms.push(`after: "${state.afterCursor}"`)
        }
        if (!!state.beforeCursor) {
            prms.push(`before: "${state.beforeCursor}"`)
        }
        if (!!state.orderBy) {
            prms.push(`orderBy: ["${state.orderBy}"]`);
        }
        return prms;
    }

    _onClick = (i, newTab = false) => {
        historyPush(this.props.modulesManager, this.props.history, "insuree.route.insuree", [i.uuid], newTab);
    }

    resolveTicket = e => {
        this.props.resolveTicket(this.props.edited_id)
    }

    headers = (filters) => {
        var h = [
            "tickets.ticketCode",
            "tickets.beneficaryCode",
            "tickets.beneficary",
            "tickets.priority",
            "tickets.status",
        ]
        return h;
    }

    sorts = (filters) => {
        var results = [
            ["ticketCode", true],
            ["insuree_id", true],
            ["insuree", true],
            ["ticket_priority", true],
            ["ticket_status", true]
        ];
        return results;

    }

    itemFormatters = (filters) => {
        var formatters = [
            ticket => ticket.ticketCode,
            ticket => ticket.insuree.chfId,
            // ticket => <Button onClick={this._onClick} color="primary">{ticket.insuree.chfId}</Button>,
            ticket => ticket.insuree.otherNames + ' ' + ticket.insuree.lastName,
            ticket => ticket.ticketPriority,
            ticket => ticket.ticketStatus,

        ]
        return formatters;
    }

    rowDisabled = (selection, i) => !!i.validityTo
    rowLocked = (selection, i) => !!i.clientMutationId

    render() {
        const { intl,
            tickets, ticketsPageInfo, fetchingTickets, fetchedTickets, errorTickets,
            filterPaneContributionsKey, cacheFiltersKey, onDoubleClick, rights, readOnly, classes
        } = this.props;

        let count = ticketsPageInfo.totalCount;


        let actions =
            !!readOnly || !rights.includes(RIGHT_TICKET_ADD)
                ? []
                : [
                    {
                        button: (
                            <IconButton onClick={this.onAdd}>
                                <AddIcon />
                            </IconButton>
                        ),
                        tooltip: formatMessage(intl, 'ticket', 'action.AddTicket.tooltip')
                    }
                ]


        return (
            <Fragment>
                <Searcher
                    module="ticket"
                    cacheFiltersKey={cacheFiltersKey}
                    filterPaneContributionsKey={filterPaneContributionsKey}
                    items={tickets}
                    itemsPageInfo={ticketsPageInfo}
                    fetchingItems={fetchingTickets}
                    fetchedItems={fetchedTickets}
                    errorItems={errorTickets}
                    tableTitle={formatMessageWithValues(intl, "ticket", "ticketSummaries", { count })}
                    rowsPerPageOptions={this.rowsPerPageOptions}
                    defaultPageSize={this.defaultPageSize}
                    fetch={this.fetch}
                    rowIdentifier={this.rowIdentifier}
                    filtersToQueryParams={this.filtersToQueryParams}
                    defaultOrderBy="ticketCode"
                    headers={this.headers}
                    itemFormatters={this.itemFormatters}
                    sorts={this.sorts}
                    rowDisabled={this.rowDisabled}
                    rowLocked={this.rowLocked}
                    onDoubleClick={(i) => !i.clientMutationId && onDoubleClick(i)}
                    reset={this.state.reset}

                />
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    tickets: state.ticket.tickets,
    ticketsPageInfo: state.ticket.ticketsPageInfo,
    fetchingTickets: state.ticket.fetchingTickets,
    fetchedTickets: state.ticket.fetchedTickets,
    errorTickets: state.ticket.errorTickets,
    submittingMutation: state.ticket.submittingMutation,
    mutation: state.ticket.mutation,
    confirmed: state.core.confirmed,
});


const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        { fetchTicketSummaries, resolveTicket, journalize, coreConfirm },
        dispatch);
};

export default withModulesManager(withHistory(connect(mapStateToProps, mapDispatchToProps)(injectIntl(withTheme(withStyles(styles)(TicketSearcher))))));