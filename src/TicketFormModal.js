import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';

const TicketFormModal = ({ show, handleClose, handleSave }) => {
  const [formData, setFormData] = useState({
    judul_tiket: '',
    tipe_tiket: null,
    assigned_to: null,
    description: '',
    label: null,
    project_name: null,
  });

  const tipeTiketOptions = [
    { value: 'Task', label: 'Task' },
    { value: 'Bug', label: 'Bug' },
  ];

  const assignedToOptions = [
    { value: 'Anggit', label: 'Anggit' },
    { value: 'Tri', label: 'Tri' },
    { value: 'Banu', label: 'Banu' },
  ];

  const labelOptions = [
    { value: 'To Do', label: 'To Do' },
    { value: 'Doing', label: 'Doing' },
    { value: 'Testing', label: 'Testing' },
    { value: 'Done', label: 'Done' },
  ];

  const projectNameOptions = [
    { value: 'ECare Phase 2', label: 'ECare Phase 2' },
    { value: 'ECare Phase 3', label: 'ECare Phase 3' },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSaveClick = () => {
    handleSave(formData);
    setFormData({
      judul_tiket: '',
      tipe_tiket: null,
      assigned_to: null,
      description: '',
      label: null,
      project_name: null,
    });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Ticket</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formJudulTiket">
            <Form.Label>Judul Tiket</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter judul tiket"
              value={formData.judul_tiket}
              onChange={(e) => handleInputChange('judul_tiket', e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formTipeTiket">
            <Form.Label>Tipe Tiket</Form.Label>
            <Select
              options={tipeTiketOptions}
              value={formData.tipe_tiket}
              onChange={(selectedOption) =>
                handleInputChange('tipe_tiket', selectedOption)
              }
            />
          </Form.Group>

          <Form.Group controlId="formAssignedTo">
            <Form.Label>Assigned To</Form.Label>
            <Select
              options={assignedToOptions}
              value={formData.assigned_to}
              onChange={(selectedOption) =>
                handleInputChange('assigned_to', selectedOption)
              }
            />
          </Form.Group>

          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formLabel">
            <Form.Label>Label</Form.Label>
            <Select
              options={labelOptions}
              value={formData.label}
              onChange={(selectedOption) =>
                handleInputChange('label', selectedOption)
              }
            />
          </Form.Group>

          <Form.Group controlId="formProjectName">
            <Form.Label>Project Name</Form.Label>
            <Select
              options={projectNameOptions}
              value={formData.project_name}
              onChange={(selectedOption) =>
                handleInputChange('project_name', selectedOption)
              }
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveClick}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TicketFormModal;
