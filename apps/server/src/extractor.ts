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
const onlyNumbersRegex = /^\d+$/;
const urlRegex = /https?:\/\/\S+/g;

export const extractWords = async (text: string) => {
  const urlStripped = text.replace(urlRegex, '');
  const tokens = tokenizer.tokenize(urlStripped);

  const words = tokens
    .filter(
      (t) =>
        t.pos === '名詞' &&
        !onlyNumbersRegex.test(t.surface_form) &&
        !onlySpecialCharactersRegex.test(t.surface_form) &&
        t.surface_form.length >= 2,
    )
    .map((t) => t.surface_form);
  return words;
};
