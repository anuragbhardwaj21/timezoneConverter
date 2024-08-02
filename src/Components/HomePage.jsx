import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import "./HomePage.css";

const HomePage = () => {
  const [timeZones, setTimeZones] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedZones, setSelectedZones] = useState(["UTC"]);

  useEffect(() => {
    const timeZones = moment.tz.names();
    setTimeZones(timeZones);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const [globalAdjustment, setGlobalAdjustment] = useState(0);

  const handleDeleteZone = (zone) => {
    setSelectedZones(selectedZones.filter((z) => z !== zone));
  };
  const [currentTimes, setCurrentTimes] = useState({});

  const handleAddZone = (zone) => {
    if (zone && !selectedZones.includes(zone)) {
      setSelectedZones([...selectedZones, zone]);
      setCurrentTimes((prevTimes) => ({
        ...prevTimes,
        [zone]: getCurrentTimeSliderValue(zone),
      }));
      setSearchTerm("")
    }
  };
  const handleSliderChange = (zone, newValue) => {
    setCurrentTimes((prevTimes) => ({
      ...prevTimes,
      [zone]: newValue,
    }));
  };

  const getCurrentTimeSliderValue = (zone) => {
    const currentTime = moment.tz(zone);
    const hours = currentTime.hours();
    const minutes = currentTime.minutes();
    return hours + minutes / 60;
  };

  const valuetext = (value) => {
    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 60);
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
  };

  const marks = [
    { value: 0, label: "12AM" },
    { value: 3, label: "3AM" },
    { value: 6, label: "6AM" },
    { value: 9, label: "9AM" },
    { value: 12, label: "12PM" },
    { value: 15, label: "3PM" },
    { value: 18, label: "6PM" },
    { value: 21, label: "9PM" },
    { value: 24, label: "12AM" },
  ];

  const filteredTimeZones = timeZones.filter((zone) =>
    zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Time Zone Converter</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a time zone..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button onClick={() => handleAddZone(searchTerm)}><ion-icon name="add-circle"></ion-icon></button>
      </div>
      <div className="search-results" style={{ opacity: searchTerm ? 1 : 0 }}>
        <ul>
          {searchTerm
            ? filteredTimeZones.slice(0, 5).map((zone) => {
                const zoneName = zone.split("/")[1]
                  ? zone.split("/")[1].replace("_", " ")
                  : zone.replace("_", " ");
                return (
                  <li key={zone} onClick={() => handleAddZone(zone)}>
                    {zoneName}
                  </li>
                );
              })
            : filteredTimeZones.slice(0, 5).map((zone) => {
                const zoneName = zone.split("/")[1]
                  ? zone.split("/")[1].replace("_", " ")
                  : zone.replace("_", " ");
                return (
                  <li key={zone} onClick={() => handleAddZone(zone)}>
                    {zoneName}
                  </li>
                );
              })}
        </ul>
      </div>

      <div className="time-zones">
        {selectedZones.map((zone) => {
          const zoneName = zone.split("/")[1]
            ? zone.split("/")[1].replace("_", " ")
            : zone.replace("_", " ");
          const currentTime = moment.tz(zone);
          const sliderValue = getCurrentTimeSliderValue(zone);
          return (
            <div key={zone} className="timezonecard">
              <div className="timezonedetails">
                <div className="timezonename">{zoneName}</div>
                <div className="actualtime">
                  {moment
                    .tz(zone)
                    .startOf("day")
                    .add(currentTimes[zone] || sliderValue, "hours")
                    .format("hh:mm A")}
                </div>

                <button onClick={() => handleDeleteZone(zone)}><ion-icon name="close-outline"></ion-icon></button>
              </div>
              <div className="slider">
                <Box sx={{ width: "100%" }}>
                  <Slider
                    track={false}
                    aria-labelledby="track-false-slider"
                    value={currentTimes[zone] || sliderValue}
                    min={0}
                    max={24}
                    step={0.1}
                    marks={marks}
                    onChange={(e, newValue) =>
                      handleSliderChange(zone, newValue)
                    }
                  />
                </Box>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
