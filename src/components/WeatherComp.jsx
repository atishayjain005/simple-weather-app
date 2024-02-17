import React, { useState, useEffect } from "react";
import axios from "axios";

import Clear from "../assets/clear.png";
import Cloud from "../assets/cloud.png";
import Drizzle from "../assets/drizzle.png";
import Humidity from "../assets/humidity.png";
import Rain from "../assets/rain.png";
import Search from "../assets/search.png";
import Wind from "../assets/wind.png";
import Thermometer from "../assets/thermometer.png";
import Sunset from "../assets/sunset.png";
import Sunrise from "../assets/sunrise.png";
import TempLow from "../assets/temp_low.png";
import TempHigh from "../assets/temp_high.png";

export default function WeatherComp() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("London");
  const [toggle, setToggle] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [weatherImg, setWeatherImg] = useState(Cloud);

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${
    import.meta.env.VITE_OPENWEATHER_API_KEY
  }`;

  const handleChange = (e) => {
    setLocation(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(url);
      setData(response.data);

      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error fetching weather data: ", error);
    }
  };

  const handleToggle = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    handleSearch();
  }, []);

  useEffect(() => {
    if (data.weather) {
      switch (data?.weather[0]?.main) {
        case "Clear":
          setWeatherImg(Clear);
          break;
        case "Rain":
          setWeatherImg(Rain);
          break;
        case "Drizzle":
          setWeatherImg(Drizzle);
          break;
        case "Clouds":
          setWeatherImg(Cloud);
          break;
        default:
          setWeatherImg(Clear);
          break;
      }
      setIsLoading(false);
    }
  }, [data]);

  //Date format
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = new Date(data.dt * 1000 + data.timezone * 1000);
  const sunriseTime = new Date(
    data?.sys?.sunrise * 1000 + data.timezone * 1000
  );
  const sunsetTime = new Date(data?.sys?.sunset * 1000 + data.timezone * 1000);
  const formattedDate = date.toLocaleDateString("en-US", dateOptions);

  console.log(data);

  return (
    <div className="container mx-auto p-4 text-white min-h-screen flex justify-center items-center">
      {!isLoading ? (
        <div className="grid grid-cols-1  lg:grid-cols-2 bg-blue-950 p-6 md:p-10 lg:p-12 rounded-[24px] w-full lg:w-5/6 shadow-2xl gap-6">
          <div className="order-2 lg:order-1 text-center lg:text-start">
            <h1 className="text-5xl font-semibold">{data?.name}</h1>
            <p className="py-2 px-1 text-sm">{formattedDate}</p>
          </div>
          <div className="flex order-1 lg:order-2  h-12">
            <input
              className="bg-white/10 w-full  rounded-l-lg focus-visible:outline-none focus-visible:bg-white/5 p-3"
              type="text"
              placeholder="Enter city name"
              onChange={handleChange}
              onKeyDownCapture={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              className="bg-white/10 text-blue-950 rounded-r-lg hover:opacity-70  p-3"
              onClick={handleSearch}
            >
              <img src={Search} alt="" />
            </button>
          </div>
          <div className="order-3 flex items-center lg:justify-start justify-center gap-4">
            <h1 className="text-8xl">
              {toggle === true
                ? Math.floor(data?.main?.temp - 273.15)
                : Math.floor(data?.main?.temp - 459.67)}
            </h1>
            <div className="font-semibold flex flex-col gap-3 ">
              <p className="text-2xl cursor-pointer">
                <span
                  className={`${
                    toggle ? "text-white" : "text-white/50"
                  } cursor-pointer`}
                  onClick={handleToggle}
                >
                  °C
                </span>{" "}
                |{" "}
                <span
                  onClick={handleToggle}
                  className={`${
                    !toggle ? "text-white" : "text-white/50"
                  } cursor-pointer`}
                >
                  °F
                </span>
              </p>
              <p>
                {data.weather[0].description.charAt(0).toLocaleUpperCase() +
                  data.weather[0].description.slice(1)}
              </p>
            </div>
          </div>
          <div className="order-4 flex flex-col lg:flex-row gap-8 items-center justify-end ">
            <img src={weatherImg} alt="cloudy" className="max-w-[200px]" />
            <div className="flex lg:flex-col gap-6 lg:gap-4 justify-between">
              <p className="flex flex-col lg:flex-row gap-2 items-center text-xs md:text-sm">
                <img
                  className="w-[20px] h-[20px] justify-self-end"
                  src={Humidity}
                  alt=""
                />
                Feels like&nbsp;
                <span className="font-semibold">
                  {toggle === true
                    ? Math.floor(data?.main?.feels_like - 273.15)
                    : Math.floor(data?.main?.feels_like - 459.67)}
                  °
                </span>
              </p>
              <p className="flex flex-col lg:flex-row gap-2 items-center text-xs md:text-sm">
                <img
                  className="w-[20px] h-[20px] justify-self-end"
                  src={Thermometer}
                  alt=""
                />
                Humidity&nbsp;
                <span className="font-semibold">{data?.main?.humidity}</span>
              </p>
              <p className="flex flex-col lg:flex-row gap-2 items-center text-xs md:text-sm">
                <img
                  className="w-[20px] h-[20px] justify-self-end"
                  src={Wind}
                  alt=""
                />
                Wind speed&nbsp;
                <span className="font-semibold">{data?.wind?.speed}</span>
              </p>
            </div>
          </div>
          <div className="order-5 lg:col-span-2 md:flex grid grid-cols-2 gap-2 justify-between lg:justify-around text-[10px] md:text-sm font-semibold bg-white/10 mt-5 rounded-[24px] p-6">
            <div className="flex items-center justify-center w-fit">
              <img
                className="w-[30px]  md:w-[40px] lg:w-[60px] m-2 "
                src={Sunrise}
                alt=""
              />
              <div className="p-2">
                <h4 className="row-span-1 order-2">Sunrise</h4>
                <p className="row-span-1 order-3">
                  {sunriseTime.toLocaleTimeString("it-IT")}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center w-fit">
              <img
                className="w-[30px]  md:w-[40px] lg:w-[60px] m-2 "
                src={Sunset}
                alt=""
              />
              <div className="p-2">
                <h4>Sunset</h4>
                <p>{sunsetTime.toLocaleTimeString("it-IT")}</p>
              </div>
            </div>
            <div className="flex items-center justify-center w-fit">
              <img
                className="w-[30px]  md:w-[40px] lg:w-[60px] m-2 "
                src={TempHigh}
                alt=""
              />
              <div className="p-2">
                <h4>Max-temp.</h4>
                <p>
                  {toggle === true
                    ? Math.floor(data?.main?.temp_max - 273.15)
                    : Math.floor(data?.main?.temp_max - 459.67)}
                  °
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center w-fit">
              <img
                className="w-[30px]  md:w-[40px] lg:w-[60px] m-2 "
                src={TempLow}
                alt=""
              />
              <div className="p-2">
                <h4>Min-temp.</h4>
                <p>
                  {toggle === true
                    ? Math.floor(data?.main?.temp_min - 273.15)
                    : Math.floor(data?.main?.temp_min - 459.67)}
                  °
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
}
