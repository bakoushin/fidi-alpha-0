const API_URL = '/api';

const getState = async () => {
  try {
    const url = `${API_URL}/state`;
    const response = await fetch(url, {
      method: 'GET'
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `${url} ➞ ${response.status} ${response.statusText} ${body}`
      );
    }
    const state = await response.json();
    return state;
  } catch (error) {
    console.error(error);
  }
};

const saveState = async (state) => {
  const url = `${API_URL}/state`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state)
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `${url} ➞ ${response.status} ${response.statusText} ${body}`
    );
  }
  return state;
};

const getOffers = async () => {
  const url = `${API_URL}/offers`;
  const response = await fetch(url, {
    method: 'GET'
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `${url} ➞ ${response.status} ${response.statusText} ${body}`
    );
  }
  // const offers = await response.json();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const offers = [
    {
      id: '1',
      type: 'USD',
      price: 0.99,
      amount: 10000,
      collateral: 20202.02,
      comment: 'Card2Card Transfer',
      user: {
        name: '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0',
        rating: 4.9,
        deals: 20
      }
    },
    {
      id: '2',
      type: 'USD',
      price: 0.95,
      amount: 10,
      collateral: 21.05,
      comment: 'Western Union',
      user: {
        name: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b',
        rating: 4.5,
        deals: 3
      }
    },
    {
      id: '3',
      type: 'USD',
      price: 0.92,
      amount: 50000,
      collateral: 108695.65,
      comment: 'Bank Wire',
      user: {
        name: '0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d',
        rating: 4.75,
        deals: '1000+'
      }
    }
  ];

  return offers;
};

const deposit = async (data) => {
  return {
    ...data,
    id: Math.random().toString(16).slice(2)
  };

  const url = `${API_URL}/deposit`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({
      ...data,
      value: Number((data.value * 100).toFixed(0))
    })
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `${url} ➞ ${response.status} ${response.statusText} ${body}`
    );
  }
  return response.json();
};

const buy = async (data) => {
  return {
    ...data,
    id: Math.random().toString(16).slice(2)
  };

  const url = `${API_URL}/deposit`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({
      ...data,
      value: Number((data.value * 100).toFixed(0))
    })
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `${url} ➞ ${response.status} ${response.statusText} ${body}`
    );
  }
  return response.json();
};

const cancelOffer = async (data) => {
  return true;

  const url = `${API_URL}/deposit`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({
      ...data,
      value: Number((data.value * 100).toFixed(0))
    })
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `${url} ➞ ${response.status} ${response.statusText} ${body}`
    );
  }
  return response.json();
};

const closeDeal = async (data) => {
  return true;

  const url = `${API_URL}/deposit`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({
      ...data,
      value: Number((data.value * 100).toFixed(0))
    })
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `${url} ➞ ${response.status} ${response.statusText} ${body}`
    );
  }
  return response.json();
};

export { getState, saveState, getOffers, deposit, buy, cancelOffer, closeDeal };
