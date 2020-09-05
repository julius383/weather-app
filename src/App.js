import React from "react";
import { Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import moment from "moment";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPlus, faCircle } from "@fortawesome/free-solid-svg-icons";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { createBrowserHistory } from "history";
import sun from "./sun.svg";
import _ from "lodash";

const history = createBrowserHistory();

function App() {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/home" exact component={Home} />
        <Route path="/add" component={AddCity} />
      </Switch>
    </Router>
  );
}

function UnitIndicator(props) {
  if (props.unit === "C") {
    return (
      <button
        type="button"
        onClick={console.log("Now in Celsius")}
        className="unit text-white"
      >
        °C
      </button>
    );
  } else {
    return (
      <button
        type="button"
        onClick={console.log("Now in Farenheit")}
        className="unit text-white"
      >
        °F
      </button>
    );
  }
}

function NewCity() {
  return (
    <button type="button" onClick={alert("Now in Farenheit")} className="unit">
      <FontAwesomeIcon icon={faPlus} className="text-white" />
    </button>
  );
}

class Nav extends React.Component {
  constructor(props) {
    super(props);
    const date = moment().format("ddd, MMMM D");
    this.state = {
      current: "/home",
      date: moment().format("ddd, MMMM D"),
      pages: ["/home", "/add"],
    };
  }

  render() {
    return (
      <nav className="navbar navbar-expand-md text-white">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarContent"
        >
          <FontAwesomeIcon icon={faBars} className="text-white" />
        </button>
        <React.Fragment>
          <span className="align-middle">
            {this.props.page === "add" ? "Add City" : this.state.date}
          </span>
          {this.props.page === "add" ? <NewCity /> : <UnitIndicator unit="C" />}
        </React.Fragment>
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav">
            <li className="nav-item" key="home">
              <Link className="nav-link" to="/">
                Home{" "}
              </Link>
            </li>
            <li className="nav-item" key="add">
              <Link className="nav-link" to="/add">
                Add City
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

class AddCity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cities: [],
    };
  }

  render() {
    return (
      <React.Fragment>
        <Nav page="add" />
        <div className="container">
          <p> Add City </p>
        </div>
      </React.Fragment>
    );
  }
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stuff: [],
    };
  }

  render() {
    return (
      <React.Fragment>
        <Nav page="home" />
        <div className="container homeContent">
          <Tabs>
            <TabList>
              <Tab>Nairobi</Tab>
            </TabList>

            <div className="d-inline-flex flex-row indicator">
              <span>
                <FontAwesomeIcon icon={faCircle} className="indicatorIcon" />
              </span>
              <span>
                <FontAwesomeIcon icon={faCircle} className="indicatorIcon" />
              </span>
              <span>
                <FontAwesomeIcon icon={faCircle} className="indicatorIcon" />
              </span>
              <span>
                <FontAwesomeIcon icon={faCircle} className="indicatorIcon" />
              </span>
            </div>
            <TabPanel>
              <TodaySummary />
              <hr />
              <HourlySummary date={moment()} />
              <hr />
            </TabPanel>
          </Tabs>
        </div>
      </React.Fragment>
    );
  }
}

class HourlySummary extends React.Component {
  constructor(props) {
    super(props);
    this.times = [];
    for (let j of ["am", "pm"]) {
      for (let i = 1; i < 13; i++) {
        this.times.push(i.toString() + " " + j);
      }
    }
    this.date = this.props.date.format("h a");
  }

  generateHeadings() {
    let tail = _.takeWhile(this.times, (x) => {
      return x !== this.date;
    });
    let head = _.dropWhile(this.times, (x) => {
      return x !== this.date;
    });
    head.shift();
    let vals = _.concat("Now", head, tail);
    return vals.map((d) => {
      return <th>{d}</th>;
    });
  }

  render() {
    return (
      <table>
        <thead>
          <tr>{this.generateHeadings()}</tr>
        </thead>
        <tbody></tbody>
      </table>
    );
  }
}

class TodaySummary extends React.Component {
  render() {
    return (
      <div className="container pt-3">
        <div className="row" id="topSummary">
          <div className="col-4">
            <div className="row">
              <div>
                <h2 className="text-white" id="ttemp">
                  28°
                </h2>
              </div>
            </div>
            <div className="row text-white high-low">
              <span className="pr-4">
                <i className="material-icons md-18 muted">keyboard_arrow_up</i>
                31°
              </span>
              <span>
                <i className="material-icons md-18 muted">
                  keyboard_arrow_down
                </i>
                18°
              </span>
            </div>
            <div className="row pt-4 text-white">
              <p id="condition">Sunny</p>
            </div>
            <div className="row">
              <p id="feelsLike" className="muted">
                Feels like 18°
              </p>
            </div>
          </div>
          <div className="col-6 float-right">
            <img src={sun} alt="current weather symbol" id="headerImage" />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
