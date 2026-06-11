import Head from 'next/head';
import Link from 'next/link';
import LessonPage from '@/components/LessonPage';

interface LessonParams {
  categorySlug: string;
  techniqueSlug: string;
  lessonId: string;
}

export default function DynamicLesson({ categorySlug, techniqueSlug, lessonId }: LessonParams) {
  return (
    <>
      <Head>
        <title>{`Lesson ${lessonId} | Bartender School`}</title>
        <meta name="description" content="" />
      </Head>
      <LessonPage categorySlug={categorySlug} techniqueSlug={techniqueSlug} lessonId={lessonId} />
    </>
  );
}

export async function getServerSideProps({ params }: { params: LessonParams }) {
  return {
    props: {
      categorySlug: params.categorySlug,
      techniqueSlug: params.techniqueSlug,
      lessonId: params.lessonId,
    },
  };
}
