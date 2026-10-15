"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthUser } from "@/components/providers/AuthProvider";
import { PhoneType, ContactVerificationLevel, PriorityLevel, LeadStage } from "@/types";

interface EditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: any | null;
  onSuccess?: () => void;
}

export function EditLeadModal({ isOpen, onClose, lead, onSuccess }: EditLeadModalProps) {
  const { user } = useAuthUser();
  const updateLeadMutation = useMutation(api.companies.updateLead);

  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("Construction & Infrastructure");
  const [niche, setNiche] = useState("");
  const [priority, setPriority] = useState<PriorityLevel>("High");
  const [leadStatus, setLeadStatus] = useState<LeadStage>("UNASSIGNED");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [notes, setNotes] = useState("");
  const [recommendedSponsorshipType, setRecommendedSponsorshipType] = useState("CASH");
  const [recommendedAskMin, setRecommendedAskMin] = useState<number | undefined>(undefined);
  const [recommendedAskMax, setRecommendedAskMax] = useState<number | undefined>(undefined);

  const [contactName, setContactName] = useState("");
  const [designation, setDesignation] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneType, setPhoneType] = useState<PhoneType>("direct_official");
  const [email, setEmail] = useState("");
  const [contactVerification, setContactVerification] =
    useState<ContactVerificationLevel>("VERIFIED_DECISION_MAKER");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (lead) {
      setCompanyName(lead.companyName || "");
      setIndustry(lead.industry || "Construction & Infrastructure");
      setNiche(lead.niche || "");
      setPriority(lead.priority || "High");
      setLeadStatus(lead.leadStatus || "UNASSIGNED");
      setLocation(lead.location || "");
      setWebsite(lead.website || "");
      setNotes(lead.notes || "");
      setRecommendedSponsorshipType(lead.recommendedSponsorshipType || "CASH");
      setRecommendedAskMin(lead.recommendedAskMin);
      setRecommendedAskMax(lead.recommendedAskMax);

      const ct = lead.primaryContact || (lead.contacts && lead.contacts[0]) || null;
      if (ct) {
        setContactName(ct.contactName || "");
        setDesignation(ct.designation || "");
        setPhone(ct.phone || "");
        setPhoneType(ct.phoneType || "direct_official");
        setEmail(ct.email || "");
        setContactVerification(ct.contactVerification || "VERIFIED_DECISION_MAKER");
      }
    }
  }, [lead, isOpen]);

  if (!isOpen || !lead) return null;

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
    if (!validate() || !user?.id) return;

    try {
      setIsLoading(true);
      await updateLeadMutation({
        adminClerkId: user.id,
        companyId: lead._id,
        companyName: companyName.trim(),
        industry: industry.trim(),
        niche: niche.trim(),
        priority,
        leadStatus,
        location: location.trim() || undefined,
        website: website.trim() || undefined,
        notes: notes.trim() || undefined,
        recommendedSponsorshipType: recommendedSponsorshipType.trim() || undefined,
        recommendedAskMin: recommendedAskMin ? Number(recommendedAskMin) : undefined,
        recommendedAskMax: recommendedAskMax ? Number(recommendedAskMax) : undefined,
        contactId: lead.primaryContact?._id,
        contactName: contactName.trim(),
        designation: designation.trim(),
        phone: phone.trim(),
        phoneType,
        email: email.trim() || undefined,
        contactVerification,
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      alert(`Failed to update lead: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Company Lead"
      description={`Update corporate attributes and key decision-maker contact details for ${lead.companyName}.`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1 max-h-[78vh] overflow-y-auto pr-1">
        {/* Section 1: Company Profile */}
        <div>
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
            Company Attributes
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Company Name"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              error={errors.companyName}
            />
            <Input
              label="Industry / Domain"
              required
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              error={errors.industry}
            />
            <Input
              label="Specific Niche"
              required
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              error={errors.niche}
            />
            <Select
              label="Lead Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as PriorityLevel)}
              options={[
                { value: "High", label: "P0 — High Priority" },
                { value: "Medium", label: "P1 — Medium Priority" },
                { value: "Normal", label: "P2 — Normal Priority" },
                { value: "Low", label: "P3 — Low Priority" },
              ]}
            />
            <Select
              label="Pipeline Status"
              value={leadStatus}
              onChange={(e) => setLeadStatus(e.target.value as LeadStage)}
              options={[
                { value: "UNASSIGNED", label: "UNASSIGNED" },
                { value: "ASSIGNED", label: "ASSIGNED" },
                { value: "CONTACTED", label: "CONTACTED" },
                { value: "INTERESTED", label: "INTERESTED" },
                { value: "FOLLOW_UP", label: "FOLLOW_UP" },
                { value: "PROPOSAL_REQUESTED", label: "PROPOSAL_REQUESTED" },
                { value: "PROPOSAL_SENT", label: "PROPOSAL_SENT" },
                { value: "NEGOTIATION", label: "NEGOTIATION" },
                { value: "WON", label: "WON" },
                { value: "LOST", label: "LOST" },
              ]}
            />
            <Input
              label="Location / City"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Input
              label="Website URL"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
            <Select
              label="Target Sponsorship Type"
              value={recommendedSponsorshipType}
              onChange={(e) => setRecommendedSponsorshipType(e.target.value)}
              options={[
                { value: "CASH", label: "Cash Grant / Sponsorship" },
                { value: "PRODUCT", label: "Product / In-Kind" },
                { value: "SERVICES", label: "Services / Logistics" },
                { value: "WORKSHOP", label: "Technical Workshop" },
                { value: "PRIZES", label: "Hackathon Prizes" },
                { value: "Title", label: "Title Sponsor Tier" },
                { value: "Powered By", label: "Powered By Tier" },
                { value: "Associate", label: "Associate Tier" },
              ]}
            />
          </div>
        </div>

        {/* Section 2: Contact Details */}
        <div className="border-t border-border-subtle pt-3">
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
            Primary Contact Person
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Contact Full Name"
              required
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              error={errors.contactName}
            />
            <Input
              label="Designation / Role"
              required
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              error={errors.designation}
            />
            <Input
              label="Phone Number"
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone}
            />
            <Select
              label="Phone Type"
              value={phoneType}
              onChange={(e) => setPhoneType(e.target.value as PhoneType)}
              options={[
                { value: "direct_official", label: "Direct Mobile (Decision Maker)" },
                { value: "office", label: "Direct Office Extension" },
                { value: "regional_office", label: "Kerala / South Regional Desk" },
                { value: "department", label: "Marketing / CSR Dept" },
                { value: "switchboard", label: "General Switchboard" },
                { value: "unknown", label: "Unknown / Unclassified" },
              ]}
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Select
              label="Verification Level"
              value={contactVerification}
              onChange={(e) =>
                setContactVerification(e.target.value as ContactVerificationLevel)
              }
              options={[
                { value: "VERIFIED_DECISION_MAKER", label: "Verified Decision Maker" },
                { value: "VERIFIED_COMPANY_REPRESENTATIVE", label: "Verified Representative" },
                { value: "OFFICIAL_COMPANY_CONTACT", label: "Official Public Contact" },
                { value: "UNVERIFIED", label: "Unverified" },
              ]}
            />
          </div>
        </div>

        {/* Section 3: Notes */}
        <div className="border-t border-border-subtle pt-3">
          <label className="block text-xs font-semibold text-text-secondary mb-1">
            Outreach & Qualification Notes
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface p-2.5 text-xs text-text-primary focus:border-primary focus:outline-none"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-border-subtle pt-3">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
