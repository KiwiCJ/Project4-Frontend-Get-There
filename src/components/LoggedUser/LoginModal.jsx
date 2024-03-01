import { Button, Form, Modal } from 'react-bootstrap'
import React, { useRef } from 'react'
import axios from 'axios'

export default function LoginModal({ show, onClose }) {
  const userRef = useRef()
  const pwdRef = useRef()


  const handleSubmit = async (e) => {
    e.preventDefault()
    const user = {
      username: userRef.current.value,
      password: pwdRef.current.value
    }

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/token/`, user, {
        headers: { 'Content-type': 'application/json' }
      },
      {
        withCredentiasl: true
      })
      localStorage.clear()
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      axios.defaults.headers.common['Authorization'] = `Bearer ${data['access']}`
      window.location.href = '/'
    } catch (error) {
      console.error('Error logging in:', error)
    }
  }

  return (
    <Modal show={show} onHide={onClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton >
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label> Username </Form.Label>
            <Form.Control 
              type="username" 
              name="username" 
              placeholder="Username" 
              ref={userRef}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label> Password </Form.Label>
            <Form.Control 
              type="password" 
              name="password" 
              placeholder="Password" 
              ref={pwdRef}
              required
            />
          </Form.Group>
          <Button variant="outline-dark" type="submit">Login</Button>
        </Modal.Body>
      </Form>
    </Modal>
  )
}


