import React from "react";
import { Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import moment from "moment-timezone";
import "./App.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPlus, faCircle } from "@fortawesome/free-solid-svg-icons";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { createBrowserHistory } from "history";
import _ from "lodash";
import AppContext from "./AppContext";
import { AppProvider } from "./AppContext";
import  MyLoader from "./MyLoader";

const history = createBrowserHistory();

function convert(temp, units) {
  if (units === "Celsius") {
    return Math.round(temp - 273.15);
  } else if (units === "Fahrenheit") {
    return Math.round((temp * 9) / 5 - 459.67);
  } else {
    return Math.round(temp);
  }
}

function App() {
  return (
    <AppProvider>
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/home" exact component={Home} />
          <Route path="/add" component={AddCity} />
        </Switch>
      </Router>
    </AppProvider>
  );
}

class UnitIndicator extends React.Component {
  static contextType = AppContext;

  render() {
    const { units, swapUnits } = this.context;

    return (
      <button type="button" onClick={swapUnits} className="unit text-white">
        °{units[0]}
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
          {this.props.page === "add" ? <NewCity /> : <UnitIndicator />}
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
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      timeofday: "daytime",
    };

    this.handler = this.handler.bind(this);
  }

  handler(tod) {
    this.setState({
      timeofday: tod
    });
  }

  render() {
    const { cities } = this.context;
    return (
      <div className={this.state.timeofday}>
        <Nav page="home" />
        <div className="container homeContent">
          <Tabs>
            <TabList>
              {cities.map((c) => {
                return <Tab>{c}</Tab>;
              })}
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
            {cities.map((c) => {
              return (
                <TabPanel>
                  <CityWeather city={c} updatebg={this.handler} tod={this.state.timeofday}/>
                </TabPanel>
              );
            })}
          </Tabs>
        </div>
      </div>
    );
  }
}

class CityWeather extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = { weather: null, units: null };
  }

  async componentDidMount() {
    try {
      const { initCity, units } = this.context;
      const cityObj = initCity(this.props.city);
      const weather = await cityObj.getWeather();
      const tod = moment.tz(weather.timezone).unix() > weather.sunset ? "nighttime" : "daytime";
      this.props.updatebg(tod);
      this.setState({ weather: weather, units: units });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    if (this.state.weather !== null && this.state.units !== null) {
      return (
        <React.Fragment>
          <TodaySummary weather={this.state.weather} units={this.state.units} />
          <hr />
          <HourlySummary
            weather={this.state.weather}
            units={this.state.units}
            date={moment()}
          />
          <hr />
          <DailySummary
            weather={this.state.weather}
            units={this.state.units}
            date={moment()}
          />
          <ConditionSummary weather={this.state.weather} tod={this.props.tod} />
        </React.Fragment>
      );
    } else {
      return ( 
        <MyLoader />
      );
    }
  }
}

class ConditionSummary extends React.Component {

  render() {
    return (
      <div className={`${this.props.tod}-reverse`} id="condition-bg">
      <div className="container" id="conditionSummary">
        <div className="row heading">
          <div className="col">Sunrise</div>
          <div className="col">Sunset</div>
        </div>
        <div className="row text-white pb-3">
          <div className="col">{moment.unix(this.props.weather.current.sunrise).format("h:mm a")}</div>
          <div className="col">{moment.unix(this.props.weather.current.sunset).format("h:mm a")}</div>
        </div>
        <div className="row heading">
          <div className="col">UV Index</div>
          <div className="col">Humidity</div>
        </div>
        <div className="row text-white pb-3">
          <div className="col">{Math.round(this.props.weather.current.uvi)}</div>
          <div className="col">{Math.round(this.props.weather.current.humidity)}%</div>
        </div>
        <div className="row heading">
          <div className="col">Wind</div>
          <div className="col">Pressure</div>
        </div>
        <div className="row text-white pb-3">
          <div className="col">{Math.round(this.props.weather.current.wind_speed)} m/s</div>
          <div className="col">{Math.round(this.props.weather.current.pressure)} hPa</div>
        </div>
      </div>
      </div>
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
    this.times = _.concat(head, tail);
    head.shift();
    let vals = _.concat("Now", head, tail);
    return vals.map((d) => {
      return <th>{d}</th>;
    });
  }

  generateBody() {
    return this.times.map((time) => {
      return (
        <td>{convert(this.props.weather.hourly[time], this.props.units)}°</td>
      );
    });
  }

  render() {
    return (
      <table className="table-responsive" id="weekTemp">
        <thead>
          <tr>{this.generateHeadings()}</tr>
        </thead>
        <tbody>
          <tr className="text-white">{this.generateBody()}</tr>
        </tbody>
      </table>
    );
  }
}

class DailySummary extends React.Component {
  constructor(props) {
    super(props);
    this.dayToday = this.props.date.format("dddd");
  }

  generateBody() {
    const items = [];
    for (let weekday in this.props.weather.daily) {
      if (weekday !== this.dayToday) {
        const value = this.props.weather.daily[weekday];
        let condition, max, min, wkd;
        wkd = <div className="text-white col-4"> {weekday}</div>;
        max = (
          <div className="text-white col-2">
            {convert(value.temp.max, this.props.units)}
          </div>
        );
        min = (
          <div className="col-2 muted">{convert(value.temp.min, this.props.units)}</div>
        );
        if (["09d", "09n", "10d", "10n"].includes(value.condition)) {
          condition = (
            <div className="col-4 muted">
              <FontAwesomeIcon icon={value.icon} className="muted" />
              <span className="humidity pl-2">{value.humidity}%</span>
            </div>
          );
        } else {
          condition = (
            <div className="col-4 muted">
              <FontAwesomeIcon icon={value.icon} className="muted" />
            </div>
          );
        }
        items.push(
          <div className="row py-2">
            {wkd}
            {condition}
            {max}
            {min}
          </div>
        );
      }
    }
    return items;
  }

  render() {
    return (
      <div className="container" id="dailyTemp">
        <div>{this.generateBody()}</div>
      </div>
    );
  }
}

class TodaySummary extends React.Component {
  render() {
    return (
      <div className="container pt-3 left-edge">
        <div className="row" id="topSummary">
          <div className="col-8">
            <div className="row">
              <div>
                <h2 className="text-white" id="ttemp">
                  {convert(this.props.weather.current.temp, this.props.units)}°
                </h2>
              </div>
            </div>
            <div className="row text-white high-low">
                <p>
                  <i className="material-icons md-18 muted">keyboard_arrow_up</i> {convert(this.props.weather.max, this.props.units)}°
                </p>
                <p className="pl-2">
                  <i className="material-icons md-18 muted">
                    keyboard_arrow_down
                  </i> {convert(this.props.weather.min, this.props.units)}°
                </p>
            </div>
            <div className="row pt-4 text-white">
              <p id="condition">
                {_.capitalize(
                  this.props.weather.current.weather[0].description
                )}
              </p>
            </div>
            <div className="row">
              <p id="feelsLike" className="muted">
                Feels like{" "}
                {convert(
                  this.props.weather.current.feels_like,
                  this.props.units
                )}
                °
              </p>
            </div>
          </div>
          <div className="col-4 float-right">
            <FontAwesomeIcon className="text-white" icon={this.props.weather.icon} size="10x" id="headerImage"/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
