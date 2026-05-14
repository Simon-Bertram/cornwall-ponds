import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export interface AuthCardShellProps {
  title: string;
  subtitle: string;
  footerLead: string;
  footerLinkText: string;
  footerHref: string;
  children: ReactNode;
  className?: string;
  /** When true, omit full-page shell (min-height, outer muted fill) for split layouts. */
  embedded?: boolean;
}

export function AuthCardShell({
  title,
  subtitle,
  footerLead,
  footerLinkText,
  footerHref,
  children,
  className,
  embedded = false,
}: AuthCardShellProps) {
  return (
    <div
      className={cn(
        embedded
          ? "flex w-full min-w-0 flex-col justify-center p-6 md:p-10"
          : "flex min-h-svh w-full min-w-0 flex-col items-center justify-center bg-muted p-6 md:p-10",
        className,
      )}
    >
      <div className="w-full">
        <Card className="overflow-hidden p-0" size="default">
          <CardContent className="p-0">
            <div className="p-6 md:p-8">
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">{title}</h1>
                  <p className="text-balance text-muted-foreground">
                    {subtitle}
                  </p>
                </div>
                {children}
                <FieldDescription className="text-center">
                  {footerLead}{" "}
                  <a
                    href={footerHref}
                    className="underline-offset-2 hover:underline"
                  >
                    {footerLinkText}
                  </a>
                </FieldDescription>
              </FieldGroup>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
