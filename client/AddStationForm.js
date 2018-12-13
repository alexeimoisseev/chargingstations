import React, { Component } from 'react';

import formatCompanyName from './formatCompanyName';

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

export default AddStationForm;
