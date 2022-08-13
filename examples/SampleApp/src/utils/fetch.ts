//TODO: If you send a debug release app to testflight this will cause the whole app to fail...
const origin = __DEV__
  ? 'http://192.168.30.103:5001/game-7bb7c/us-central1'
  : 'https://us-central1-game-7bb7c.cloudfunctions.net';

export const fetchPost = (endpoint: string, data: Record<any, any>) => {
  const url = `${origin}/${endpoint}`;
  console.log(url);
  console.log(`[fetchPost] fetting url ${url}`);
  return new Promise((resolve, reject) => {
    fetch(url, {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    }).then(async (response) => {
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
