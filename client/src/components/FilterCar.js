import React, { useContext, useState, useRef, useEffect } from 'react';
import { RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri';
import { CityList, VehicleList } from '../Datas';
import { CityContext } from '../components/CityContext';
import { useNavigate } from 'react-router-dom';
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/theme/default.css";
import "react-date-range/dist/styles.css";
import "../css/filtercar.css"
import { format } from "date-fns";

const FilterCar = () => {
  const { selectedCity, setSelectedCity, selectedVehicle, setSelectedVehicle,addrentedVehicle } = useContext(CityContext);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isVehicleOpen, setIsVehicleOpen] = useState(false);
  const [date, setDate] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection"
  });
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [app, setApp] = useState("");
  const navigate = useNavigate();

  const cityRef = useRef();
  const vehicleRef = useRef();
  const CalendarRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (!cityRef.current.contains(e.target)) {
        setIsCityOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!vehicleRef.current.contains(e.target)) {
        setIsVehicleOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!CalendarRef.current.contains(e.target)) {
        setIsDateOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const handleCity = (city) => {
    setSelectedCity(city);
    setIsCityOpen(false);
  };

  const handleVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsVehicleOpen(false);
  };

  const handleChange = (ranges) => {
    setDate(ranges.selection);
  };

  const dateToggle = () => {
    setIsDateOpen(!isDateOpen);
  };

  const handleApp = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (selectedCity === '-None-' || selectedVehicle === '-None-') {
      setApp('Please select any city or vehicle to make the reservation.');
      setTimeout(() => {
        setApp("");
      }, 4000);
      return;
    }

    addrentedVehicle({
      city:selectedCity,
      vehicle:selectedVehicle,
      sDate:date.startDate.toISOString().split("T")[0],
      eDate:date.endDate.toISOString().split("T")[0]
    })

    setApp(true);
    setTimeout(() => {
      setApp("");
    }, 2000);
    console.log(selectedCity);
    console.log(selectedVehicle);
    console.log(date);
  };

  return (
    <form onSubmit={handleApp}>
      {app && (
        <div className={`message ${app === true ? "success" : "error"} ${app ? "active" : ""}`}>
          {app === true
            ? "You have sent the rental request. Please wait for approval."
            : app}
        </div>
      )}
      <div className="filter-car">
        <div className='two-dropdowns'>
          <div className="dropdown">
            <div className="dropdown-btn" onClick={() => setIsCityOpen(!isCityOpen)}>
              <div className="selection">
                <div className="daysp">Select your city</div>
                <div className="days">{selectedCity === '-None-' ? '-None-' : selectedCity}</div>
              </div>
              {isCityOpen ? <RiArrowDownSLine className="mappinline2" /> : <RiArrowUpSLine className="mappinline2" />}
            </div>
            <div className={`dropdown-menu ${isCityOpen ? 'open' : ''}`} ref={cityRef}>
              {CityList.map((city, index) => (
                <div key={index} className="dropdown--li city-item" onClick={() => handleCity(city)}>
                  {city}
                </div>
              ))}
            </div>
          </div>
          <div className="dropdown1">
            <div className="dropdown-btn" onClick={() => setIsVehicleOpen(!isVehicleOpen)}>
              <div className="selection">
                <div className="daysp">Select your Vehicle</div>
                <div className="days">{selectedVehicle === '-None-' ? '-None-' : selectedVehicle}</div>
              </div>
              {isVehicleOpen ? <RiArrowDownSLine className="mappinline2" /> : <RiArrowUpSLine className="mappinline2" />}
            </div>
            <div className={`dropdown-menu ${isVehicleOpen ? 'open' : ''}`} ref={vehicleRef}>
              {VehicleList.map((vehicle, index) => (
                <div key={index} className="dropdown--li vehicle-item" onClick={() => handleVehicle(vehicle)}>
                  {vehicle}
                </div>
              ))}
            </div>
          </div>
          <div className='calendar' ref={CalendarRef}>
            <p>Select Date <span className='span-1' onClick={dateToggle}>
              {`${format(date.startDate, "ddMMM,yyyy")} to ${format(date.endDate, "ddMMM,yyyy")} `}
            </span> </p>
            {isDateOpen && <DateRangePicker onChange={handleChange} ranges={[date]} className='main-calendar' minDate={new Date()}></DateRangePicker>}
          </div>
        </div>
      </div>
      <button type='submit' className='rent-button' style={{marginTop:"10rem"}}>Rent Now</button>
    </form>
  );
};

export default FilterCar;