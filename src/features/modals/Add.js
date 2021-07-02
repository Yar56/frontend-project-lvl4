import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  Modal, FormGroup, FormControl, Button, Form,
} from 'react-bootstrap';

import { useFormik } from 'formik';
import useSocket from '../../hooks/useSocket/index.js';
import { setActiveChannel, addChannel } from '../channels/channelsSlice.js';
import withTimeout from '../../utils/withTimeout.js';

const Add = (props) => {
  const inputRef = useRef();
  const [isDisabled, setIsDisabled] = useState(false);
  const socket = useSocket();
  const dispatch = useDispatch();

  const {
    isOpened, onHide, allChannels, validateChannelName,
  } = props;
  const validate = validateChannelName(allChannels);

  const f = useFormik({
    initialValues: { body: '' },
    validationSchema: validate,
    onSubmit: ({ body }) => {
      setIsDisabled(true);
      socket.volatile.emit('newChannel', { name: body }, withTimeout((response) => {
        // console.log(response);
        const { data } = response;
        dispatch(setActiveChannel({ id: data.id }));

        setTimeout(() => {
          onHide();
        }, 200);

        dispatch(addChannel(data));
      }, () => {
        setIsDisabled(false);
        inputRef.current.select();
        console.log('timeout!');
      }, 2000));
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Modal dialogAs={Modal.Dialog} show={isOpened} centered onHide={onHide}>
      <Modal.Header>
        <Modal.Title>Add</Modal.Title>
        <button onClick={onHide} aria-label="Close" data-bs-dismiss="modal" type="button" className="btn btn-close" />
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={f.handleSubmit}>
          <FormGroup>
            <FormControl
              required
              ref={inputRef}
              onChange={f.handleChange}
              value={f.values.body}
              data-testid="input-body"
              name="body"
              className="mb-2"
              isInvalid={!!f.errors.body}
              disabled={isDisabled}
            />
            <Form.Control.Feedback type="invalid">{f.errors.body}</Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <Button onClick={onHide} type="button" variant="secondary" className="me-2">Отменить</Button>
              <Button type="submit" variant="primary">Отправить</Button>
            </div>
          </FormGroup>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;