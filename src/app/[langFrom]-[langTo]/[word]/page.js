import { getAllWordSlugs, getWord } from '@/lib/api';

export async function generateStaticParams() {
  const slugs = await getAllWordSlugs();
  return slugs.map((s) => ({ langFrom: s.lf, langTo: s.lt, word: s.word }));
}

export default async function WordPage({ params }) {
  const { langFrom, langTo, word } = params;
  const data = await getWord(langFrom, langTo, word);
  return <main><h1>{data.word}</h1><p>{data.translation}</p></main>;
}