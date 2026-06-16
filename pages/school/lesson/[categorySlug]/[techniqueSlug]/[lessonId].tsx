import Link from 'next/link';
import LessonPage from '@/components/LessonPage';

interface LessonParams {
  categorySlug: string;
  techniqueSlug: string;
  lessonId: string;
}

export default function DynamicLesson({ categorySlug, techniqueSlug, lessonId }: LessonParams) {
  return (
    <LessonPage categorySlug={categorySlug} techniqueSlug={techniqueSlug} lessonId={lessonId} />
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
