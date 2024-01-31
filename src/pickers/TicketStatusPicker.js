import React, { Component } from "react";
import { ConstantBasedPicker } from "@openimis/fe-core";

import { TICKET_STATUS } from "../constants";

class TicketStatusPicker extends Component {

    render() {
        const { readOnly = false} = this.props;
        
        return <ConstantBasedPicker
            module="ticket"
            label="Ticket Status"
            constants={TICKET_STATUS}
            readOnly={readOnly}
            {...this.props}
        />
    }
}

export default TicketStatusPicker;