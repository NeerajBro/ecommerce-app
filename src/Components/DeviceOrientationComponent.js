// DeviceOrientationComponent.js
import React, { useEffect, useState } from 'react';

const DeviceOrientationComponent = () => {
  const [alpha, setAlpha] = useState(null);
  const [beta, setBeta] = useState(null);
  const [gamma, setGamma] = useState(null);
  const [orientation, setOrientation] = useState('');
  const [permissionRequested, setPermissionRequested] = useState(false);

  const handleOrientation = (e) => {
    setAlpha(e.alpha?.toFixed(1));
    setBeta(e.beta?.toFixed(1));
    setGamma(e.gamma?.toFixed(1));
    const currentOrientation =
      Math.abs(e.beta) > Math.abs(e.gamma) ? 'portrait' : 'landscape';
    setOrientation(currentOrientation);
  };

  const getOrientation = async () => {
    if (
      !window.DeviceOrientationEvent ||
      !window.DeviceOrientationEvent.requestPermission
    ) {
      alert('Your current device does not have access to the DeviceOrientation event');
      return;
    }

    try {
      const permission = await window.DeviceOrientationEvent.requestPermission();
      if (permission !== 'granted') {
        alert("You must grant access to the device's sensor for this demo");
        return;
      }
      setPermissionRequested(true);
      window.addEventListener('deviceorientation', handleOrientation);
    } catch (err) {
      alert('Error requesting permission: ' + err.message);
    }
  };

  useEffect(() => {
    // For devices that don't require permission (non-iOS)
    if (
      window.DeviceOrientationEvent &&
      typeof window.DeviceOrientationEvent.requestPermission !== 'function'
    ) {
      window.addEventListener('deviceorientation', handleOrientation);
      setPermissionRequested(true);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      {!permissionRequested && (
        <button id="get-orientation" onClick={getOrientation}>
          Request Orientation Access
        </button>
      )}
      {permissionRequested && (
        <>
          <h2>Device Orientation</h2>
          <p><strong>Alpha (Z-axis):</strong> {alpha ?? '--'}°</p>
          <p><strong>Beta (X-axis):</strong> {beta ?? '--'}°</p>
          <p><strong>Gamma (Y-axis):</strong> {gamma ?? '--'}°</p>
          <p><strong>Orientation:</strong> {orientation}</p>
        </>
      )}
    </div>
  );
};

export default DeviceOrientationComponent;
