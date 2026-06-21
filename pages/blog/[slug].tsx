import { useState, useEffect } from 'react';
import Link from 'next/link';
import SEO from '@/components/SEO';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getBlogPost, blogCategories } from '@/data/blog.generated';

export default function BlogPostPage({ post }: { post: any }) {
  if (!post) {
    return (
      <div className="container-narrow" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <SEO title="Blog Post Not Found" description="The requested blog post could not be found." path="/blog" />
        <h1>Post not found</h1>
        <Link href="/blog" style={{ color: 'var(--color-accent)' }}>← Back to blog</Link>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        type="article"
        jsonLd={
          post.publishedAt
            ? {
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: post.title,
                description: post.excerpt,
                datePublished: post.publishedAt,
                author: {
                  '@type': 'Organization',
                  name: post.authorName || 'Bartender Sanctuary',
                },
                publisher: {
                  '@type': 'Organization',
                  name: 'Bartender Sanctuary',
                  url: 'https://bartender-sanctuary-app.vercel.app',
                },
              }
            : undefined
        }
      />
      <article className="container-narrow" style={{ padding: '2.5rem 1.5rem 4rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Link href="/blog" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Back to blog
          </Link>
        </div>

        <header style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-accent)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {post.category?.title || post.categorySlug}
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '0.75rem', lineHeight: 1.2, color: 'var(--color-text)' }}>
            {post.title}
          </h1>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            {post.authorName} · {new Date(post.publishedAt).toLocaleDateString()}
          </div>
        </header>

        {post.coverImage && (
          <div
            style={{
              height: '360px',
              borderRadius: '16px',
              backgroundImage: `url(${post.coverImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              marginBottom: '2.5rem',
            }}
          />
        )}

        <div
          style={{
            color: 'var(--color-text-secondary)',
            lineHeight: 1.75,
            fontSize: '1.05rem',
          }}
          className="blog-prose"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </>
  );
}

export async function getServerSideProps(context: { params: { slug?: string } }) {
  const slug = context.params?.slug;
  if (!slug || typeof slug !== 'string') {
    return { props: { post: null } };
  }
  const post = getBlogPost(slug);
  return { props: { post: post || null } };
}
