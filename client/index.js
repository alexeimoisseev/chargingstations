import React, { Component } from 'react';
import { render } from 'react-dom';

const formatCompanyName = ({name, depth}) => `${'-'.repeat(depth)} ${name}`;

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

const Stations = ({ stations, selectedCompanyName }) => (
  <div className="Stations">
    <h2 className="Stations__selectedCompany">
      {selectedCompanyName} stations:
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

const Companies = ({ companies, onSelect, selected }) => (
  <div className="Companies">
    {companies.map(company => (
      <div
        style={{marginLeft: company.depth * 15}}
        className={
          `Companies__company ${selected === company.id ? 'Companies__company_selected' : ''}`
        }
        key={company.id}
        onClick={() => onSelect(company)}>
        {company.name}
      </div>
    ))}
  </div>
);

class AddCompanyForm extends Component {
  constructor() {
    super();
    this.onNameChange = this.onNameChange.bind(this);
    this.onParentChange = this.onParentChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      parent: 0,
      name: ''
    };
  }

  onNameChange(e) {
    this.setState({
      name: e.target.value,
    });
  }

  onParentChange(e) {
    this.setState({
      parent: e.target.value,
    });
  }

  onSubmit(e) {
    e.preventDefault();
    const { onSubmit } = this.props;
    const { name, parent } = this.state;
    const _name = name.trim();
    if (!_name) {
      return;
    }
    onSubmit(_name, parent || null);
    this.setState({
      name: '',
      parent: 0,
    });
  }

  render() {
    const { companies } = this.props;
    const { name, parent} = this.state;
    return (
      <div className="AddCompanyForm">
        <div>
          Add company:
        </div>
        <form onSubmit={this.onSubmit}>
          <div className="AddCompanyForm__parent">
            Parent:
            <select
              defaultValue={parent}
              onChange={this.onParentChange}
            >
              <option key={0} value={0} disabled={true}>Select copmany</option>
              {companies.map(company => <option
                key={company.id}
                value={company.id}>
                  {formatCompanyName(company)}
                </option>
              )}
            </select>
          </div>
          <div className="AddCompanyForm__name">
            Name:
            <input name="name" value={name} onChange={this.onNameChange}/>
          </div>
          <button>Create</button>
        </form>
      </div>
    );
  }
}

class AddStationForm extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onCompanyChange = this.onCompanyChange.bind(this);

    this.state = {
      name: '',
      company: props.selectedCompany,
    };
  }

  componentDidUpdate(prevProps) {
    const { selectedCompany } = this.props;
    if (prevProps.selectedCompany === selectedCompany) {
      return;
    }
    this.setState({
      company: selectedCompany,
    });
  }

  onSubmit(e) {
    e.preventDefault();
    const { name, company } = this.state;
    const { onSubmit } = this.props;
    const _name = name.trim();
    if (!_name || !company) {
      return;
    }
    onSubmit(_name, company);
    this.setState({
      name: '',
    });
  }

  onChange(e) {
    this.setState({
      name: e.target.value,
    });
  }

  onCompanyChange(e) {
    this.setState({
      company: e.target.value,
    });
  }

  render() {
    const { name, company} = this.state;

    const { companies } = this.props;
    return (
      <div className="AddStationForm">
        Add station
        <form onSubmit={this.onSubmit}>
          <div className="AddStationForm___name">
            Station name:
            <input name="name" value={name} onChange={this.onChange} />
          </div>
          <div className="AddStationForm__company">
            Company:
            <select
              value={company}
              onChange={this.onCompanyChange}
            >
              <option key={0} value={0} disabled={true}>Select copmany</option>
              {companies.map(company => <option
                key={company.id}
                value={company.id}>
                  {formatCompanyName(company)}
                </option>
              )}
            </select>
          </div>
          <button>Create</button>
        </form>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
