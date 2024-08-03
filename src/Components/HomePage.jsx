import React, { useState, useEffect, useRef } from "react";
import moment from "moment-timezone";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import "./HomePage.css";

const HomePage = () => {
  document.title = "Time Zone Converter";
  const [timeZones, setTimeZones] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedZones, setSelectedZones] = useState(["UTC"]);
  const [currentTimes, setCurrentTimes] = useState({});
  const [draggedIndex, setDraggedIndex] = useState(null);
  const dragStartElement = useRef(null);

  useEffect(() => {
    const timeZones = moment.tz.names();
    setTimeZones(timeZones);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteZone = (zone) => {
    setSelectedZones(selectedZones.filter((z) => z !== zone));
  };

  const handleAddZone = (zone) => {
    if (zone && !selectedZones.includes(zone)) {
      setSelectedZones([...selectedZones, zone]);
      setCurrentTimes((prevTimes) => ({
        ...prevTimes,
        [zone]: getCurrentTimeSliderValue(zone),
      }));
      setSearchTerm("");
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

  const filteredTimeZones = timeZones.filter((zone) => {
    const lowerCaseZone = zone.toLowerCase();
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      lowerCaseZone.includes(lowerCaseSearchTerm) ||
      moment.tz(lowerCaseZone).format("z").toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  const handleDragStart = (index, event) => {
    dragStartElement.current = event.target;
    setDraggedIndex(index);
  };

  const handleDragOver = (index, event) => {
    event.preventDefault();

    if (draggedIndex === index) {
      return;
    }

    const items = selectedZones.filter((item, idx) => idx !== draggedIndex);
    items.splice(index, 0, selectedZones[draggedIndex]);

    setSelectedZones(items);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const formatZoneName = (zone) => {
    const parts = zone.split("/");
    if (parts.length > 1) {
      // Format for regions like "Europe/London"
      return parts[1].replace("_", " ");
    } else {
      // Fallback for direct abbreviations or unknown formats
      return zone.replace("_", " ");
    }
  };

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
        <button onClick={() => handleAddZone(searchTerm)}>
          <ion-icon name="add-circle"></ion-icon>
        </button>
      </div>
      <div className="search-results" style={{ opacity: searchTerm ? 1 : 0 }}>
        <ul>
          {searchTerm &&
            filteredTimeZones.slice(0, 5).map((zone) => {
              const zoneName = formatZoneName(zone);
              return (
                <li key={zone} onClick={() => handleAddZone(zone)}>
                  {zoneName}
                </li>
              );
            })}
        </ul>
      </div>
      <div className="time-zones">
        {selectedZones.map((zone, index) => {
          const zoneName = formatZoneName(zone);
          const sliderValue = getCurrentTimeSliderValue(zone);
          return (
            <div
              key={zone}
              className={`timezonecard ${
                draggedIndex === index ? "dragging" : ""
              }`}
              draggable
              onDragStart={(e) => handleDragStart(index, e)}
              onDragOver={(e) => handleDragOver(index, e)}
              onDragEnd={handleDragEnd}
            >
              <div className="dragdiv">
                <ion-icon name="menu-outline"></ion-icon>
              </div>
              <div className="detailsdiv">
                <div className="timezonedetails">
                  <div className="timezonename">{zoneName}</div>
                  <div className="actualtime">
                    {moment
                      .tz(zone)
                      .startOf("day")
                      .add(currentTimes[zone] || sliderValue, "hours")
                      .format("hh:mm A")}
                  </div>

                  <button onClick={() => handleDeleteZone(zone)}>
                    <ion-icon name="close-outline"></ion-icon>
                  </button>
                </div>
                <div className="slider">
                  <Box sx={{ width: "100%" }}>
                    <Slider
                      track={false}
                      aria-labelledby="track-false-slider"
                      value={currentTimes[zone] || sliderValue}
                      min={0}
                      max={24}
                      step={0.25}
                      marks={marks}
                      onChange={(e, newValue) =>
                        handleSliderChange(zone, newValue)
                      }
                    />
                  </Box>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
