import cookieParser from '~/plugins/cookies';
import Vue from 'vue';

export default function({ store, query, error, req, res, replace, hotReload }) {
  if (hotReload) return;

  // 从query读取lang并设给cookie，防止跳转后丢lang
  const langs = store.state.lang.locales.map(item => item.val);

  if (query.lang && langs.indexOf(query.lang) !== -1) {
    if (process.client) {
      cookieParser.setItem(
        window.document,
        'lang',
        query.lang,
        30 * 24 * 60 * 60,
        '/'
      );
    } else {
      res.setHeader(
        'Set-Cookie',
        `lang=${query.lang}; max-age=${30 * 24 * 60 * 60}`
      );
    }
  }
  
  let preferLanguage = 'en_US';
  let cookies = { lang: '' };
  let acceptLanguage = '';

  if (req) {
    acceptLanguage = req.headers['accept-language'];
    preferLanguage = store.state.lang.lang || acceptLanguage || 'en_US';

    const content = req.headers.cookie || '';
    cookies = cookieParser.parse(content);
  } else {
    cookies = cookieParser.parse(document.cookie || '');
    acceptLanguage =
      store.state.lang.lang || navigator.language || navigator.browserLanguage;
  }

  if (acceptLanguage) {
    preferLanguage = acceptLanguage;
    if (/cn/i.test(preferLanguage)) {
      preferLanguage = 'zh_Hans_CN';
    } else if (/en/i.test(preferLanguage)) {
      preferLanguage = 'en_US';
    } else if (/hk|tw/i.test(preferLanguage)) {
      preferLanguage = 'zh_Hant_HK';
    } else if (/ja/i.test(preferLanguage)) {
      preferLanguage = 'ja_JP';
    } else if (/ru/i.test(preferLanguage)) {
      preferLanguage = 'ru_KZ';
    } else if (/ko/i.test(preferLanguage)) {
      preferLanguage = 'ko_KP';
    } else {
      preferLanguage = 'en_US';
    }
  }

  let lang = query.lang || cookies.lang || preferLanguage;
  if (!store.state.lang.locales.find(item => item.value === lang)) {
    if (!process.SERVER_BUILD) {
      const date = new Date();
      const expire = new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000);
      cookieParser.setItem(document, 'lang',lang, expire, '/');
    }
  }
  Vue.prototype.$lang = lang;
  return store.commit('lang/setLang', lang);
}
