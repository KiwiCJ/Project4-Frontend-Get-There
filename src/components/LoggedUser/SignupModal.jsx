import { Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { useRef } from "react";


export default function Signup({ show, onClose }) {
    const userRef = useRef()
    const emailRef = useRef()
    const pwdRef = useRef()

      async function handleSubmit(e) {
        e.preventDefault();
        const user = {
          username: userRef.current.value,
          email: emailRef.current.value,
          password: pwdRef.current.value,
        }
      
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/signup/`,
          user,
          {
            headers: { "Content-Type": "application/json" },
          },
          {
            withCredentials: true,
          }
        )
        window.location.href = "/login"
      }

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" ref={userRef} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" ref={emailRef} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" ref={pwdRef} required />
          </Form.Group>
          <div className="mt-2">
            <Button type="submit" variant="primary">
              Login
            </Button>
          </div>
      </Form>
    </Modal.Body>
    </Modal>
  )
}
