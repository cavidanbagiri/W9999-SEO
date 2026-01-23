import { getAllWordSlugs, getWord } from '@/lib/api';

export async function generateStaticParams() {
  const slugs = await getAllWordSlugs();          // [{lf:'en', lt:'es', word:'hello'}, …]
  return slugs.map((s) => ({ locale: `${s.lf}-${s.lt}`, word: s.word }));
}

export default async function Page({ params }) {
  const { locale, word } = await params;
  const [langFrom, langTo] = locale.split('-');
  const data = await getWord(langFrom, langTo, word);

  return (
    <main>
      <h1>{data.word}</h1>
      <p>{data.translation}</p>
      <audio src={data.audioUrl} controls />
      <ul>
        {(data.examples || []).map((e, i) => <li key={i}>{e}</li>)}
      </ul>
      <a
        href={`https://app.w9999.app/card-detail?word=${encodeURIComponent(
          word
        )}&langFrom=${langFrom}&langTo=${langTo}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open full app
      </a>
    </main>
  );
}