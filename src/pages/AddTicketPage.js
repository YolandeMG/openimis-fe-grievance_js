import React, { Component } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Fab, Grid, Paper, Typography, Divider, IconButton } from "@material-ui/core";
import { Save } from "@material-ui/icons";
import { TextInput, journalize, PublishedComponent, FormattedMessage } from "@openimis/fe-core";
import { createTicket } from "../actions";

const styles = theme => ({
    paper: theme.paper.paper,
    tableTitle: theme.table.title,
    item: theme.paper.item,
    fullHeight: {
        height: "100%"
    },
});


class AddTicketPage extends Component {

    state = {
        state_edited: {}
    }

    componentDidUpdate(prevPops, prevState, snapshort) {
        if (prevPops.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
        }
    }

    save = e => {
        this.props.createTicket(this.state.state_edited, `Created Ticket ${this.state.state_edited.insuree.otherNames} ${this.state.state_edited.insuree.lastName}`)

    }

    updateAttribute = (k, v) => {
        this.setState((state) => ({
            state_edited: { ...state.state_edited, [k]: v }
        }))
    }

    render() {
        const {
            intl, classes,
            title = "Ticket.title", titleone = " Ticket.ComplainantInformation",
            titletwo = " Ticket.DescriptionOfEvents",
            titlethree = " Ticket.Resolution",
            titleParams = { label: "" }, 
            actions
        } = this.props;

        const {
            state_edited
        } = this.state;
        return (
            <div className={classes.page}>
                <Grid container>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Grid container className={classes.tableTitle}>
                                <Grid item xs={8} className={classes.tableTitle}>
                                    <Typography>
                                        <FormattedMessage module="ticket" id={titleone} values={titleParams} />
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} className={classes.tableTitle}>
                                    <PublishedComponent
                                        pubRef="insuree.InsureePicker"
                                        value={state_edited.insuree}
                                        label="Complainant"
                                        onChange={(v) => this.updateAttribute("insuree", v)}
                                        required={true}
                                    />
                                </Grid>
                            </Grid>
                            <Divider />
                            <Grid container className={classes.item}>
                                <Grid item xs={4} className={classes.item}>
                                    <TextInput
                                        module="ticket" label="ticket.name"
                                        value={!!state_edited && !!state_edited.insuree ? state_edited.insuree.otherNames  +" "+ state_edited.insuree.lastName : ""}
                                        onChange={v => this.updateAttribute("name", v)}
                                        required={false} 
                                        readOnly={true}/>
                                </Grid>
                                <Grid item xs={4} className={classes.item}>
                                    <TextInput
                                        module="ticket" label="ticket.phone"
                                        value={!!state_edited && !!state_edited.insuree ? state_edited.insuree.phone : ""}
                                        onChange={v => this.updateAttribute("phone", v)}
                                        required={false} 
                                        readOnly={true}/>
                                </Grid>
                                <Grid item xs={4} className={classes.item}>
                                    <TextInput
                                        module="ticket" label="ticket.email"
                                        value={!!state_edited && !!state_edited.insuree ? state_edited.insuree.email : ""}
                                        onChange={v => this.updateAttribute("email", v)}
                                        required={false} 
                                        readOnly={true}/>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>

                <Grid container>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Grid container className={classes.tableTitle}>
                                <Grid item xs={12} className={classes.tableTitle}>
                                    <Typography>
                                        <FormattedMessage module="ticket" id={titletwo} values={titleParams} />
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Divider />
                            <Grid container className={classes.item}>
                                <Grid item xs={6} className={classes.item}>
                                    <PublishedComponent
                                        pubRef="core.DatePicker"
                                        label="ticket.eventDate"
                                        value={state_edited.dateOfIncident}
                                        required={false}
                                        onChange={v => this.updateAttribute("dateOfIncident", v)} />
                                </Grid>
                                <Grid item xs={6} className={classes.item}>
                                    <TextInput
                                        module="ticket" label="ticket.witness"
                                        value={state_edited.witness}
                                        onChange={v => this.updateAttribute("witness", v)}
                                        required={false} />
                                </Grid>
                                <Grid item xs={6} className={classes.item}>
                                    <PublishedComponent
                                        pubRef="ticket.DropDownCategoryPicker"
                                        value={state_edited.category}
                                        onChange={(v) => this.updateAttribute("category", v)}
                                        required={false} />
                                </Grid>
                                <Grid item xs={6} className={classes.item}>
                                    <PublishedComponent
                                        pubRef="ticket.TicketPriorityPicker"
                                        value={state_edited.ticketPriority}
                                        onChange={(v) => this.updateAttribute("ticketPriority", v)}
                                        required={false} />
                                </Grid>
                                <Grid item xs={12} className={classes.item}>
                                    <TextInput
                                        label="ticket.ticketDescription"
                                        value={state_edited.ticketDescription}
                                        onChange={v => this.updateAttribute("ticketDescription", v)}
                                        required={false} />
                                </Grid>
                                <Grid item xs={11} className={classes.item}>
                                </Grid>
                                <Grid item xs={1} className={classes.item}>
                                    <IconButton variant="contained" component="label" color="primary" onClick={this.save}>
                                        <Save />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => ({
    submittingMutation: state.ticket.submittingMutation,
    mutation: state.ticket.mutation,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ createTicket, journalize }, dispatch)
};

export default withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AddTicketPage)));