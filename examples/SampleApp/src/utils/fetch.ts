const localhost = '192.168.30.104';
export const fetchPost = (url_: string, data: Record<any, any>) => {
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
