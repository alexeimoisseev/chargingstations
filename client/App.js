import React, { Component } from 'react';

import Companies from './Companies';
import Stations from './Stations';
import AddCompanyForm from './AddCompanyForm';
import AddStationForm from './AddStationForm';

class App extends Component {
  constructor() {
    super();
    this.onCompanySelect = this.onCompanySelect.bind(this);
    this.onAddCompany = this.onAddCompany.bind(this);
    this.onAddStation = this.onAddStation.bind(this);
    this.fetchStations = this.fetchStations.bind(this);

    this.state = {
      companies: [],
      selectedCompanyName: null,
      selectedCompany: 0,
      stations: [],
    };
  }

  async fetchCompanies() {
    const companies = await fetch('/api/companies').then(r => r.json());
    this.setState({ companies });
  }

  async fetchStations() {
    const { selectedCompany } = this.state;
    const stations = await fetch(`/api/companies/${selectedCompany}`)
      .then(r => r.json());
    this.setState({
      stations,
    });
  }

  async componentDidMount() {
    await this.fetchCompanies();
  }

  async onCompanySelect({ id, name }) {
    this.setState({
      stations: [],
      selectedCompanyName: name,
      selectedCompany: id,
    }, this.fetchStations);
  }

  async onAddCompany(name, parent) {
    await fetch('/api/companies', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        name,
        parent,
      })
    });
    await this.fetchCompanies();
  }

  async onAddStation(name, company) {
    await fetch(`/api/companies/${company}`, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        name,
        company,
      })
    });
    await this.fetchStations();
  }

  render() {
    const {
      companies,
      selectedCompany,
      selectedCompanyName,
      stations,
    } = this.state;
    return (
      <div className="App">
        <div className="App__companies">
          <Companies
            companies={companies}
            selected={selectedCompany}
            onSelect={this.onCompanySelect} />
          <AddCompanyForm
            companies={companies}
            onSubmit={this.onAddCompany}
             />
        </div>
        <div className="App__stations">
          <Stations
            stations={stations}
            selectedCompanyName={selectedCompanyName} />
          {selectedCompany ? <AddStationForm
            companies={companies}
            selectedCompany={selectedCompany}
            onSubmit={this.onAddStation} /> : null}
        </div>
      </div>
    );
  }
}

export default App;
