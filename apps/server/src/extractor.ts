import * as kuromoji from 'kuromoji';

const tokenizer = await new Promise<kuromoji.Tokenizer<kuromoji.IpadicFeatures>>((resolve, reject) => {
  kuromoji.builder({ dicPath: '../../node_modules/kuromoji/dict' }).build((err, newTokenizer) => {
    if (err) {
      reject(err);
    }
    resolve(newTokenizer);
  });
});

const onlySpecialCharactersRegex = /^[\s!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]+$/;
const onlyNumberOrAlphabetRegex = /^[a-zA-Z0-9]+$/;
const urlRegex = /https?:\/\/\S+/g;
const mentionRegex = /!\{"type":"(?:user|channel)","raw":"(.+?)","id":"[a-z0-9-]+"\}/g;

export const extractWords = async (text: string) => {
  const urlStripped = text.replace(urlRegex, '');
  const mentionsReplaced = urlStripped.replace(mentionRegex, (_, raw) => raw);
  const tokens = tokenizer.tokenize(mentionsReplaced);

  const words = tokens
    .filter(
      (t) =>
        t.pos === '名詞' &&
        t.pos_detail_1 !== '代名詞' &&
        !onlyNumberOrAlphabetRegex.test(t.surface_form) &&
        !onlySpecialCharactersRegex.test(t.surface_form) &&
        t.surface_form.length >= 2,
    )
    .map((t) => t.surface_form);
  return words;
};
