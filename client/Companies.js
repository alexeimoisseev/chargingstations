import React from 'react';

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

export default Companies;
