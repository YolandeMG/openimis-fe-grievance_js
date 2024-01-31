import React from "react";
import messages_en from "./translations/en.json";
import reducer from "./reducer";
import { ListAlt } from "@material-ui/icons";
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import { FormattedMessage } from "@openimis/fe-core";
import TicketMainMenu from "./menu/TicketMainMenu";
import TicketsPage from "./pages/TicketsPage";
import TicketPage from "./pages/TicketPage";
import TicketSearcher from "./components/TicketSearcher";
import TicketPriorityPicker from "./pickers/TicketPriorityPicker";
import TicketStatusPicker from "./pickers/TicketStatusPicker";
import DropDownCategoryPicker from "./pickers/DropDownCategoryPicker";
import CategoryPicker from "./pickers/CategoryPicker";

const ROUTE_TICKET_TICKETS = "ticket/tickets";
const ROUTE_TICKET_TICKET = "ticket/ticket";

const DEFAULT_CONFIG = {
  translations: [{ key: "en", messages: messages_en }],
  reducers: [{ key: "ticket", reducer }],

  refs: [
    { key: "ticket.route.tickets", ref: ROUTE_TICKET_TICKETS },
    { key: "ticket.route.ticket", ref: ROUTE_TICKET_TICKET },
    { key: "ticket.route.ticketSearcher", ref: TicketSearcher },

    { key: "ticket.TicketStatusPicker", ref: TicketStatusPicker },
    { key: "ticket.TicketPriorityPicker", ref: TicketPriorityPicker },
    { key: "ticket.DropDownCategoryPicker", ref: DropDownCategoryPicker },
    { key: "ticket.CategoryPicker", ref: CategoryPicker },
  ],
  "core.Router": [
    { path: ROUTE_TICKET_TICKETS, component: TicketsPage },
    { path: ROUTE_TICKET_TICKET + "/:ticket_uuid?", component: TicketPage },
  ],

  "admin.MainMenu": [
    {
      text: <FormattedMessage module="ticket" id="menu.ticket" />,
      icon: <RecordVoiceOverIcon />,
      route: "/" + ROUTE_TICKET_TICKETS,
    },
  ],
  "core.MainMenu": [TicketMainMenu],
};

export const GrievanceModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
};

