<div>
    <Grid container>
        <Grid item xs={12}>
            <Paper className={classes.paper}>
                <Grid container className={classes.tableTitle}>
                    <Grid item xs={6} className={classes.tableTitle}>
                        <Typography>
                            <FormattedMessage module="ticket" id={title} values={titleParams} />
                        </Typography>
                    </Grid>
                </Grid>
                <Divider />
                <Grid container className={classes.item}>
                    <Grid item xs={6} className={classes.item}>
                        <PublishedComponent
                            pubRef="insuree.InsureePicker"
                            value={edited.insuree}
                            label="insuree"
                            onChange={(v) => this.updateAttribute("insuree", v)}
                            required={true}
                        />
                    </Grid>
                    <Grid item xs={6} className={classes.item}>
                        <TextInput
                            module="ticket" label="ticket.name"
                            //value={!!edited && !!edited.insuree ? edited.insuree.otherNames : ""}
                            value={edited.name}
                            onChange={v => this.updateAttribute("name", v)}
                            required={false} />
                    </Grid>
                    <Grid item xs={6} className={classes.item}>
                        <TextInput
                            label="ticket.phone"
                            //value={!!edited && !!edited.insuree ? edited.insuree.phone : ""}
                            value={edited.phone}
                            onChange={v => this.updateAttribute("phone", v)}
                            required={false} />
                    </Grid>
                    <Grid item xs={6} className={classes.item}>
                        <TextInput
                            label="ticket.email"
                            //value={!!edited && !!edited.insuree ? edited.insuree.email : ""}
                            value={edited.email}
                            onChange={v => this.updateAttribute("email", v)}
                            required={false} />
                    </Grid>
                    <Grid item xs={6} className={classes.item}>
                        <PublishedComponent
                            pubRef="core.DatePicker"
                            label="ticket.dateOfIncident"
                            value={edited.dateOfIncident}
                            required={false}
                            onChange={v => this.updateAttribute("dateOfIncident", v)} />
                    </Grid>
                    <Grid item xs={6} className={classes.item}>
                        <TextInput
                            label="ticket.witness"
                            value={edited.witness}
                            onChange={v => this.updateAttribute("witness", v)}
                            required={false} />
                    </Grid>
                    <Grid item xs={6} className={classes.item}>
                        <PublishedComponent
                            pubRef="ticket.CategoryPicker"
                            value={edited.category}
                            label="category"
                            onChange={(v) => this.updateAttribute("category", v)}
                            required={true}
                        />
                    </Grid>
                    <Grid item xs={6} className={classes.item}>
                        <PublishedComponent
                            pubRef="ticket.TicketPriorityPicker"
                            value={edited.ticketPriority}
                            onChange={(v) => this.updateAttribute("ticketPriority", v)}
                            required={false} />
                    </Grid>
                    <Grid item xs={12} className={classes.item}>
                        <TextInput
                            label="ticket.ticketDescription"
                            value={edited.ticketDescription}
                            onChange={v => this.updateAttribute("ticketDescription", v)}
                            required={false} />
                    </Grid>
                </Grid>
                <div className={classes.fab} variant="contained" style={{ display: 'flex', justifyContent: 'right' }}>
                    <Fab color="primary" onClick={this.save}>
                        <Save />
                    </Fab>
                </div>
            </Paper>
        </Grid>
    </Grid>


    <Grid container>
        <Grid item xs={12}>
            <Paper className={classes.paper}>
                <Grid container className={classes.tableTitle}>
                    <Grid item xs={6} className={classes.tableTitle}>
                        <Typography>
                            <FormattedMessage module="ticket" id={title} values={titleParams} />
                        </Typography>
                    </Grid>
                </Grid>
                <Divider />
                <Grid container className={classes.item}>
                    <Grid item xs={6} className={classes.item}>
                        <PublishedComponent
                            pubRef="insuree.InsureePicker"
                            value={state_edited.insuree}
                            label="insuree"
                            onChange={(v) => this.updateAttribute("insuree", v)}
                            required={true}
                        />
                    </Grid>
                    <Grid item xs={6} className={classes.item}>
                        <TextInput
                            label="ticket.name"
                            value={state_edited.name}
                            onChange={v => this.updateAttribute("name", v)}
                            required={true} />
                    </Grid>
                    <Grid item xs={6} className={classes.item}>
                        <TextInput
                            label="ticket.phone"
                            value={state_edited.phone}
                            onChange={v => this.updateAttribute("phone", v)}
                            required={false} />
                    </Grid>
                    <Grid item xs={6} className={classes.item}>
                        <TextInput
                            label="ticket.email"
                            value={state_edited.email}
                            onChange={v => this.updateAttribute("email", v)}
                            required={false} />
                    </Grid>
                    <Grid item xs={6} className={classes.item}>
                        <PublishedComponent
                            pubRef="core.DatePicker"
                            label="ticket.dateOfIncident"
                            value={state_edited.dateOfIncident}
                            required={false}
                            onChange={v => this.updateAttribute("dateOfIncident", v)} />
                    </Grid>
                    <Grid item xs={6} className={classes.item}>
                        <TextInput
                            label="ticket.witness"
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
                    <Grid item xs={6} className={classes.item}>
                        <PublishedComponent
                            pubRef="ticket.TicketStatusPicker"
                            value={state_edited.ticketStatus}
                            onChange={(v) => this.updateAttribute("ticketStatus", v)}
                            required={false} />
                    </Grid>
                    <Grid item xs={12} className={classes.item}>
                        <TextInput
                            label="ticket.ticketDescription"
                            value={state_edited.ticketDescription}
                            onChange={v => this.updateAttribute("ticketDescription", v)}
                            required={false} />
                    </Grid>
                    <Grid item xs={12} className={classes.item}>
                        <TextInput
                            label="ticket.resolution"
                            value={state_edited.resolution}
                            onChange={v => this.updateAttribute("resolution", v)}
                            required={false} />
                    </Grid>
                </Grid>
                <div className={classes.fab} variant="contained" style={{ display: 'flex', justifyContent: 'right' }}>
                    <Fab color="primary" onClick={this.save}>
                        <Save />
                    </Fab>
                </div>
            </Paper>
        </Grid>
    </Grid>
</div>