// Dependencies
// Config
import env from "../env";
import PaymentActions from "../rdx-actions/payment.action";

export const getPaymentInfo = async (authState, dispatch) => {
  return fetch(`${env.API_URL}/payments/info`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${authState.userToken}`
    },
  }).then(async (res) => {
    if (!res.ok) {
      throw new Error((await res.json()).message)
    }
    const data = await res.json()

    await dispatch(PaymentActions.setTransaction(data.transactions))
    await dispatch(PaymentActions.setMethod(data.methods))
    await dispatch(PaymentActions.setAccount(data.externalAccounts))
    await dispatch(PaymentActions.updateBalance({
      balance: data.balance,
      hasActiveAccount: data.hasActiveAccount,
      suspended: data.suspended,
      hasAccount: data.hasAccount
    }))
    await dispatch(PaymentActions.updateDefault(data.methods.filter(v => v.isDefault)[0]))
  })
};

export const setDefaultMethod = async (method, authState, dispatch) => {
  return fetch(`${env.API_URL}/payments/register_default`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${authState.userToken}`
    },
    body: JSON.stringify({ method: method.id })
  }).then(async (res) => {
    if (!res.ok) {
      throw new Error((await res.json()).message)
    }
    await dispatch(PaymentActions.updateDefault(method))
  })
};

export const removeMethod = async (method, authState, dispatch) => {
  return fetch(`${env.API_URL}/payments/remove_payment`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${authState.userToken}`
    },
    body: JSON.stringify({ method: method.id })
  }).then(async (res) => {
    if (!res.ok) {
      throw new Error((await res.json()).message)
    }
    await dispatch(PaymentActions.updateDefault(null))
    await dispatch(PaymentActions.removeMethod(method))
  })
};

export const payout = async ({ destination, amount }, authState) => {
  return fetch(`${env.API_URL}/payments/payout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${authState.userToken}`
    },
    body: JSON.stringify({
      destination,
      amount,
    })
  }).then(async (res) => {
    if (!res.ok) {
      throw new Error((await res.json()).message)
    }

    return true
  })
};

// TODO: will have to decide on mechanism to handle job schedules
export const makePayment = async ({ method, recipient, amount, description, jobID }, authState, dispatch) => {
  return fetch(`${env.API_URL}/payments/pay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${authState.userToken}`
    },
    body: JSON.stringify({
      paymentMethodID: method.id,
      recipient,
      amount,
      description,
      jobID
    })
  }).then(async (res) => {
    if (!res.ok) {
      throw new Error((await res.json()).message)
    }

    const data = await res.json()
    await dispatch(PaymentActions.updateTransaction(data.transaction))
  })
};

export const placeHold = async ({ method, recipient, amount, description, jobID }, authState, dispatch) => {
  return fetch(`${env.API_URL}/payments/pay/hold`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${authState.userToken}`
    },
    body: JSON.stringify({
      recipient,
      amount,
      description,
      jobID
    })
  }).then(async (res) => {
    if (!res.ok) {
      throw new Error((await res.json()).message)
    }
  })
};

export const completeHold = async ({ transactionID, amount, jobID }, authState, dispatch) => {
  return fetch(`${env.API_URL}/payments/pay/hold`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${authState.userToken}`
    },
    body: JSON.stringify({
      transactionID,
      amount,
      jobID
    })
  }).then(async (res) => {
    if (!res.ok) {
      throw new Error((await res.json()).message)
    }
  })
};

export const cancelHold = async ({ transactionID }, authState, dispatch) => {
  return fetch(`${env.API_URL}/payments/pay/hold`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${authState.userToken}`
    },
    body: JSON.stringify({ transactionID })
  }).then(async (res) => {
    if (!res.ok) {
      throw new Error((await res.json()).message)
    }
  })
};

export const initiateAccount = async (authState) => {
  return fetch(`${env.API_URL}/payments/setup_account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${authState.userToken}`
    },
    body: JSON.stringify({ first_name: authState.userData.first_name, last_name: authState.userData.last_name, phone: authState.userData.phone_number, email: authState.userData.email }),
  }).then(async (res) => {
    if (!res.ok) {
      throw new Error((await res.json()).message)
    }
    return (await res.json()).url
  })
};

export const fetchDashboardLink = async (authState) => {
  return fetch(`${env.API_URL}/payments/dashboard_link`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${authState.userToken}`
    },
  }).then(async (res) => {
    if (!res.ok) {
      throw new Error((await res.json()).message)
    }
    return (await res.json()).url
  })
};