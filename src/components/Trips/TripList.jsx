import React from 'react'
import './TripList.css'
import { useTrips } from '../../context/TripContext'
import { Link } from 'react-router-dom'


export default function TripList() {
  const { trips } = useTrips()
 
  return (
  <div className='trip-list'>
    <div className="trip-list-container">
      <h2 className='list-title'>Your Trips</h2>
      <div className="trip-grid">
        {trips.map(trip => (
          <Link key={trip.id} to={`/trip/${trip.id}`} className="trip-card">
            <h3>{trip.name}</h3>
            <p>Location: <strong>{trip.location}</strong></p>
            <p>Country Currency: {trip.country_currency}</p>
          </Link>
        ))}
      </div>
    </div>
  </div>
  )
}
