"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, CheckCircle2, LogOut, ShieldCheck, ArrowRight } from "lucide-react";

export default function RegisterProfilePage() {
  const router = useRouter();
  const { user, authState, signOut } = useAuthUser();
  const registerProfile = useMutation(api.users.registerVolunteerProfile);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [semester, setSemester] = useState("S6");
  const [department, setDepartment] = useState("Civil Engineering");
  const [errors, setErrors] = useState<{
    fullName?: string;
    phone?: string;
    semester?: string;
    department?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (user?.fullName) {
      setFullName((prev) => prev || user.fullName);
    }
  }, [user]);

  // If user already has a complete profile, route them accordingly
  useEffect(() => {
    switch (authState) {
      case "APPROVED_VOLUNTEER":
        router.push("/workspace");
        break;
      case "ADMIN":
        router.push("/admin");
        break;
      case "PENDING":
        router.push("/pending");
        break;
      case "REJECTED":
        router.push("/rejected");
        break;
      case "SUSPENDED":
        router.push("/suspended");
        break;
      case "UNAUTHENTICATED":
        router.push("/sign-in");
        break;
      default:
        break;
    }
  }, [authState, router]);

  const semesterOptions = [
    { label: "Semester 1 (S1)", value: "S1" },
    { label: "Semester 2 (S2)", value: "S2" },
    { label: "Semester 3 (S3)", value: "S3" },
    { label: "Semester 4 (S4)", value: "S4" },
    { label: "Semester 5 (S5)", value: "S5" },
    { label: "Semester 6 (S6)", value: "S6" },
    { label: "Semester 7 (S7)", value: "S7" },
    { label: "Semester 8 (S8)", value: "S8" },
  ];

  const departmentOptions = [
    { label: "Civil Engineering", value: "Civil Engineering" },
    { label: "Computer Science & Engineering", value: "Computer Science & Engineering" },
    { label: "Information Technology", value: "Information Technology" },
    { label: "Electronics & Communication", value: "Electronics & Communication" },
    { label: "Electrical & Electronics", value: "Electrical & Electronics" },
    { label: "Mechanical Engineering", value: "Mechanical Engineering" },
    { label: "Safety & Fire Engineering", value: "Safety & Fire Engineering" },
  ];

  const validate = () => {
    const errs: typeof errors = {};
    if (!fullName.trim()) errs.fullName = "Full name is required";
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone) {
      errs.phone = "Phone number is required";
    } else if (cleanPhone.length !== 10) {
      errs.phone = "Enter a valid 10-digit mobile number";
    }
    if (!semester) errs.semester = "Select your academic semester";
    if (!department) errs.department = "Select your department";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (!user?.id || !user?.email) {
      setErrors({ fullName: "Authentication required. Please sign in with your student account first." });
      return;
    }

    setIsSubmitting(true);
    try {
      await registerProfile({
        clerkId: user.id,
        email: user.email,
        name: fullName.trim(),
        phone: phone.trim(),
        semester,
        department,
      });

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/pending");
      }, 1000);
    } catch (err: unknown) {
      console.error(err);
      setErrors({ fullName: "Failed to submit profile. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-4 sm:p-8">
      {/* Top Bar */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-mint/70 text-primary">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2C6.5 6 4 10 4 15a8 8 0 0 0 16 0c0-5-2.5-9-8-13z" />
              <path d="M12 2c2.5 4 4 8 4 12a4 4 0 0 1-8 0c0-4 1.5-8 4-12z" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-text-primary">
              PRAROHA'26
            </h1>
            <p className="text-[11px] text-text-secondary">
              Division of Civil Engineering • SOE CUSAT
            </p>
          </div>
        </div>

        <button
          onClick={() => signOut()}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-rose-600 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign out</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Strategic Banner & Context */}
          <div className="lg:col-span-5 space-y-5">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-xs">
              <div className="relative h-44 w-full bg-accent-mint/20">
                <Image
                  src="/images/praroha26-sponsorship-hero.png"
                  alt="PRAROHA'26 Sponsorship Outreach Team"
                  fill
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
              </div>

              <div className="p-5 space-y-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-mint px-2.5 py-0.5 text-[10px] font-bold text-accent-mint-text">
                  <ShieldCheck className="h-3 w-3 text-primary" />
                  Official Student SDR Onboarding
                </span>
                <h2 className="text-base font-bold text-text-primary">
                  Join the Sponsorship Committee
                </h2>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Connect directly with top corporate infrastructure, tech, and engineering partners for South India's premier civil-tech symposium.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border-subtle bg-surface-subtle p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-text-primary">
                <Sparkles className="h-4 w-4 text-primary shrink-0" />
                <span>Verification standard</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                All volunteer accounts require verification by the Sponsorship Head before lead allocation to maintain corporate communication standards.
              </p>
            </div>
          </div>

          {/* Right Column: Registration Card */}
          <div className="lg:col-span-7">
            <Card className="border-border bg-surface shadow-xs">
              <CardContent className="p-6 sm:p-8">
                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-95">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-text-primary">
                      Profile submitted!
                    </h3>
                    <p className="mt-1.5 text-xs text-text-secondary max-w-sm">
                      Your details have been submitted. Forwarding you to the verification status holding screen...
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-text-primary">
                        Complete your volunteer credentials
                      </h3>
                      <p className="text-xs text-text-secondary">
                        Please provide your institutional details as registered at SOE CUSAT.
                      </p>
                    </div>

                    <Input
                      id="fullName"
                      label="Full Name"
                      placeholder="e.g. Arjun Nair"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      error={errors.fullName}
                      disabled={isSubmitting}
                    />

                    <Input
                      id="phone"
                      label="10-Digit Mobile Number"
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      error={errors.phone}
                      disabled={isSubmitting}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Select
                        id="semester"
                        label="Academic Semester"
                        options={semesterOptions}
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        error={errors.semester}
                        disabled={isSubmitting}
                      />

                      <Select
                        id="department"
                        label="Department"
                        options={departmentOptions}
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        error={errors.department}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="pt-3">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full font-semibold bg-primary hover:bg-primary-hover shadow-xs"
                        isLoading={isSubmitting}
                      >
                        <span>Submit for Verification</span>
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto text-center pt-6 border-t border-border-subtle text-[11px] text-text-muted">
        PRAROHA'26 • School of Engineering, Cochin University of Science and Technology
      </footer>
    </div>
  );
}
