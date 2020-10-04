import React, { Component } from "react";
import City from './City';

const AppContext = React.createContext();

class AppProvider extends Component {
  state = {
    units: "Celsius",
    cities: ["Nairobi", "Moscow", "Tokyo", "San Francisco"],
    weather: {},
  };

  swapUnits = () => {
    this.setState((prevState) => ({
      units: prevState.units === "Celsius" ? "Fahrenheit" : "Celsius",
    }));
  };

  initCity = (city) => {
    if (this.state.weather[city] === undefined) {
      const newWeather = {}
      newWeather[city] = new City(city); 
      this.setState({weather: newWeather});
      return newWeather[city];
    }
    else {
      return this.state.weather[city];
    }
  };

  render() {
    const { children } = this.props;
    const { units, cities, weather } = this.state;
    const { swapUnits, initCity } = this;

    return (
      <AppContext.Provider
        value={{
          units,
          cities,
          weather,
          swapUnits,
          initCity,
        }}
      >
        {children}
      </AppContext.Provider>
    );
  }
}

export default AppContext;
export { AppProvider };
