//TODO: If you send a debug release app to testflight this will cause the whole app to fail...
// import hash from 'object-hash';
// import AsyncStore from './AsyncStore';

const origin = __DEV__
  ? 'http://192.168.30.101:5001/game-7bb7c/us-central1'
  : 'https://us-central1-game-7bb7c.cloudfunctions.net';

const cache = new Set();

export const fetchPost = (endpoint: string, data: Record<any, any>, ignoreDupIfPending = true) => {
  let hash = '';
  if (ignoreDupIfPending) {
    hash = JSON.stringify(data);
    if (cache.has(hash)) {
      return Promise.resolve({});
    }
    cache.add(hash);
  }

  const url = `${origin}/${endpoint}`;
  console.log(url);
  return new Promise((resolve, reject) => {
    fetch(url, {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    }).then(async (response) => {
      if (ignoreDupIfPending) {
        cache.delete(hash);
      }
      if (response.status !== 200 || !response.ok) {
        reject('bad response');
      }

      const responseJson = await response.json();
      console.log(`
      <==================== FETCH =================>
      endpoint: ${url}
      response: ${JSON.stringify(responseJson, null, 2)}
      <=============================================>
      `);
      resolve(responseJson);
    });
  });
};
