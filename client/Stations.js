import React from 'react';

const Stations = ({ stations, selectedCompanyName }) => (
  <div className="Stations">
    <h2 className="Stations__selectedCompany">
      {selectedCompanyName}
    </h2>
    <ul className="Stations__list">
      {stations.map(station => (
        <li className="Stations__station" key={station.id}>
          {station.name}
        </li>
      ))}
    </ul>
  </div>
);

export default Stations;
