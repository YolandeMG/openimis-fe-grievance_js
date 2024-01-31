import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { injectIntl } from "react-intl";
import { fetchCategoryForPicker } from "../actions";
import { TextInput, Picker, withModulesManager } from "@openimis/fe-core";
import _ from "lodash";

const styles = (theme) => ({
  label: {
    color: theme.palette.primary.main,
  },
  item: {
    padding: theme.spacing(1),
  },
});

class RawFilter extends Component {
  state = {
    slug: "",
    categoryTitle: "",
  };

  stateToFilters = () => {
    let filters = [];
    if (!!this.state.slug) {
      filters.push(`slug_Istartswith: "${this.state.slug}"`);
    }
    if (!!this.state.categoryTitle) {
      filters.push(`categoryTitle_Istartswith: "${this.state.categoryTitle}"`);
    }
    return filters;
  };

  _onChange = (a, v) => {
    this.setState({ [a]: v }, (e) => this.props.onChange(this.stateToFilters()));
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid container>
        <Grid item xs={4} className={classes.item}>
          <TextInput
            autoFocus={true}
            module="category"
            label="category.slug"
            value={this.state.slug}
            onChange={(v) => this._onChange("slug", v)}
          />
        </Grid>
        <Grid item xs={4} className={classes.item}>
          <TextInput
            module="category"
            label="category.categoryTitle"
            value={this.state.categoryTitle}
            onChange={(v) => this._onChange("categoryTitle", v)}
          />
        </Grid>
      </Grid>
    );
  }
}

const Filter = withTheme(withStyles(styles)(RawFilter));

const INIT_STATE = {
  page: 0,
  pageSize: 10,
  afterCursor: null,
  beforeCursor: null,
  filters: [],
  selected: null,
};

class CategoryPicker extends Component {
  state = INIT_STATE;

  componentDidMount() {
    if (this.props.value) {
      this.setState((state, props) => ({ selected: props.value }));
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.reset !== this.props.reset) {
      this.setState((state, props) => ({
        ...INIT_STATE,
        selected: props.value,
      }));
    } else if (!_.isEqual(prevProps.value, this.props.value)) {
      this.setState((state, props) => ({ selected: props.value }));
    }
  }

  formatSuggestion = (a) => (!!a ? `${a.categoryTitle} (${a.slug})` : "");

  filtersToQueryParams = () => {
    let prms = [...(this.props.forcedFilter || []), ...this.state.filters];
    prms = prms.concat(`first: ${this.state.pageSize}`);
    if (!!this.state.afterCursor) {
      prms = prms.concat(`after: "${this.state.afterCursor}"`);
    }
    if (!!this.state.beforeCursor) {
      prms = prms.concat(`before: "${this.state.beforeCursor}"`);
    }
    return prms;
  };

  getSuggestions = (filters) => {
    this.setState({ filters }, (e) =>
      this.props.fetchCategoryForPicker(this.props.modulesManager, this.filtersToQueryParams()),
    );
  };

  debouncedGetSuggestion = _.debounce(
    this.getSuggestions,
    this.props.modulesManager.getConf("fe-category", "debounceTime", 800),
  );

  onChangeRowsPerPage = (cnt) => {
    this.setState(
      {
        pageSize: cnt,
        page: 0,
        afterCursor: null,
        beforeCursor: null,
      },
      (e) => this.props.fetchCategoryForPicker(this.props.modulesManager, this.filtersToQueryParams()),
    );
  };

  onSelect = (v) => {
    this.setState({ selected: v }, this.props.onChange(v, this.formatSuggestion(v)));
  };

  onChangePage = (page, nbr) => {
    if (nbr > this.state.page) {
      this.setState(
        (state, props) => ({
          page: state.page + 1,
          beforeCursor: null,
          afterCursor: props.categoryPageInfo.endCursor,
        }),
        (e) => this.props.fetchCategoryForPicker(this.props.modulesManager, this.filtersToQueryParams()),
      );
    } else if (nbr < this.state.page) {
      this.setState(
        (state, props) => ({
          page: state.page - 1,
          beforeCursor: props.categoryPageInfo.startCursor,
          afterCursor: null,
        }),
        (e) => this.props.fetchCategoryForPicker(this.props.modulesManager, this.filtersToQueryParams()),
      );
    }
  };

  render() {
    const {
      category,
      categoryPageInfo,
      readOnly = false,
      required = false,
      withLabel = true,
      IconRender = null,
      title,
      check,
      checked,
    } = this.props;
    return (
      <Picker
        module="category"
        label={!!withLabel ? "category.label" : null}
        title={title}
        dialogTitle="category.picker.dialog.title"
        IconRender={IconRender}
        check={check}
        checked={checked}
        filter={<Filter onChange={this.debouncedGetSuggestion} />}
        suggestions={category}
        suggestionFormatter={this.formatSuggestion}
        page={this.state.page}
        pageSize={this.state.pageSize}
        count={categoryPageInfo.totalCount}
        onChangePage={this.onChangePage}
        onChangeRowsPerPage={this.onChangeRowsPerPage}
        onSelect={this.onSelect}
        value={this.state.selected}
        readOnly={readOnly}
        required={required}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  category: state.ticket.category,
  categoryPageInfo: state.ticket.categoryPageInfo,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ fetchCategoryForPicker }, dispatch);
};

export default withModulesManager(
  connect(mapStateToProps, mapDispatchToProps)(injectIntl(withTheme(withStyles(styles)(CategoryPicker)))),
);