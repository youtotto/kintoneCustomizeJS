  const GetAPI = (path, params) =>
    kintone.api(kintone.api.url(path, true), 'GET', params);