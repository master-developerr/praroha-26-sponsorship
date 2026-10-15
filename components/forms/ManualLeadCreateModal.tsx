"use client";

import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { PhoneType, ContactVerificationLevel, PriorityLevel } from "@/types";

export function ManualLeadCreateModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { user } = useAuthUser();
  const createLeadMutation = useMutation(api.companies.createSingleLead);

  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("Construction & Infrastructure");
  const [niche, setNiche] = useState("");
  const [priority, setPriority] = useState<PriorityLevel>("High");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [notes, setNotes] = useState("");

  const [contactName, setContactName] = useState("");
  const [designation, setDesignation] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneType, setPhoneType] = useState<PhoneType>("direct_official");
  const [email, setEmail] = useState("");
  const [contactVerification, setContactVerification] =
    useState<ContactVerificationLevel>("VERIFIED_DECISION_MAKER");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!companyName.trim()) errs.companyName = "Company name is required";
    if (!industry.trim()) errs.industry = "Industry is required";
    if (!niche.trim()) errs.niche = "Niche is required";
    if (!contactName.trim()) errs.contactName = "Contact name is required";
    if (!designation.trim()) errs.designation = "Job title is required";
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = "Enter a valid 10-digit mobile number";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (!user?.id) {
      setErrors({ companyName: "Unauthorized. Admin session required." });
      return;
    }

    setIsLoading(true);
    try {
      await createLeadMutation({
        adminClerkId: user.id,
        companyName: companyName.trim(),
        industry: industry.trim(),
        niche: niche.trim(),
        priority,
        location: location.trim() || undefined,
        website: website.trim() || undefined,
        notes: notes.trim() || undefined,
        contactName: contactName.trim(),
        designation: designation.trim(),
        phone: phone.trim(),
        phoneType,
        email: email.trim() || undefined,
        contactVerification,
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setErrors({ companyName: "Failed to create lead. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title="Add Single Sponsorship Lead"
      description="Manually create a new corporate entity and attach its verified decision-maker."
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {/* Company Details */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted block">
            1. Corporate Entity Details
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              id="companyName"
              label="Company Name *"
              placeholder="e.g. Larsen & Toubro"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              error={errors.companyName}
            />

            <Input
              id="industry"
              label="Industry / Sector *"
              placeholder="e.g. Infrastructure & EPC"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              error={errors.industry}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              id="niche"
              label="Specific Business Niche *"
              placeholder="e.g. Heavy Civil Engineering"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              error={errors.niche}
            />

            <Select
              id="priority"
              label="Priority Level"
              options={[
                { label: "High Priority", value: "High" },
                { label: "Medium Priority", value: "Medium" },
                { label: "Normal Priority", value: "Normal" },
                { label: "Low Priority", value: "Low" },
              ]}
              value={priority}
              onChange={(e) => setPriority(e.target.value as PriorityLevel)}
            />

            <Input
              id="location"
              label="HQ / Kerala Office City"
              placeholder="e.g. Kochi / Chennai"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <Input
            id="website"
            label="Corporate Website URL"
            placeholder="e.g. https://www.larsentoubro.com"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        {/* Contact Details */}
        <div className="space-y-3 border-t border-border-subtle pt-3">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted block">
            2. Primary Decision-Maker Contact
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              id="contactName"
              label="Contact Person Name *"
              placeholder="e.g. Suresh Kumar"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              error={errors.contactName}
            />

            <Input
              id="designation"
              label="Designation / Job Title *"
              placeholder="e.g. South India Marketing Head"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              error={errors.designation}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              id="phone"
              label="Primary Phone Number *"
              placeholder="e.g. 9846012345"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone}
            />

            <Select
              id="phoneType"
              label="Phone Type Classification"
              options={[
                { label: "Direct Mobile (Official)", value: "direct_official" },
                { label: "Regional HQ Office", value: "regional_office" },
                { label: "Branch Office Desk", value: "office" },
                { label: "Department Direct", value: "department" },
                { label: "Corporate Switchboard", value: "switchboard" },
                { label: "Unknown Origin", value: "unknown" },
              ]}
              value={phoneType}
              onChange={(e) => setPhoneType(e.target.value as PhoneType)}
            />

            <Select
              id="contactVerification"
              label="Contact Quality Verification"
              options={[
                { label: "Verified Decision Maker", value: "VERIFIED_DECISION_MAKER" },
                { label: "Company Representative", value: "VERIFIED_COMPANY_REPRESENTATIVE" },
                { label: "Official Desk Line", value: "OFFICIAL_COMPANY_CONTACT" },
                { label: "Unverified Contact", value: "UNVERIFIED" },
              ]}
              value={contactVerification}
              onChange={(e) =>
                setContactVerification(e.target.value as ContactVerificationLevel)
              }
            />
          </div>

          <Input
            id="email"
            label="Direct Corporate Email"
            type="email"
            placeholder="e.g. suresh.kumar@larsentoubro.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isLoading}>
            Create Lead in Unassigned Pool
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
