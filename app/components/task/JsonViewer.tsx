'use client';

import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Copy, Check } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface JsonViewerProps {
  isOpen: boolean;
  toggleOpen: (open: boolean) => void;
  jsonData: string;
  copyToClipboard: () => void;
  isCopied: boolean;
}

const JsonViewer: React.FC<JsonViewerProps> = ({
  isOpen,
  toggleOpen,
  jsonData,
  copyToClipboard,
  isCopied,
}) => {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={toggleOpen}
      className="mt-8 border rounded-md"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className="flex justify-between w-full"
        >
          <span>View JSON Data</span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4">
        <div className="flex justify-end mb-2">
          <Button onClick={copyToClipboard} variant="outline" size="sm">
            {isCopied ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            {isCopied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <ScrollArea className="h-[200px] w-full overflow-auto bg-transparent">
          <pre className="p-4 rounded-md w-full overflow-x-auto font-mono whitespace-pre">
            {jsonData}
          </pre>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default JsonViewer;
