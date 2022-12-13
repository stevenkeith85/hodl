import Button from '@mui/material/Button';
import fs from 'fs';
import matter from 'gray-matter';
import md from 'markdown-it';
import Head from 'next/head';
import Link from 'next/link';
import { HodlBorderedBox } from '../components/HodlBorderedBox';
import { HodlShareButton } from '../components/HodlShareButton';

const getPaths = (root) => {
  const data = [];
  const stack = [root];

  while (stack.length !== 0) {
    const folder = stack.pop();

    // Get all our posts
    const dirents = fs.readdirSync(folder, { withFileTypes: true });

    dirents.map(dirent => {
      if (dirent.isDirectory()) {
        stack.push(`${folder}/${dirent.name}`);
      } else {
        data.push(`${folder}/${dirent.name}`);
      }
    })
  }
  const relativePaths = data.map(data => data.replace(`${root}/`, ''));
  return relativePaths;
}

export async function getStaticPaths() {
  const files = getPaths('src/posts');

  const paths = files.map((fileName) => ({
    params: {
      slug: fileName.replace('.md', '').split('/'),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const fileName = fs.readFileSync(`src/posts/${slug.join('/')}.md`, 'utf-8');
  const { data: frontmatter, content } = matter(fileName);

  return {
    props: {
      frontmatter,
      content,
    },
  };
}

export default function PostPage({ frontmatter, content }) {
  return (<>
    <Head>
      <title>{frontmatter?.metaTitle}</title>
      <meta name="description" content={frontmatter?.metaDescription} />
      <link href={frontmatter?.canonical} rel="canonical" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@hodlmymoon" />
      <meta name="twitter:creator" content="@hodlmymoon" />
      <meta name="twitter:title" content={frontmatter?.title} />
      <meta name="twitter:description" content={frontmatter?.metaDescription} />
      <meta name="twitter:image" content={frontmatter?.socialImage} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={frontmatter?.canonical} />
      <meta property="og:title" content={frontmatter?.title} />
      <meta property="og:image" content={frontmatter?.socialImage} />
      <meta property="og:description" content={frontmatter?.metaDescription} />
    </Head>
    <HodlBorderedBox sx={{ marginY: 4 }}>

      <h1 className="primary-main">{frontmatter.title}</h1>
      <div style={{ margin: '0 0 16px 0', display: 'flex', gap: '16px' }}>
        <HodlShareButton />
        <Link href="/learn">
          <Button variant="contained" sx={{ paddingX: 2, paddingY: 1 }}>
            Back To Learning Hub
          </Button>
        </Link>
      </div>

      <div
        dangerouslySetInnerHTML={{
          __html: md().render(content)
        }}
      />
      <div style={{ margin: '32px 0 16px 0', display: 'flex', gap: '16px' }}>
        <HodlShareButton />
        <Link href="/learn">
          <Button variant="contained" sx={{ paddingX: 2, paddingY: 1 }}>
            Back To Learning Hub
          </Button>
        </Link>
      </div>
    </HodlBorderedBox>
  </>);
}