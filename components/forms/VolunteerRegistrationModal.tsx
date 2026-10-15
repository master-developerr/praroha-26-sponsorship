"use client";

import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { Sparkles, CheckCircle2 } from "lucide-react";

export function VolunteerRegistrationModal({
  isOpen,
  initialValues,
  onComplete,
}: {
  isOpen: boolean;
  initialValues?: {
    name?: string;
    phone?: string;
    semester?: string;
    department?: string;
  };
  onComplete?: () => void;
}) {
  const { user, refetchProfile } = useAuthUser();
  const registerProfile = useMutation(api.users.registerVolunteerProfile);

  const [fullName, setFullName] = useState(initialValues?.name ?? user?.fullName ?? "");
  const [phone, setPhone] = useState(initialValues?.phone ?? "");
  const [semester, setSemester] = useState(initialValues?.semester ?? "S6");
  const [department, setDepartment] = useState(
    initialValues?.department ?? "Civil Engineering"
  );

  const [errors, setErrors] = useState<{
    fullName?: string;
    phone?: string;
    semester?: string;
    department?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
    if (!fullName.trim()) {
      errs.fullName = "Full name is required";
    }
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone) {
      errs.phone = "Phone number is required";
    } else if (cleanPhone.length !== 10) {
      errs.phone = "Enter a valid 10-digit mobile number";
    }
    if (!semester) {
      errs.semester = "Select your academic semester";
    }
    if (!department) {
      errs.department = "Select your department";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await registerProfile({
        clerkId: user?.id ?? "user_dev_new_unregistered",
        email: user?.email ?? "volunteer@cusat.ac.in",
        name: fullName.trim(),
        phone: phone.trim(),
        semester,
        department,
      });

      setIsSuccess(true);
      setTimeout(() => {
        refetchProfile();
        if (onComplete) onComplete();
      }, 1000);
    } catch (err: unknown) {
      console.error(err);
      setErrors({ fullName: "Failed to submit profile. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      isDismissable={false}
      maxWidth="md"
      title="Complete your profile"
      description="Tell us a few details before you get started."
    >
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center py-6 text-center animate-in zoom-in-95">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h3 className="mt-3 text-base font-semibold text-text-primary">
            Profile submitted
          </h3>
          <p className="mt-1 text-xs text-text-secondary">
            Your registration is being routed to the PRAROHA'26 Core Team for verification.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="rounded-lg bg-surface-subtle border border-border-subtle p-3 text-xs text-text-secondary flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>
              All student volunteers are verified by the sponsorship head to ensure secure corporate communication and lead assignments.
            </span>
          </div>

          <Input
            id="fullName"
            label="Full Name"
            placeholder="e.g. Arjun Nair"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
            disabled={isLoading}
          />

          <Input
            id="phone"
            label="Phone Number"
            type="tel"
            placeholder="e.g. 9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
            disabled={isLoading}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              id="semester"
              label="Academic Semester"
              options={semesterOptions}
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              error={errors.semester}
              disabled={isLoading}
            />

            <Select
              id="department"
              label="Department"
              options={departmentOptions}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              error={errors.department}
              disabled={isLoading}
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              {isLoading ? "Saving..." : "Continue"}
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  );
}
