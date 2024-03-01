import React, { useState, useEffect, useRef } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useTrips } from '../../context/TripContext'
import { useNavigate } from 'react-router-dom'
import Freecurrencyapi from '@everapi/freecurrencyapi-js'

const freecurrencyapi = new Freecurrencyapi(process.env.REACT_APP_API_KEY)

const currencyNames = {
    EUR: 'Euro',
    USD: 'US Dollar',
    JPY: 'Japanese Yen',
    BGN: 'Bulgarian Lev',
    CZK: 'Czech Republic Koruna',
    DKK: 'Danish Krone',
    GBP: 'British Pound Sterling',
    HUF: 'Hungarian Forint',
    PLN: 'Polish Zloty',
    RON: 'Romanian Leu',
    SEK: 'Swedish Krona',
    CHF: 'Swiss Franc',
    ISK: 'Icelandic Króna',
    NOK: 'Norwegian Krone',
    HRK: 'Croatian Kuna',
    RUB: 'Russian Ruble',
    TRY: 'Turkish Lira',
    AUD: 'Australian Dollar',
    BRL: 'Brazilian Real',
    CAD: 'Canadian Dollar',
    CNY: 'Chinese Yuan',
    HKD: 'Hong Kong Dollar',
    IDR: 'Indonesian Rupiah',
    ILS: 'Israeli New Sheqel',
    INR: 'Indian Rupee',
    KRW: 'South Korean Won',
    MXN: 'Mexican Peso',
    MYR: 'Malaysian Ringgit',
    NZD: 'New Zealand Dollar',
    PHP: 'Philippine Peso',
    SGD: 'Singapore Dollar',
    THB: 'Thai Baht',
    ZAR: 'South African Rand'
  };


export default function EditTripModal({ show, onClose, trip }) {
    const navigate = useNavigate()
    const { editTrip, deleteTrip } = useTrips()
    const [formData, setFormData] = useState({
      name: '',
      location: '',
      notes: '',
      user_currency: '',
      country_currency: '',
      amount_saved: '',
      amount_needed: ''
    })
    // const [exchangeRates, setExchangeRates] = useState(null)
    const setExchangeRates = useRef()
  
    useEffect(() => {
      if (trip) {
        setFormData({
          name: trip.name,
          location: trip.location,
          notes: trip.notes,
          user_currency: trip.user_currency,
          country_currency: trip.country_currency,
          amount_saved: trip.amount_saved,
          amount_needed: trip.amount_needed
        })
      }
      // eslint-disable-next-line
    }, [trip])
  
    useEffect(() => {
      if (trip) {
        const fetchExchangeRates = async () => {
          try {
            const response = await freecurrencyapi.latest({
              apikey: process.env.REACT_APP_API_KEY,
              base_currency: trip.user_currency,
              currencies: trip.country_currency
            });
            setExchangeRates(response.data)
          } catch (error) {
            console.error('Error fetching exchange rates:', error)
          }
        }
        fetchExchangeRates()
      }
      // eslint-disable-next-line
    }, [trip])
  
    const handleEdit = () => {
      const updatedTrip = {
        id: trip.id,
        name: formData.name,
        location: formData.location,
        notes: formData.notes,
        user_currency: formData.user_currency,
        country_currency: formData.country_currency,
        amount_saved: parseFloat(formData.amount_saved),
        amount_needed: parseFloat(formData.amount_needed)
      };
      editTrip(updatedTrip);
      onClose()
    }

    const handleDelete = () => {
      deleteTrip(trip.id)
      onClose()
      navigate(`/trips`)
    }

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }))
    }

    return (
        <Modal show={show} onHide={onClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Trip</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
              <Form.Group controlId="formName">
                <Form.Label><strong>Name *</strong></Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formLocation">
                <Form.Label><strong>Location *</strong></Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formNotes">
                <Form.Label><strong>Notes</strong></Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formUserCurrency">
                <Form.Label><strong>Your Saved Currency *</strong></Form.Label>
                <select className="form-control" name="user_currency" value={formData.user_currency} onChange={handleChange} required>
                  {Object.entries(currencyNames).map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
              </Form.Group>
              <Form.Group controlId="formCountryCurrency">
                <Form.Label><strong>Visiting Country Currency *</strong></Form.Label>
                <select className="form-control" name="country_currency" value={formData.country_currency} onChange={handleChange} required>
                  {Object.entries(currencyNames).map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
              </Form.Group>
              <Form.Group controlId="formAmountSaved">
                <Form.Label><strong>Amount Saved</strong></Form.Label>
                <Form.Control
                  type="number"
                  name="amount_saved"
                  value={formData.amount_saved}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formAmountNeeded">
                <Form.Label><strong>Amount Needed *</strong></Form.Label>
                <Form.Control
                  type="number"
                  name="amount_needed"
                  value={formData.amount_needed}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Button variant="danger" onClick={handleDelete}>Delete Trip</Button>
              <Button variant="primary" type="submit">Save Trip</Button>
            </Form>
          </Modal.Body>
        </Modal>
      );
    }
    