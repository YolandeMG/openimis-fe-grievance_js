import _ from "lodash";

export function ticketLabel(ticket) {
  if (!ticket) return "";
  return `${_.compact([ticket.ticketCode]).join(" ")}${
    !!ticket.ticketCode ? ` (${ticket.ticketCode})` : ""
  }`;
}
