import { useState, useEffect, useRef } from 'preact/hooks';

function getItemOffsets() {
  const titles = document.querySelectorAll('article :is(h1, h2, h3, h4)');
  return Array.from(titles).map((title) => ({
    id: title.id,
    topOffset: title.getBoundingClientRect().top + window.scrollY,
  }));
}

type TableOfContentsProps = {
  headers: ReadonlyArray<{
    depth: number;
    slug: string;
    text: string;
  }>;
};

export default function TableOfContents({ headers = [] }: TableOfContentsProps) {
  const itemOffsets = useRef([]);
  const [activeId] = useState<string>(undefined);

  useEffect(() => {
    const updateItemOffsets = () => {
      itemOffsets.current = getItemOffsets();
    };

    updateItemOffsets();
    window.addEventListener('resize', updateItemOffsets);

    return () => {
      window.removeEventListener('resize', updateItemOffsets);
    };
  }, []);

  const overviewActiveClass = activeId === 'overview' ? 'active' : '';

  return (
    <>
      <h2 class="heading">On this page</h2>
      <ul>
        <li class={['header-link', 'depth-2', overviewActiveClass]}>
          <a href="#overview">Overview</a>
        </li>
        {headers
          .filter(({ depth }) => depth > 1 && depth < 4)
          .map(({ depth, slug, text }) => {
            const activeClass = activeId === slug ? 'active' : '';
            return (
              <li class={['header-link', `depth-${depth}`, activeClass].join(' ')}>
                <a href={`#${slug}`}>{text}</a>
              </li>
            );
          })}
      </ul>
    </>
  );
}
