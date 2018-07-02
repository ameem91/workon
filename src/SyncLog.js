import React from "react";
import { observer } from "mobx-react";
import { format, formatDistance } from "date-fns/esm";

import store from "./Store";

const SyncLog = observer(
  class SyncLog extends React.Component {
    state = {};
    pageTitle = "Sync Log";
    componentDidMount() {
      document.title = this.pageTitle; // XXX Use helmet
    }

    componentWillUnmount() {
      this.dismounted = true;
    }

    render() {
      return (
        <div>
          <h1 className="title">{this.pageTitle}</h1>
          <ListAll items={store.todos.syncLogs} />
        </div>
      );
    }
  }
);

export default SyncLog;

class ListAll extends React.PureComponent {
  state = {};

  render() {
    const { items } = this.props;
    if (!items.length) {
      return <div>Nothing yet</div>;
    }
    return (
      <div>
        <h2 className="title">{items.length} Sync Attempts</h2>
        {items.map((data, i) => (
          <Log key={data.lastModified} data={data} first={!i} />
        ))}
      </div>
    );
  }
}

class Log extends React.PureComponent {
  state = {
    expand: this.props.first
  };
  render() {
    const { data } = this.props;
    const preStyle = {
      fontSize: "80%"
    };
    if (!this.state.expand) {
      preStyle.maxHeight = 100;
    }
    return (
      <div
        className="synclog-item"
        style={{
          marginTop: 15,
          paddingTop: 10,
          borderTop: "1px solid #ccc"
        }}
      >
        <h4
          className={
            data.ok
              ? "title is-4 has-text-success"
              : "title is-4 has-text-danger"
          }
          style={{ marginBottom: 2 }}
        >
          {data.ok ? "OK" : "Not OK"}
        </h4>
        <small>
          Last modified:{" "}
          <b>
            {format(data.lastModified, "PPPPpppp")} ({formatDistance(
              data.lastModified,
              new Date(),
              { addSuffix: true }
            )})
          </b>
        </small>
        <pre
          style={preStyle}
          onClick={event => {
            this.setState({ expand: !this.state.expand });
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  }
}
