"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  LogOut,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  User,
  GraduationCap,
  Phone,
  Building2,
  FileCheck,
  AlertCircle,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function RegisterProfilePage() {
  const router = useRouter();
  const { user, authState, signOut } = useAuthUser();
  const registerProfile = useMutation(api.users.registerVolunteerProfile);

  // Stepped Form State: Step 1 (Identity), Step 2 (Academic), Step 3 (Contact & Declaration)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [semester, setSemester] = useState("S6");
  const [department, setDepartment] = useState("Civil Engineering");
  const [declarationChecked, setDeclarationChecked] = useState(true);

  const [errors, setErrors] = useState<{
    fullName?: string;
    phone?: string;
    semester?: string;
    department?: string;
    declaration?: string;
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
        router.replace("/workspace");
        break;
      case "ADMIN":
        router.replace("/admin");
        break;
      case "PENDING":
        router.replace("/pending");
        break;
      case "REJECTED":
        router.replace("/rejected");
        break;
      case "SUSPENDED":
        router.replace("/suspended");
        break;
      case "UNAUTHENTICATED":
        router.replace("/sign-in");
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

  const validateStep1 = () => {
    const errs: typeof errors = {};
    if (!fullName.trim()) errs.fullName = "Full name is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: typeof errors = {};
    if (!department) errs.department = "Please select your department";
    if (!semester) errs.semester = "Please select your current semester";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs: typeof errors = {};
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone) {
      errs.phone = "Phone number is required";
    } else if (cleanPhone.length !== 10) {
      errs.phone = "Enter a valid 10-digit Indian mobile number";
    }
    if (!declarationChecked) {
      errs.declaration = "You must acknowledge the outreach clearance requirement";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    if (!user?.id || !user?.email) {
      setErrors({ fullName: "Authentication required. Please sign in with your student account." });
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
        router.replace("/pending");
      }, 1000);
    } catch (err: unknown) {
      console.error(err);
      setErrors({ fullName: "Failed to submit profile. Please verify your connection." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary text-primary-foreground font-black text-sm">
            P
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-text-primary uppercase">
              PRAROHA&apos;26 // ONBOARDING
            </h1>
            <p className="text-[11px] font-mono text-text-muted">
              Division of Civil Engineering · SOE CUSAT
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle className="h-8 w-8 rounded-sm" />
          <button
            onClick={() => signOut()}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-rose-600 transition-colors px-2 py-1"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* Main Registration Experience */}
      <main className="max-w-xl w-full mx-auto my-auto py-8">
        <div className="rounded-lg border border-border bg-surface shadow-xs p-6 sm:p-8 space-y-6">
          {/* Header & Step Counter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-primary/10 text-primary">
                <ShieldCheck className="h-3.5 w-3.5" />
                Student SDR Registration
              </span>
              <span className="text-xs font-mono text-text-muted">
                Step {currentStep} of 3
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
              {currentStep === 1
                ? "Identity & Credentials"
                : currentStep === 2
                ? "Academic Standing"
                : "Contact Clearance & Review"}
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              {currentStep === 1
                ? "Confirm your full legal name as it appears on your CUSAT student ID."
                : currentStep === 2
                ? "Select your engineering discipline and current academic semester."
                : "Provide your primary calling mobile number for corporate outreach allocations."}
            </p>
          </div>

          {/* Stepped Progress Bar */}
          <div className="grid grid-cols-3 gap-2">
            <div className={`h-1.5 rounded-full transition-all ${currentStep >= 1 ? "bg-primary" : "bg-border"}`} />
            <div className={`h-1.5 rounded-full transition-all ${currentStep >= 2 ? "bg-primary" : "bg-border"}`} />
            <div className={`h-1.5 rounded-full transition-all ${currentStep >= 3 ? "bg-primary" : "bg-border"}`} />
          </div>

          {/* Success Screen */}
          {isSuccess ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">Profile Submitted</h3>
              <p className="text-xs text-text-secondary max-w-sm">
                Forwarding your application to the Sponsorship Head verification queue...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Step 1: Personal Identification */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-primary">
                      Full Name (as per Student ID)
                    </label>
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ananya Krishna"
                      className="h-10 text-xs"
                      autoFocus
                    />
                    {errors.fullName && (
                      <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-primary">
                      Authenticated Student Email
                    </label>
                    <Input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="h-10 text-xs bg-surface-subtle text-text-muted cursor-not-allowed"
                    />
                    <p className="text-[10px] text-text-muted">
                      Locked to your Clerk authenticated session.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Academic Standing */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-primary">
                      Engineering Department
                    </label>
                    <Select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      options={departmentOptions}
                      className="h-10 text-xs"
                    />
                    {errors.department && (
                      <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.department}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-primary">
                      Current Academic Semester
                    </label>
                    <Select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      options={semesterOptions}
                      className="h-10 text-xs"
                    />
                    {errors.semester && (
                      <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.semester}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Contact & Verification Declaration */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-primary">
                      Calling Mobile Number (10 Digits)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-mono text-text-muted">
                        +91
                      </span>
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98470 12345"
                        className="h-10 text-xs pl-12 font-mono"
                        maxLength={10}
                        autoFocus
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.phone}
                      </p>
                    )}
                    <p className="text-[10px] text-text-muted">
                      Used by the Sponsorship Head for internal coordination and lead dispatches.
                    </p>
                  </div>

                  {/* Summary Confirmation Card */}
                  <div className="p-3.5 rounded border border-border bg-surface-subtle/50 space-y-1 text-xs">
                    <p className="font-mono text-[10px] uppercase text-text-muted font-bold">
                      Registration Summary
                    </p>
                    <p className="font-semibold text-text-primary">{fullName}</p>
                    <p className="text-text-secondary text-[11px]">
                      {department} · {semester}
                    </p>
                  </div>

                  {/* Declaration Checkbox */}
                  <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={declarationChecked}
                      onChange={(e) => setDeclarationChecked(e.target.checked)}
                      className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4"
                    />
                    <span className="text-[11px] text-text-secondary leading-snug">
                      I understand that volunteer accounts require administrative clearance by the Sponsorship Head before corporate leads are assigned.
                    </span>
                  </label>
                  {errors.declaration && (
                    <p className="text-[11px] text-rose-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.declaration}
                    </p>
                  )}
                </div>
              )}

              {/* Navigation Actions */}
              <div className="pt-4 border-t border-border flex items-center justify-between">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleBack}
                    className="text-xs gap-1.5"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleNext}
                    className="text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary-hover font-semibold"
                  >
                    <span>Continue</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting}
                    className="text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary-hover font-semibold"
                  >
                    {isSubmitting ? (
                      <span>Submitting Profile...</span>
                    ) : (
                      <>
                        <span>Submit for Clearance</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto text-center text-[11px] font-mono text-text-muted pt-4">
        PRAROHA&apos;26 Sponsorship Operations Committee · CUSAT
      </footer>
    </div>
  );
}
