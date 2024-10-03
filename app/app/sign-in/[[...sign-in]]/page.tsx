"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NavBar from "@/components/ui/navbar";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import { Icons } from '@/components/ui/icons'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <AuroraBackground>
        <NavBar />

        <div className="flex grow justify-center items-center px-4 overflow-hidden">
          <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="relative w-full max-h-screen flex justify-center items-center"
          >
            <div className="flex h-[80vh] items-center justify-center overflow-hidden">
              <SignIn.Root>
                <Clerk.Loading>
                  {(isGlobalLoading) => (
                    <>
                      <SignIn.Step name="start">
                        <Card className="w-full sm:w-96 max-h-[90vh] overflow-auto bg-transparent backdrop-blur-xl dark:bg-zinc-900/40">
                          <CardHeader>
                            <CardTitle className="text-xl">Sign in to 5ify</CardTitle>
                            <CardDescription>
                              Welcome back! Please sign in to continue.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="grid gap-y-4">
                            <div className="grid grid-cols-2 gap-x-4">
                              <Clerk.Connection name="github" asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  type="button"
                                  disabled={isGlobalLoading}
                                >
                                  <Clerk.Loading scope="provider:github">
                                    {(isLoading) =>
                                      isLoading ? (
                                        <Icons.spinner className="size-4 animate-spin" />
                                      ) : (
                                        <>
                                          <Icons.gitHub className="mr-2 size-4" />
                                          GitHub
                                        </>
                                      )
                                    }
                                  </Clerk.Loading>
                                </Button>
                              </Clerk.Connection>
                              <Clerk.Connection name="google" asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  type="button"
                                  disabled={isGlobalLoading}
                                >
                                  <Clerk.Loading scope="provider:google">
                                    {(isLoading) =>
                                      isLoading ? (
                                        <Icons.spinner className="size-4 animate-spin" />
                                      ) : (
                                        <>
                                          <Icons.google className="mr-2 size-4" />
                                          Google
                                        </>
                                      )
                                    }
                                  </Clerk.Loading>
                                </Button>
                              </Clerk.Connection>
                            </div>
                            <p className="flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                              or
                            </p>
                            <Clerk.Field name="identifier" className="space-y-2">
                              <Clerk.Label asChild>
                                <Label>Email address</Label>
                              </Clerk.Label>
                              <Clerk.Input type="email" required asChild>
                                <Input />
                              </Clerk.Input>
                              <Clerk.FieldError className="block text-sm text-destructive" />
                            </Clerk.Field>
                          </CardContent>
                          <CardFooter>
                            <div className="grid w-full gap-y-4">
                              <SignIn.Action submit asChild>
                                <Button disabled={isGlobalLoading}>
                                  <Clerk.Loading>
                                    {(isLoading) => {
                                      return isLoading ? (
                                        <Icons.spinner className="size-4 animate-spin" />
                                      ) : (
                                        "Continue"
                                      );
                                    }}
                                  </Clerk.Loading>
                                </Button>
                              </SignIn.Action>
                              <Button variant="link" size="sm" asChild>
                                <Link href="/sign-up">
                                  Don&apos;t have an account? Sign up
                                </Link>
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      </SignIn.Step>

                      <SignIn.Step name="choose-strategy">
                        <Card className="w-full sm:w-96 max-h-[90vh] overflow-auto bg-transparent backdrop-blur-xl dark:bg-zinc-900/40">
                          <CardHeader>
                            <CardTitle>Use another method</CardTitle>
                            <CardDescription>
                              Facing issues? You can use any of these methods to sign in.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="grid gap-y-4">
                            <SignIn.SupportedStrategy name="email_code" asChild>
                              <Button type="button" variant="link" disabled={isGlobalLoading}>
                                Email code
                              </Button>
                            </SignIn.SupportedStrategy>
                            <SignIn.SupportedStrategy name="password" asChild>
                              <Button type="button" variant="link" disabled={isGlobalLoading}>
                                Password
                              </Button>
                            </SignIn.SupportedStrategy>
                          </CardContent>
                          <CardFooter>
                            <div className="grid w-full gap-y-4">
                              <SignIn.Action navigate="previous" asChild>
                                <Button disabled={isGlobalLoading}>
                                  <Clerk.Loading>
                                    {(isLoading) => {
                                      return isLoading ? (
                                        <Icons.spinner className="size-4 animate-spin" />
                                      ) : (
                                        "Go back"
                                      );
                                    }}
                                  </Clerk.Loading>
                                </Button>
                              </SignIn.Action>
                            </div>
                          </CardFooter>
                        </Card>
                      </SignIn.Step>
                    </>
                  )}
                </Clerk.Loading>
              </SignIn.Root>
            </div>
          </motion.div>
        </div>
      </AuroraBackground>
    </div>
  );
}
