export const fetchPost = (url_: string, data: Record<any, any>) => {
  const localhost = '0.0.0.0';
  const url = `http://${localhost}${url_}`;
  console.log(`[fetchPost] fetting url ${url}`);
  return new Promise((resolve, reject) => {
    fetch(url, {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    }).then((response) => {
      if (response.status !== 200 || !response.ok) {
        reject('bad response');
      }

      console.log('fetchPost response: ', response);
      resolve(response.json());
    });
  });
};
