import { temperature, cityTime } from "../weather";
import { useState, useEffect, useRef, useCallback } from "react";
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
  const [data, setData] = useState(null);
  const [location, setLocation] = useState("London");
  const [toggle, setToggle] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [weatherImg, setWeatherImg] = useState(Cloud);
  const activeRequest = useRef(null);

  const handleSearch = useCallback(async (city) => {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    setIsLoading(false);
    setError("");
    const query = city.trim();
    if (!query) { setError("Enter a city name to search."); return; }
    const key = import.meta.env.VITE_OPENWEATHER_API_KEY;
    if (!key) { setError("Weather search is not configured. Please try again later."); return; }
    setIsLoading(true);
    try {
      const response = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
        params: { q: query, appid: key }, signal: controller.signal, timeout: 10000,
      });
      if (controller.signal.aborted) return;
      if (!response.data?.weather?.[0]?.description || !Number.isFinite(response.data?.main?.temp)) {
        throw new Error("Incomplete weather response");
      }
      setData(response.data);
    } catch (failure) {
      if (controller.signal.aborted) return;
      const status = failure.response?.status;
      setError(status === 404 ? "City not found. Check the spelling or add a country code." :
        status === 401 ? "Weather service configuration needs attention. Please try again later." :
        status === 429 ? "Weather service is busy. Wait a moment and try again." :
        "Unable to load weather. Check your connection and try again.");
    } finally {
      if (activeRequest.current === controller) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    handleSearch("London");
    return () => activeRequest.current?.abort();
  }, [handleSearch]);


  useEffect(() => {
    if (data?.weather) {
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
  const formattedDate = cityTime(data?.dt, data?.timezone, dateOptions);



  return (
    <div className="container mx-auto p-4 text-white min-h-screen flex flex-col justify-center items-center gap-4">
      <div className="w-full lg:w-5/6 bg-blue-950 rounded-2xl p-4">
        <form className="flex h-12" role="search" onSubmit={(event) => { event.preventDefault(); handleSearch(location); }}>
          <label className="sr-only" htmlFor="city-search">City name</label>
          <input id="city-search" className="bg-white/10 w-full rounded-l-lg p-3" type="text" placeholder="Enter city name"
            value={location} onChange={(event) => setLocation(event.target.value)} />
          <button type="submit" aria-label="Search weather" className="bg-white/10 rounded-r-lg p-3">
            <img src={Search} alt="" />
          </button>
        </form>
        {isLoading && <p role="status">Loading weather…</p>}
        {error && <p role="alert">{error}</p>}
        {data && (error || isLoading) && <p>Showing the previous result for {data.name}.</p>}
      </div>
      {data ? (
        <div className="grid grid-cols-1  lg:grid-cols-2 bg-blue-950 p-6 md:p-10 lg:p-12 rounded-[24px] w-full lg:w-5/6 shadow-2xl gap-6">
          <div className="order-2 lg:order-1 text-center lg:text-start">
            <h1 className="text-5xl font-semibold">{data?.name}</h1>
            <p className="py-2 px-1 text-sm">{formattedDate}</p>
          </div>
          <div className="order-3 flex items-center lg:justify-start justify-center gap-4">
            <p className="text-8xl" aria-label={`Temperature ${temperature(data?.main?.temp, toggle)} degrees ${toggle ? "Celsius" : "Fahrenheit"}`}>
              {temperature(data?.main?.temp, toggle)}
            </p>
            <div className="font-semibold flex flex-col gap-3 ">
              <div className="text-2xl flex gap-2" role="group" aria-label="Temperature unit">
                <button type="button" aria-label="Celsius" aria-pressed={toggle}
                  onClick={() => setToggle(true)} className={toggle ? "text-white" : "text-white/60"}>°C</button>
                <span aria-hidden="true">|</span>
                <button type="button" aria-label="Fahrenheit" aria-pressed={!toggle}
                  onClick={() => setToggle(false)} className={!toggle ? "text-white" : "text-white/60"}>°F</button>
              </div>
              <p>
                {data.weather[0].description.charAt(0).toLocaleUpperCase() +
                  data.weather[0].description.slice(1)}
              </p>
            </div>
          </div>
          <div className="order-4 flex flex-col lg:flex-row gap-8 items-center justify-end ">
            <img src={weatherImg} alt="" className="max-w-[200px]" />
            <div className="flex lg:flex-col gap-6 lg:gap-4 justify-between">
              <p className="flex flex-col lg:flex-row gap-2 items-center text-xs md:text-sm">
                <img
                  className="w-[20px] h-[20px] justify-self-end"
                  src={Humidity}
                  alt=""
                />
                Feels like&nbsp;
                <span className="font-semibold">
                  {temperature(data?.main?.feels_like, toggle)}
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
                <span className="font-semibold">{data?.main?.humidity}%</span>
              </p>
              <p className="flex flex-col lg:flex-row gap-2 items-center text-xs md:text-sm">
                <img
                  className="w-[20px] h-[20px] justify-self-end"
                  src={Wind}
                  alt=""
                />
                Wind speed&nbsp;
                <span className="font-semibold">{data?.wind?.speed} m/s</span>
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
                  {cityTime(data?.sys?.sunrise, data.timezone)}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center w-fit">
              <img
                className="w-[30px] md:w-[40px] lg:w-[60px] m-2 "
                src={Sunset}
                alt=""
              />
              <div className="p-2">
                <h4>Sunset</h4>
                <p>{cityTime(data?.sys?.sunset, data.timezone)}</p>
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
                  {temperature(data?.main?.temp_max, toggle)}
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
                  {temperature(data?.main?.temp_min, toggle)}
                  °
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-blue-950">Search for a city to see its current weather.</p>
      )}
    </div>
  );
}
