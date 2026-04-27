import React from 'react'

const CheckoutSteps = ({ step }) => {
  const steps = [
    { num: 1, label: 'Sign In' },
    { num: 2, label: 'Shipping' },
    { num: 3, label: 'Payment' },
    { num: 4, label: 'Place Order' },
  ]
  return (
    <div className="checkout-steps">
      {steps.map((s, i) => (
        <React.Fragment key={s.num}>
          <div className={`step ${step >= s.num ? (step === s.num ? 'active' : 'done') : ''}`}>
            <div className="step-num">{step > s.num ? '✓' : s.num}</div>
            {s.label}
          </div>
          {i < steps.length - 1 && <span className="step-arrow">›</span>}
        </React.Fragment>
      ))}
    </div>
  )
}

export default CheckoutSteps