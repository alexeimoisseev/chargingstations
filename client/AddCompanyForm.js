import React, { Component } from 'react';

import formatCompanyName from './formatCompanyName';

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

export default AddCompanyForm;
