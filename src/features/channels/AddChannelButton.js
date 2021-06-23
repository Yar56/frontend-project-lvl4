import React from 'react';
import { PlusSquare } from 'react-bootstrap-icons';

const AddChannelButton = () => (
  <div className="d-flex justify-content-between mb-2 px-4">
    <span>Каналы</span>
    <button type="button" className="p-0 text-primary btn btn-group-vertical">
      <PlusSquare size={20} />
      <span className="visually-hidden">+</span>
    </button>
  </div>
);

export default AddChannelButton;
