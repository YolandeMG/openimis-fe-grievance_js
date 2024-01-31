import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { AssignmentInd } from "@material-ui/icons";
import {
  formatMessage,
  MainMenuContribution,
  withModulesManager,
} from "@openimis/fe-core";

class TicketMainMenu extends Component {
  render() {
    const { modulesManager, rights } = this.props;
    let entries = [];

    if (!entries.length) return null;
    return (
      <MainMenuContribution
      // {...this.props}
      // header={formatMessage(this.props.intl, "ticket", "mainMenu")}
      // icon={<AssignmentInd />}
      // entries={entries}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  rights:
    !!state.core && !!state.core.user && !!state.core.user.i_user
      ? state.core.user.i_user.rights
      : [],
});

export default withModulesManager(
  injectIntl(connect(mapStateToProps)(TicketMainMenu))
);
