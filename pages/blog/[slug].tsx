import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getBlogPost, blogCategories } from '@/data/blog';

export default function BlogPostPage({ post }: { post: any }) {
  if (!post) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <h1>Post not found</h1>
        <Link href="/blog" style={{ color: 'var(--color-accent)' }}>← Back to blog</Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{post.title} — Blog — Bartender Sanctuary</title>
        <meta name="description" content={post.excerpt} />
      </Head>

      <article style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Link href="/blog" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>
            ← Back to blog
          </Link>
        </div>

        <header style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-accent)', marginBottom: '0.4rem' }}>
            {post.category?.title || post.categorySlug}
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '0.6rem' }}>{post.title}</h1>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            {post.authorName} · {new Date(post.publishedAt).toLocaleDateString()}
          </div>
        </header>

        {post.coverImage && (
          <div
            style={{
              height: '320px',
              borderRadius: '16px',
              backgroundImage: `url(${post.coverImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              marginBottom: '2rem',
            }}
          />
        )}

        <div
          style={{
            color: 'var(--color-text-secondary)',
            lineHeight: 1.8,
            fontSize: '1.05rem',
            whiteSpace: 'pre-wrap',
          }}
        >
          {post.content}
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
