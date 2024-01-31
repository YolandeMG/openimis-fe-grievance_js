import {
  graphql, formatMutation, formatPageQueryWithCount, formatGQLString, formatPageQuery, 
  baseApiUrl, decodeId, openBlob
} from "@openimis/fe-core";

const CATEGORY_FULL_PROJECTION = (mm) => [
  "id",
  "uuid",
  "categoryTitle",
  "slug",
  "validityFrom",
  "validityTo",
];

export function fetchCategoryForPicker(mm, filters) {
  let payload = formatPageQueryWithCount("category", filters, CATEGORY_FULL_PROJECTION(mm));
  return graphql(payload, "CATEGORY_CATEGORY");
}

export function fetchTicketSummaries(mm, filters) {
  var projections = [
    "id", "uuid", "ticketTitle", "ticketCode", "ticketDescription", "ticketStatus", "ticketPriority",
    "ticketDuedate", "category{id, uuid, categoryTitle, slug}",
    "insuree{id, uuid, otherNames, lastName, dob, chfId}"]
  const payload = formatPageQueryWithCount("tickets",
    filters,
    projections
  );
  return graphql(payload, 'TICKET_TICKETS');
}

export function fetchTicket(mm, uuid) {
  let filters = [
    `ticketUuid: "${uuid}"`
  ]
  let projections = [
    "id", "uuid", "ticketTitle", "ticketCode", "ticketDescription",
    "name", "phone", "email", "dateOfIncident", "nameOfComplainant", "witness",
    "resolution", "ticketStatus", "ticketPriority", "dateSubmitted", "dateSubmitted",
    "category{id, uuid, categoryTitle, slug}",
    "insuree{id, uuid, otherNames, lastName, dob, chfId, phone, email}",
    "attachment{edges{node{id, uuid, filename, mimeType, url, document, date}}}",
  ]
  const payload = formatPageQueryWithCount(`ticketDetails`,
    filters,
    projections
  );
  return graphql(payload, 'TICKET_TICKET');
}

export function formatTicketGQL(ticket) {
  return `
    ${ticket.uuid !== undefined && ticket.uuid !== null ? `uuid: "${ticket.uuid}"` : ""}
    ${!!ticket.ticketCode ? `ticketCode: "${formatGQLString(ticket.ticketCode)}"` : ""}
    ${!!ticket.ticketDescription ? `ticketDescription: "${formatGQLString(ticket.ticketDescription)}"` : ""}
    ${!!ticket.insuree && !!ticket.insuree.id ? `insureeUuid: "${ticket.insuree.uuid}"` : ""}
    ${!!ticket.category && !!ticket.category.id ? `categoryUuid: "${ticket.category.uuid}"` : ""}
    ${!!ticket.name ? `name: "${formatGQLString(ticket.name)}"` : ""}
    ${!!ticket.phone ? `phone: "${formatGQLString(ticket.phone)}"` : ""}
    ${!!ticket.email ? `email: "${formatGQLString(ticket.email)}"` : ""}
    ${!!ticket.dateOfIncident ? `dateOfIncident: "${formatGQLString(ticket.dateOfIncident)}"` : ""}
    ${!!ticket.witness ? `witness: "${formatGQLString(ticket.witness)}"` : ""}
    ${!!ticket.nameOfComplainant ? `nameOfComplainant: "${formatGQLString(ticket.nameOfComplainant)}"` : ""}
    ${!!ticket.resolution ? `resolution: "${formatGQLString(ticket.resolution)}"` : ""}
    ${!!ticket.ticketStatus ? `ticketStatus: "${formatGQLString(ticket.ticketStatus)}"` : ""}
    ${!!ticket.ticketPriority ? `ticketPriority: "${formatGQLString(ticket.ticketPriority)}"` : ""}
    ${!!ticket.ticketDuedate ? `ticketDuedate: "${formatGQLString(ticket.ticketDuedate)}"` : ""}
    ${!!ticket.dateSubmitted ? `dateSubmitted: "${formatGQLString(ticket.dateSubmitted)}"` : ""}
  `;
}

export function resolveTicketGQL(ticket) {
  return `
    ${ticket.uuid !== undefined && ticket.uuid !== null ? `uuid: "${ticket.uuid}"` : ""}
    ${!!ticket.ticketStatus ? `ticketStatus: "Close"` : ""}
    ${!!ticket.insuree && !!ticket.insuree.id ? `insureeUuid: "${ticket.insuree.uuid}"` : ""}
    ${!!ticket.category && !!ticket.category.id ? `categoryUuid: "${ticket.category.uuid}"` : ""}
  `;
}

