import React, { Component } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Fab, Grid, Paper, Typography, Divider, IconButton, Modal, Box } from "@material-ui/core";
import { journalize, TextInput, PublishedComponent, FormattedMessage } from "@openimis/fe-core";
import { updateTicket, createTicketAttachment } from "../actions";
import { Save, } from "@material-ui/icons";
import AttachIcon from "@material-ui/icons/AttachFile";

const styles = theme => ({
    paper: theme.paper.paper,
    tableTitle: theme.table.title,
    item: theme.paper.item,
    fullHeight: {
        height: "100%"
    },
});

const style = {
    background: 'white',
    width: '40%',
    margin: '0 auto',
    position: 'relative',
    top: '40%',
    padding: '2em',
    borderRadius: '10px'

}

class EditTicketPage extends Component {

    constructor(props) {
        super(props)
        this.form = React.createRef();
    }

    state = {
        state_edited: {},
        openFileModal: false,
        file: null,
        fileName: '',
    }
    componentDidMount() {
        if (this.props.edited) {
            this.setState((state, props) => ({ state_edited: props.edited }))
        }
    }

    componentDidUpdate(prevPops, prevState, snapshort) {
        if (prevPops.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
        }
    }

    save = e => {
        this.props.updateTicket(this.state.state_edited, `updated ticket ${this.state.state_edited.ticketCode}`)
    }

    updateAttribute = (k, v) => {
        this.setState((state) => ({
            state_edited: { ...state.state_edited, [k]: v }
        }))
    }

    handleOpenModal = () => {
        this.setState(prev => (
            {
                ...prev,
                openFileModal: !this.state.openFileModal
            }
        ))
    }

    handleFileChange = (e) => {
        let file = e.target.files[0];
        this.setState(prevState => ({
            ...prevState,
            file: file
        }))
    }

    handleFileRead = (e) => {
        const content = btoa(e.target.result);
        let filename = this.state.file.name
        let mimeType = this.state.file.type
        const docFile = {
            filename,
            mimeType,
            date: this.state.state_edited.dateOfIncident,
            document: content,
            ticket: this.state.state_edited,

        }
        this.props.createTicketAttachment(docFile, `Uploaded Ticket Attachment`)


    }

    handleFileUpload = (e) => {
        e.preventDefault()
        if (this.state.file) {
            const reader = new FileReader();
            reader.onloadend = this.handleFileRead;
            reader.readAsBinaryString(this.state.file)
        }
    }



    render() {
        const {
            intl, classes, ticket, edited,
            attachment = "Ticket.attachment",
            title = "ticket.title", titleone = " Ticket.ComplainantInformation",
            titletwo = " Ticket.DescriptionOfEvents",
            titlethree = " Ticket.Resolution",
            titleParams = { label: "" },
            ticket_uuid,
            actions, save
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
                                <Grid item xs={5} className={classes.tableTitle}>
                                    <Typography>
                                        <FormattedMessage module="ticket" id={titleone} values={titleParams} />
                                    </Typography>
                                </Grid>
                                <Grid item xs={3} className={classes.tableTitle}>
                                    <PublishedComponent
                                        pubRef="insuree.InsureePicker"
                                        value={state_edited.insuree}
                                        label="Complainant"
                                        onChange={(v) => this.updateAttribute("insuree", v)}
                                        required={true}
                                        readOnly={true}
                                    />
                                </Grid>
                                <Grid item xs={4} className={classes.tableTitle}>
                                    <IconButton variant="contained" component="label" color="primary">
                                        <AttachIcon onClick={this.handleOpenModal} />
                                    </IconButton>

                                    <Modal
                                        open={this.state.openFileModal}
                                        onClose={this.handleOpenModal}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <Box sx={style}>
                                            {
                                                this.state.file && (
                                                    <Typography>
                                                        {this.state.file.name}
                                                    </Typography>
                                                )
                                            }
                                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                                Upload Document
                                            </Typography>

                                            <input
                                                style={{ width: '80%' }}
                                                onChange={(e) => this.setState(prevState => ({
                                                    ...prevState,
                                                    fileName: e.target.value,
                                                }))}
                                            />


                                            <IconButton variant="contained" component="label">
                                                <AttachIcon />
                                                <form ref={this.form}>
                                                    <input type="file" name="uploadedFile" style={{ display: "none" }} onChange={this.handleFileChange} />
                                                </form>

                                            </IconButton>

                                            <IconButton>
                                                <Save onClick={this.handleFileUpload} />
                                            </IconButton>

                                        </Box>
                                    </Modal>

                                </Grid>
                            </Grid>
                            <Divider />
                            <Grid container className={classes.item}>
                                <Grid item xs={4} className={classes.item}>
                                    <TextInput
                                        module="ticket" label="ticket.name"
                                        value={!!state_edited && !!state_edited.insuree ? state_edited.insuree.otherNames + " " + state_edited.insuree.lastName : ""}
                                        onChange={v => this.updateAttribute("name", v)}
                                        required={false}
                                        readOnly={true} />
                                </Grid>
                                <Grid item xs={4} className={classes.item}>
                                    <TextInput
                                        module="ticket" label="ticket.phone"
                                        value={!!state_edited && !!state_edited.insuree ? state_edited.insuree.phone : ""}
                                        onChange={v => this.updateAttribute("phone", v)}
                                        required={false}
                                        readOnly={true} />
                                </Grid>
                                <Grid item xs={4} className={classes.item}>
                                    <TextInput
                                        module="ticket" label="ticket.email"
                                        value={!!state_edited && !!state_edited.insuree ? state_edited.insuree.email : ""}
                                        onChange={v => this.updateAttribute("email", v)}
                                        required={false}
                                        readOnly={true} />
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
                                        <FormattedMessage module="ticket" id={titlethree} values={titleParams} />
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Divider />
                            <Grid container className={classes.item}>
                                <Grid item xs={12} className={classes.item}>
                                    <TextInput
                                        label="ticket.resolution"
                                        value={state_edited.resolution}
                                        onChange={v => this.updateAttribute("resolution", v)}
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
    return bindActionCreators({ updateTicket, createTicketAttachment, journalize }, dispatch)
};

export default withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(EditTicketPage)));