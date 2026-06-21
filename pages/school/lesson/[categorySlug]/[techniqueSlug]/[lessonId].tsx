import Link from 'next/link';
import LessonPage from '@/components/LessonPage';

interface LessonParams {
  categorySlug: string;
  techniqueSlug: string;
  lessonId: string;
}

interface LessonFromApi {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  content: string;
  sort_order: number;
  sources: { citation: string; url: string }[];
  techniqueSlug?: string;
  techniqueTitle?: string;
  categorySlug?: string;
  categoryTitle?: string;
}

export default function DynamicLesson({ categorySlug, techniqueSlug, lessonId, lesson }: LessonParams & { lesson: LessonFromApi | null }) {
  return (
    <LessonPage categorySlug={categorySlug} techniqueSlug={techniqueSlug} lessonId={lessonId} lesson={lesson ?? undefined} />
  );
}

export async function getServerSideProps({ params, req }: { params: LessonParams; req: any }) {
  try {
    const host = req.headers.host;
    const protocol = host?.startsWith('localhost') ? 'http' : 'https';
    const base = `${protocol}://${host}`;
    const res = await fetch(`${base}/api/lessons/${params.lessonId}`);
    if (!res.ok) {
      return { props: { lesson: null } };
    }
    const lesson: LessonFromApi = await res.json();
    return {
      props: {
        categorySlug: params.categorySlug,
        techniqueSlug: params.techniqueSlug,
        lessonId: params.lessonId,
        lesson,
      },
    };
  } catch {
    return { props: { lesson: null } };
  }
}
