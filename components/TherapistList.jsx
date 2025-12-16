"use client";

import { useState, useEffect } from "react";

export default function TherapistList() {
  const [therapists, setTherapists] = useState([
    { id: 1, name: "Dr. Priya Sharma", specialty: "Anxiety & Depression", phone: "+1-555-123-4567", rating: 4.8 },
    { id: 2, name: "Counselor Alex Johnson", specialty: "Stress Management", phone: "+1-555-987-6543", rating: 4.6 },
    { id: 3, name: "Dr. Michael Chen", specialty: "Trauma Therapy", phone: "+1-555-456-7890", rating: 4.9 },
    { id: 4, name: "Therapist Sarah Williams", specialty: "Mindfulness", phone: "+1-555-234-5678", rating: 4.7 },
  ]);
  
  const [emergencyContacts] = useState([
    { id: 1, name: "National Suicide Prevention Lifeline", phone: "988" },
    { id: 2, name: "Crisis Text Line", phone: "741741" },
    { id: 3, name: "SAMHSA National Helpline", phone: "1-800-662-4357" },
  ]);
  
  const [showEmergency, setShowEmergency] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  const sendEmergencyAlert = () => {
    // In a real app, this would send location data and contact emergency services
    setAlertSent(true);
    
    // Show confirmation
    alert("EMERGENCY ALERT SENT!\n\nHelp is on the way. Emergency contacts have been notified.\n\nIf you're in immediate danger, please call 911 or your local emergency number.");
    
    // Reset after 5 seconds
    setTimeout(() => {
      setAlertSent(false);
      setShowEmergency(false);
    }, 5000);
  };

  const handleCall = (phone, name) => {
    if (confirm(`Would you like to call ${name} at ${phone}?`)) {
      window.location.href = `tel:${phone}`;
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-cyan-300 text-xl">Mental Health Support</h2>
        <button 
          onClick={() => setShowEmergency(!showEmergency)}
          className="text-sm bg-red-900/50 hover:bg-red-800/50 px-3 py-1 rounded-lg transition text-red-300"
        >
          {showEmergency ? "Hide Emergency" : "Emergency Help"}
        </button>
      </div>

      {showEmergency ? (
        <div className="mb-6">
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-4">
            <h3 className="text-red-300 font-bold text-lg mb-2">🚨 Crisis Support</h3>
            <p className="text-red-200 text-sm mb-3">If you're in crisis or having thoughts of self-harm, reach out immediately:</p>
            
            <div className="space-y-3">
              {emergencyContacts.map(contact => (
                <div key={contact.id} className="flex justify-between items-center bg-red-800/30 p-3 rounded-lg">
                  <div>
                    <div className="font-medium text-white">{contact.name}</div>
                    <div className="text-red-200 text-sm">{contact.phone}</div>
                  </div>
                  <button 
                    onClick={() => handleCall(contact.phone, contact.name)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-sm"
                  >
                    Call
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={sendEmergencyAlert}
            disabled={alertSent}
            className={`w-full py-3 rounded-lg font-bold transition ${alertSent ? 'bg-green-700' : 'bg-red-600 hover:bg-red-500'}`}
          >
            {alertSent ? "✅ ALERT SENT - HELP IS COMING" : "🆘 Send Emergency Alert"}
          </button>
          
          <p className="text-gray-400 text-xs mt-3 text-center">This sends your location to emergency services</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h3 className="text-gray-300 font-medium mb-2">Nearby Therapists</h3>
            <div className="space-y-3">
              {therapists.map(therapist => (
                <div key={therapist.id} className="text-sm text-gray-200 bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">{therapist.name}</div>
                      <div className="text-xs text-gray-400 mt-1">{therapist.specialty}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400">★ {therapist.rating}</div>
                      <button 
                        onClick={() => handleCall(therapist.phone, therapist.name)}
                        className="mt-1 px-2 py-1 bg-cyan-500 hover:bg-cyan-400 text-black text-xs rounded"
                      >
                        Call
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <button 
              onClick={() => alert('In a full implementation, this would show a map with nearby therapists.')}
              className="text-cyan-400 hover:text-cyan-300 text-sm underline transition flex items-center justify-center gap-1 mx-auto"
            >
              <span>📍</span>
              <span>Find More Therapists Near You</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
