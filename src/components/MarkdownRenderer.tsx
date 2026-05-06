import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ComponentPropsWithoutRef } from 'react';

type CodeProps = ComponentPropsWithoutRef<'code'> & {
  inline?: boolean;
  node?: unknown;
};

const MarkdownComponents: Components = {
  hr: () => <hr className='my-12 border-0 h-px bg-border-subtle/80' />,
  h3: ({ children }) => (
    <h3 className='group text-2xl font-bold text-text-main mt-8 mb-8 flex items-center gap-4'>
      <span className='h-8 w-1.5 bg-accent rounded-full scale-y-75 group-hover:scale-y-100 transition-transform duration-300' />
      {children}
    </h3>
  ),
  h4: ({ children }) => <h4 className='text-lg font-bold text-accent-dark mt-10 mb-4'>{children}</h4>,
  p: ({ children }) => (
    <p className='text-lg leading-[1.8] text-text-main/80 mb-2 font-light dark:font-normal break-all whitespace-normal'>
      {children}
    </p>
  ),
  li: ({ children }) => (
    <li className='relative pl-8 mb-4 text-text-main/80 leading-relaxed list-none before:content-[""] before:absolute before:left-0 before:top-3 before:w-1.5 before:h-1.5 before:rounded-full before:bg-accent/40'>
      {children}
    </li>
  ),
  strong: ({ children }) => (
    <strong className='font-bold text-text-main bg-accent-soft/50 px-1.5 py-0.5 rounded-md'>{children}</strong>
  ),
  code: ({ inline, className, children, ...props }: CodeProps) => {
    const match = /language-(\w+)/.exec(className || '');
    const codeString = String(children).replace(/\n$/, '');

    if (!inline && match) {
      return (
        <div className='my-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#1a1c1e]'>
          <div className='flex items-center gap-2 px-5 py-3 bg-white/3 border-b border-white/5'>
            <div className='flex gap-1.5'>
              <div className='w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30' />
              <div className='w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/30' />
              <div className='w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/30' />
            </div>
            <span className='ml-3 text-[10px] text-white/30 font-mono uppercase tracking-widest'>{match[1]}</span>
          </div>

          <div className='overflow-x-auto'>
            <SyntaxHighlighter
              {...props}
              style={nord}
              language={match[1]}
              PreTag='div'
              customStyle={{
                margin: 0,
                padding: '1.5rem',
                fontSize: '0.85rem',
                lineHeight: '1.7',
                background: 'transparent',
                textShadow: 'none',
              }}
            >
              {codeString}
            </SyntaxHighlighter>
          </div>
        </div>
      );
    }

    return (
      <code
        className='px-1.5 py-0.5 mx-0.5 rounded-lg bg-accent/5 text-accent font-mono text-[0.85em] border border-accent/10 break-all whitespace-normal'
        {...props}
      >
        {children}
      </code>
    );
  },
};

export const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
      {content}
    </ReactMarkdown>
  );
};
