import React, { Component } from "react";
import { ConstantBasedPicker } from "@openimis/fe-core";

import { TICKET_PRIORITY } from "../constants";

class TicketPriorityPicker extends Component {

    render() {
        const { readOnly = false} = this.props;
        
        return <ConstantBasedPicker
            module="ticket"
            label="Ticket Priority"
            constants={TICKET_PRIORITY}
            readOnly={readOnly}
            {...this.props}
        />
    }
}

export default TicketPriorityPicker;