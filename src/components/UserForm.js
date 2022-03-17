import React, { useReducer } from 'react';
import { Card, Container } from 'react-bootstrap';
import Swal from 'sweetalert2';

const reducer = (state, action) => {
  // console.log({ ...state, [action.type]: action.payload });

  if (action.type === 'reset') {
    return initialState;
  }

  return {
    ...state,
    [action.type]: action.payload
  };
}

const initialState = {
  firstName: {
    value: '',
    error: null
  },
  lastName: {
    value: '',
    error: null
  },
  email: {
    value: '',
    error: null
  },
}

const UserForm = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    let isValid = false;

    if(type === 'email') {
      if (value.match(/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/)) {
        isValid = true;
      }
    }

    if (type === 'text') {
      if (value.length > 0) {
        isValid = true;
      }
    }

    dispatch({
      type: name,
      payload: {
        value: value,
        error: {
          result: isValid ? 'is-valid' : 'is-invalid',
          message: isValid ? 'Looks good!' : `Please provide a valid ${name}`
        }
      }
    })
  }

  const clearForm = () => {
    dispatch({ type: 'reset'});
  }

  const formIsValid = (e) => {
    const inputs = Array.from(e.target.children)
    .map(item => Array.from(item.children)
    .filter(item => item.localName === 'input'))
    .filter(item => item.length > 0)
    .flat();

    const emptyInputs = inputs.filter(item => item.value.length === 0);
    const invalidInputs = inputs.filter(item => item.classList.contains('is-invalid'));

    if (emptyInputs.length > 0 || invalidInputs.length > 0) {
      return false;
    }

    return true;
  }

  const createUser = (e) => {
    e.preventDefault();

    if (formIsValid(e)) {
      Swal.fire({
        title: 'Success!',
        text: 'User created',
        icon: 'success',
        confirmButtonText: 'Cool'
      });
      clearForm();
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'All fields are required and must be valid',
        icon: 'error',
        confirmButtonText: 'I understand'
      });
    }
  }

  return (
    <Container className="p-3">
      <Card>
        <Card.Body>
        <form className="row" onSubmit = { createUser }>
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input type="text" value={state.firstName.value} onChange={handleChange} name="firstName" className={`form-control ${state.firstName.error?.result}`} />
            {
              state.firstName.error !== null && (<p className={`${state.firstName.error?.result === 'is-valid' ? 'valid-feedback' : 'invalid-feedback' }`}>{state.firstName.error?.message}</p>)
            }
          </div>
          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input type="text" value={state.lastName.value} onChange={handleChange} name="lastName" className={`form-control ${state.lastName.error?.result}`} />
            {
              state.lastName.error !== null && (<p className={`${state.lastName.error?.result === 'is-valid' ? 'valid-feedback' : 'invalid-feedback' }`}>{state.lastName.error?.message}</p>)
            }
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" value={state.email.value} onChange={handleChange} name="email" className={`form-control ${state.email.error?.result}`} />
            {
              state.email.error !== null && (<p className={`${state.email.error?.result === 'is-valid' ? 'valid-feedback' : 'invalid-feedback' }`}>{state.email.error?.message}</p>)
            }
          </div>
          <div className="mb-3">
            <button type="submit" className="btn btn-primary">Submit</button>
          </div>
        </form>
        </Card.Body>
      </Card>

      <div className="pt-5">
        {JSON.stringify(state)}
      </div>
    </Container>
  )
}

export default UserForm;