export function createTicket(ticket, clientMutationLabel) {
  let mutation = formatMutation("createTicket", formatTicketGQL(ticket), clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(mutation.payload, ["TICKET_MUTATION_REQ", "TICKET_CREATE_TICKET_RESP", "TICKET_MUTATION_ERR"], {
    clientMutationId: mutation.clientMutationId,
    clientMutationLabel,
    requestedDateTime,

  });

}

export function updateTicket(ticket, clientMutationLabel) {
  let mutation = formatMutation("updateTicket", formatTicketGQL(ticket), clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(mutation.payload, ["TICKET_MUTATION_REQ", "TICKET_UPDATE_TICKET_RESP", "TICKET_MUTATION_ERR"], {
    clientMutationId: mutation.clientMutationId,
    clientMutationLabel,
    requestedDateTime,
    ticketUuid: ticket.uuid,
  });
}

export function resolveTicket(ticket, clientMutationLabel) {
  let mutation = formatMutation("updateTicket", resolveTicketGQL(ticket), clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(mutation.payload, ["TICKET_MUTATION_REQ", "TICKET_UPDATE_TICKET_RESP", "TICKET_MUTATION_ERR"], {
    clientMutationId: mutation.clientMutationId,
    clientMutationLabel,
    requestedDateTime,
    ticketUuid: ticket.uuid,
  });
}

export function fetchTicketAttachments(ticket) {
  if (ticket && ticket.uuid) {
    const payload = formatPageQuery(
      "ticketAttachments",
      [`ticket_Uuid: "${ticket.uuid}"`],
      ["id", "uuid", "date", "filename", "mimeType",
      "ticket{id, uuid, ticketCode}"],
    );
    return graphql(payload, "TICKET_TICKET_ATTACHMENTS");
  } else {
    return { type: "TICKET_TICKET_ATTACHMENTS", payload: { data: [] } };
  }
}

export function downloadAttachment(attach) {
  var url = new URL(`${window.location.origin}${baseApiUrl}/ticket/attach`);
  url.search = new URLSearchParams({ id: decodeId(attach.id) });
  return (dispatch) => {
    return fetch(url)
      .then((response) => response.blob())
      .then((blob) => openBlob(blob, attach.filename, attach.mime));
  };
}

export function formatTicketAttachmentGQL(ticketattachment) {
  return `
    ${ticketattachment.uuid !== undefined && ticketattachment.uuid !== null ? `uuid: "${ticketattachment.uuid}"` : ""}
    ${!!ticketattachment.ticket && !!ticketattachment.ticket.id ? `ticketUuid: "${ticketattachment.ticket.uuid}"` : ""}
    ${!!ticketattachment.filename ? `filename: "${formatGQLString(ticketattachment.filename)}"` : ""}
    ${!!ticketattachment.mimeType ? `mimeType: "${formatGQLString(ticketattachment.mimeType)}"` : ""}
    ${!!ticketattachment.url ? `url: "${formatGQLString(ticketattachment.url)}"` : ""}
    ${!!ticketattachment.date ? `date: "${formatGQLString(ticketattachment.date)}"` : ""}
    ${!!ticketattachment.document ? `document: "${formatGQLString(ticketattachment.document)}"` : ""}
  `;
}

export function createTicketAttachment(ticketattachment, clientMutationLabel) {
  let mutation = formatMutation("createTicketAttachment", formatTicketAttachmentGQL(ticketattachment), clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(mutation.payload, ["TICKET_ATTACHMENT_MUTATION_REQ", "TICKET_CREATE_TICKET_ATTACHMENT_RESP", "TICKET_ATTACHMENT_MUTATION_ERR"], {
    clientMutationId: mutation.clientMutationId,
    clientMutationLabel,
    requestedDateTime,

  });

}

export function formatDisabilityGQL(disability) {
  return `
    ${disability.uuid !== undefined && disability.uuid !== null ? `uuid: "${disability.uuid}"` : ""}
    ${!!disability.code ? `code: "${formatGQLString(disability.code)}"` : ""}
    ${!!disability.disability ? `disability: "${formatGQLString(disability.disability)}"` : ""}
  `;
}

export function createDisability(disability, clientMutationLabel) {
  let mutation = formatMutation("createDisability", formatDisabilityGQL(disability), clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(mutation.payload, ["DISABILITY_MUTATION_REQ", "TICKET_CREATE_DISABILITY_RESP", "DISABILITY_MUTATION_ERR"], {
    clientMutationId: mutation.clientMutationId,
    clientMutationLabel,
    requestedDateTime,

  });

}

export function formatBenefitsGQL(benefits) {
  return `
    ${benefits.uuid !== undefined && benefits.uuid !== null ? `uuid: "${benefits.uuid}"` : ""}
    ${!!benefits.code ? `code: "${formatGQLString(benefits.code)}"` : ""}
    ${!!benefits.benefits ? `benefits: "${formatGQLString(benefits.benefits)}"` : ""}
  `;
}

export function createBenefits(benefits, clientMutationLabel) {
  let mutation = formatMutation("createBenefits", formatBenefitsGQL(benefits), clientMutationLabel);
  var requestedDateTime = new Date();
  return graphql(mutation.payload, ["BENEFITS_MUTATION_REQ", "TICKET_CREATE_BENEFITS_RESP", "BENEFITS_MUTATION_ERR"], {
    clientMutationId: mutation.clientMutationId,
    clientMutationLabel,
    requestedDateTime,

  });

}
