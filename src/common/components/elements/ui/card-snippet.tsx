'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Collapsible,
  CollapsibleContent,
  Switch,
} from '@/common/components/elements';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { themes } from '@/config/thems';
import { useTheme } from 'next-themes';
import { hslToHex } from '@/common/libs';
import { useThemeStore } from '@/common/store';

interface CardSnippetProps {
  title?: string;
  children: React.ReactNode;
  code?: string;
}
const CardSnippet = ({ title, code, children }: CardSnippetProps) => {
  const [show, setShow] = useState(false);
  const toggle = () => {
    setShow(!show);
  };
  const { theme: mode } = useTheme();
  const { theme: config, setTheme: setConfig } = useThemeStore();
  const newTheme = themes.find((theme) => theme.name === config);

  const hslPrimary = `hsla(${
    newTheme?.cssVars[mode === 'dark' ? 'dark' : 'light'][
      'secondary-foreground'
    ]
  })`;
  const hslPrimary2 = `hsla(${
    newTheme?.cssVars[mode === 'dark' ? 'dark' : 'light'].secondary
  })`;

  const hexPrimary = hslToHex(hslPrimary);
  const hexPrimary2 = hslToHex(hslPrimary2);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        {title && (
          <CardTitle className="flex-1 leading-normal"> {title}</CardTitle>
        )}
        {code && (
          <div className="flex-none">
            <Switch id="airplane-mode" onClick={toggle} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        {children}
        <Collapsible open={show}>
          <CollapsibleContent className="CollapsibleContent">
            <SyntaxHighlighter
              language="javascript"
              className=" rounded-md  text-sm mt-6 "
              style={atomOneDark}
              customStyle={{
                padding: '24px',
                backgroundColor: mode !== 'dark' ? hexPrimary : hexPrimary2,
              }}
            >
              {`${code}`}
            </SyntaxHighlighter>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export { CardSnippet };
