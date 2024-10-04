"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
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
import { Icons } from "@/components/ui/icons";
import NavBar from "@/components/ui/navbar";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {" "}
      {/* Fill the screen and prevent overflow */}
      <AuroraBackground>
        <NavBar />

        {/* Centering the form */}
        <div className="flex grow justify-center items-center px-4 overflow-hidden">
          {/* Adding animation to the content */}
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
              <SignUp.Root>
                <Clerk.Loading>
                  {(isGlobalLoading) => (
                    <>
                      <SignUp.Step name="start">
                        <Card className="w-full sm:w-96 max-h-[90vh] overflow-auto bg-transparent backdrop-blur-xl dark:bg-zinc-900/40">
                          <CardHeader>
                            <CardTitle className="text-xl">Create your account</CardTitle>
                            <CardDescription>
                              Welcome! Please fill in the details to get
                              started.
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
                            <Clerk.Field
                              name="emailAddress"
                              className="space-y-2"
                            >
                              <Clerk.Label asChild>
                                <Label>Email address</Label>
                              </Clerk.Label>
                              <Clerk.Input type="email" required asChild>
                                <Input />
                              </Clerk.Input>
                              <Clerk.FieldError className="block text-sm text-destructive" />
                            </Clerk.Field>
                            <Clerk.Field name="password" className="space-y-2">
                              <Clerk.Label asChild>
                                <Label>Password</Label>
                              </Clerk.Label>
                              <Clerk.Input type="password" required asChild>
                                <Input />
                              </Clerk.Input>
                              <Clerk.FieldError className="block text-sm text-destructive" />
                            </Clerk.Field>
                          </CardContent>
                          <CardFooter>
                            <div className="grid w-full gap-y-4">
                              <SignUp.Captcha className="empty:hidden" />
                              <SignUp.Action submit asChild>
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
                              </SignUp.Action>
                              <Button variant="link" size="sm" asChild>
                                <Link href="/sign-in">
                                  Already have an account? Sign in
                                </Link>
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      </SignUp.Step>
                    </>
                  )}
                </Clerk.Loading>
              </SignUp.Root>
            </div>
          </motion.div>
        </div>
      </AuroraBackground>
    </div>
  );
}
