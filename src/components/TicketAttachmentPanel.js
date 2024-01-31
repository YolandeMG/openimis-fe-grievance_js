import React, { Component } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { bindActionCreators } from "redux";
import { formatMessageWithValues, withModulesManager, withHistory, Table, ProgressOrError } from "@openimis/fe-core";
import { fetchTicketAttachments, downloadAttachment } from "../actions";
import { Paper, Link, IconButton } from "@material-ui/core";
import ReplayIcon from "@material-ui/icons/Replay";


const styles = theme => ({
    paper: theme.paper.paper,
    tableTitle: theme.table.title,
    item: theme.table.item,
    fullHeight: {
        height: "100%"
    },
});


class TicketAttachmentPanel extends Component {

    state = {
        edited: null,
        page: 0,
        pageSize: 5,
        afterCursor: null,
        beforeCursor: null,
    }

    constructor(props) {
        super(props);
        this.rowsPerPageOptions = props.modulesManager.getConf("fe-ticket", "ticketFilter.rowsPerPageOptions", [10, 20, 50, 100]);
        this.defaultPageSize = props.modulesManager.getConf("fe-ticket", "ticketFilter.defaultPageSize", 10);
    }

    query = () => {
        if (this.props.edited) {
            this.props.fetchTicketAttachments(this.props.edited);
        }
    }

    onChangeRowsPerPage = (cnt) => {
        this.setState(
            {
                pageSize: cnt,
                page: 0,
                afterCursor: null,
                beforeCursor: null,
            },
            e => this.query()
        )
    }

    componentDidMount() {
        this.setState({ orderBy: null }, e => this.onChangeRowsPerPage(this.defaultPageSize))
    }

    ticketChanged = (prevProps) => (!prevProps.ticket && !!this.props.ticket) ||
        (
            !!prevProps.ticket &&
            !!this.props.ticket &&
            (prevProps.ticket.uuid == null || prevProps.ticket.uuid !== this.props.ticket.uuid)
        )

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.ticketChanged(prevProps)) {
            this.query();
            this.setState({ reload: false })
        }
    }

    queryPrms = () => {
        let prms = [];
        if (!!this.state.orderBy) {
            prms.push(`orderBy: "${this.state.orderBy}"`)
        }
        if (!!this.props.ticket && !!this.props.ticket.uuid) {
            prms.push(`uuid:"${this.props.ticket.uuid}"`);
            return prms;
        }
        return null;
    }

    onChangePage = (page, nbr) => {

        if (nbr > this.state.page) {
            this.setState((state, props) => ({
                page: this.state.page + 1,
                beforeCursor: null,
                afterCursor: this.props.programsPageInfo.endCursor,
            }),
                e => this.query(uuid)
            )

        } else if (nbr < this.state.page) {
            this.setState((state, props) => ({
                page: this.state.page - 1,
                beforeCursor: this.props.programsPageInfo.startCursor,
                afterCursor: null,
            }),
                e => this.query(uuid)
            )

        }
    }

    download = (a) => {
        this.props.downloadAttachment(a);
    };

    reload = () => {
        this.props.fetchTicketAttachments(this.props.edited);
    }

    fileSelected = (f, i) => {
        if (!!f.target.files) {
            const file = f.target.files[0];
            let ticketAttachments = [...this.state.ticketAttachments];
            ticketAttachments[i].filename = file.name;
            ticketAttachments[i].mime = file.type;
        }
    };

    formatFileName(a, i) {
        if (!!a.id)
            return (
                <Link onClick={(e) => this.download(a)} reset={this.state.reset}>
                    {a.filename || ""}
                </Link>
            );
        if (!!a.filename) return <i>{a.filename}</i>;
        return (
            <IconButton variant="contained" component="label">
                <FileIcon />
                <input type="file" style={{ display: "none" }} onChange={(f) => this.fileSelected(f, i)} />
            </IconButton>
        );
    }

    render() {
        const { intl, classes, fetchingTicketAttachments, errorTicketAttachments, ticketAttachments } = this.props;

        let headers = [
            "ticket.attachments.table.filename",
            "ticket.attachments.table.date",
            "ticket.attachments.table.file",
        ]

        let itemFormatters = [
            e => e.filename,
            e => e.date,
            (a, i) => this.formatFileName(a, i),

        ]


        return (
            <div className={classes.page} >

                < ProgressOrError progress={fetchingTicketAttachments} error={errorTicketAttachments} />

                <Paper className={classes.paper}>
                    <div style={{ textAlign: 'end' }}>
                        <IconButton variant="contained" component="label" onClick={this.reload}>
                            <ReplayIcon />
                        </IconButton>
                    </div>
                    <Table
                        module="programs"
                        //fetch={this.props.fetchTicketAttachments}
                        header={formatMessageWithValues(intl, "ticket", "ticket.attachments.table")}
                        headers={headers}
                        itemFormatters={itemFormatters}
                        items={ticketAttachments}
                        withPagination={true}
                        page={this.state.page}
                        pageSize={this.state.pageSize}
                        onChangePage={this.onChangePage}
                        onChangeRowsPerPage={this.onChangeRowsPerPage}
                        rowsPerPageOptions={this.rowsPerPageOptions}
                        defaultPageSize={this.defaultPageSize}
                        rights={this.rights}
                    /></Paper>

            </div>
        )
    }
}


const mapStateToProps = state => ({
    fetchingTicketAttachments: state.ticket.fetchingTicketAttachments,
    errorTicketAttachments: state.ticket.errorTicketAttachments,
    fetchedTicketAttachments: state.ticket.fetchedTicketAttachments,
    ticketAttachments: state.ticket.ticketAttachments,
});

const mapDispatchToProps = dispatch => {

    return bindActionCreators({ fetchTicketAttachments, downloadAttachment, }, dispatch);
};


export default withHistory(withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(withStyles(styles)(TicketAttachmentPanel))
    ))));
