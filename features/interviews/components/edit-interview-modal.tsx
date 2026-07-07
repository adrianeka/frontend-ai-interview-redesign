"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { interviewService } from "@/features/interviews/services/interview-service";
import { InterviewAlertModal, AlertType } from "./interview-alert-modal";
import { EditInterviewModalProps } from "../types/interview";
import { Button } from "@/components/ui/button";

/**
 * Zod schema for validating the interview edit form.
 */
const formSchema = z.object({
  name: z.string().min(1, "This field is required."),
  companyNamePartner: z.string().optional(),
  description: z.string().optional(),
  context: z.string().min(1, "This field is required."),
  objective: z.string().min(1, "This field is required."),
  purpose: z.string().min(1, "This field is required."),
  number: z.string().min(1, "This field is required."),
  roleTarget: z.string().min(1, "This field is required."),
  levelTarget: z.string().min(1, "This field is required."),
  technology: z.string().min(1, "This field is required."),
  language: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

/**
 * Modal component for editing an existing interview's details.
 * Contains a complex form with multi-field validation using Zod and React Hook Form.
 * Integrates with `InterviewAlertModal` to confirm successful updates.
 */
export function EditInterviewModal({ isOpen, onClose, availableLevels = [], initialData, onSuccess }: EditInterviewModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [alertType, setAlertType] = React.useState<AlertType | null>(null);
  const [formData, setFormData] = React.useState<FormData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      companyNamePartner: "",
      description: "",
      context: "",
      objective: "",
      purpose: "",
      number: "",
      roleTarget: "",
      levelTarget: "",
      technology: "",
      language: "",
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (initialData) {
        reset({
          name: initialData.name || "",
          companyNamePartner: initialData.companyNamePartner || "",
          description: initialData.description || "",
          context: initialData.context || "",
          objective: initialData.objective || "",
          purpose: initialData.purpose || "",
          number: initialData.number ? initialData.number.toString() : "",
          roleTarget: initialData.roleTarget || "",
          levelTarget: initialData.levelTarget || "",
          technology: initialData.technology || "",
          language: initialData.language || "",
        });
      }
      setAlertType(null);
      setFormData(null);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialData, reset]);

  const onInitSubmit = (data: FormData) => {
    setFormData(data);
    setAlertType("confirmation");
  };

  const executeUpdate = async () => {
    if (!formData || !initialData) return;
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        companyNamePartner: formData.companyNamePartner,
        description: formData.description,
        context: formData.context,
        objective: formData.objective,
        purpose: formData.purpose,
        roleTarget: formData.roleTarget,
        levelTarget: formData.levelTarget,
        technology: formData.technology,
        number: parseInt(formData.number, 10),
        language: formData.language,
        createdBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      };

      await interviewService.updateInterview(initialData.id, payload);
      setAlertType("success");
    } catch (error) {
      console.error(error);
      setAlertType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAlertPrimary = () => {
    if (alertType === "confirmation") {
      executeUpdate();
    } else if (alertType === "success" || alertType === "error") {
      // Back to Home
      onClose();
      if (alertType === "success" && onSuccess) onSuccess();
      setAlertType(null);
    }
  };

  const handleAlertSecondary = () => {
    if (alertType === "confirmation") {
      // Go Back to Edit
      setAlertType(null);
    } else if (alertType === "success") {
      // View Interview Details
      onClose();
      if (onSuccess) onSuccess();
      setAlertType(null);
    } else if (alertType === "error") {
      // Try Again
      executeUpdate();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6" id="editInterviewModal">
        <div
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          id="modalBackdrop"
          onClick={onClose}
        ></div>

        <div className="relative w-full max-w-[684px] bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-white sticky top-0 z-10">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Edit Session Title</h2>
              <p className="text-sm text-slate-500 mt-1">Please update the form below to save changes.</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              id="closeModalIcon"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <img
                src="/x-circle.svg"
                alt="close"
                className="w-5 h-5"
              />
            </Button>
          </div>

          <div className="px-6 py-6 overflow-y-auto">
            <form className="space-y-6" id="editInterviewForm" onSubmit={handleSubmit(onInitSubmit)}>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Interview Session Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("name")}
                  className={`w-[609px] px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow ${errors.name ? 'border-red-500' : 'border-slate-200'}`}
                  placeholder="Name of the interview"
                  type="text"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Partner's Company Name
                </label>
                <input
                  {...register("companyNamePartner")}
                  className={`w-[609px] px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow ${errors.companyNamePartner ? 'border-red-500' : 'border-slate-200'}`}
                  placeholder="Name of the partner's company"
                  type="text"
                />
                {errors.companyNamePartner && <p className="text-red-500 text-xs mt-1">{errors.companyNamePartner.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  className={`w-[609px] min-h-[100px] px-4 py-[14px] border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow ${errors.description ? 'border-red-500' : 'border-slate-200'}`}
                  placeholder="Description of the interview"
                ></textarea>
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Context <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("context")}
                  className={`w-[609px] min-h-[100px] px-4 py-[14px] border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow ${errors.context ? 'border-red-500' : 'border-slate-200'}`}
                  placeholder="Context of the interview"
                ></textarea>
                {errors.context && <p className="text-red-500 text-xs mt-1">{errors.context.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Objective <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("objective")}
                  className={`w-[609px] min-h-[100px] px-4 py-[14px] border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow ${errors.objective ? 'border-red-500' : 'border-slate-200'}`}
                  placeholder="Objective of the interview"
                ></textarea>
                {errors.objective && <p className="text-red-500 text-xs mt-1">{errors.objective.message}</p>}
              </div>

              <div className="flex gap-[16px]">
                <div className="w-[296.5px]">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Interview Purpose <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select {...register("purpose")} className={`w-full h-[48px] px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow appearance-none bg-white text-slate-900 ${errors.purpose ? 'border-red-500' : 'border-slate-200'}`}>
                      <option value="" disabled>Choose Purpose</option>
                      <option value="HIRING">Hiring</option>
                      <option value="INTERNAL_ASSESSMENT">Internal Assessment</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                    </div>
                  </div>
                  {errors.purpose && <p className="text-red-500 text-xs mt-1">{errors.purpose.message}</p>}
                </div>
                <div className="w-[296.5px]">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Number of Question(s) <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("number")}
                    type="number"
                    className={`w-full h-[48px] px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-white text-slate-900 ${errors.number ? 'border-red-500' : 'border-slate-200'}`}
                    placeholder="Enter number of questions"
                  />
                  {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number.message}</p>}
                </div>
              </div>

              <div className="flex gap-[16px]">
                <div className="w-[296.5px]">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Role Target <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("roleTarget")}
                    type="text"
                    className={`w-full h-[48px] px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-white text-slate-900 ${errors.roleTarget ? 'border-red-500' : 'border-slate-200'}`}
                    placeholder="Enter role target"
                  />
                  {errors.roleTarget && <p className="text-red-500 text-xs mt-1">{errors.roleTarget.message}</p>}
                </div>
                <div className="w-[296.5px]">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Level Target <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("levelTarget")}
                    type="text"
                    className={`w-full h-[48px] px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-white text-slate-900 ${errors.levelTarget ? 'border-red-500' : 'border-slate-200'}`}
                    placeholder="Enter level target"
                  />
                  {errors.levelTarget && <p className="text-red-500 text-xs mt-1">{errors.levelTarget.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Language
                </label>
                <div className="relative w-[609px]">
                  <select {...register("language")} className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow appearance-none bg-white text-slate-900 ${errors.language ? 'border-red-500' : 'border-slate-200'}`}>
                    <option value="" disabled>Choose Language</option>
                    <option value="EN">English</option>
                    <option value="IN">Indonesia</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  </div>
                </div>
                {errors.language && <p className="text-red-500 text-xs mt-1">{errors.language.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Technology(s) <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("technology")}
                  className={`w-[609px] min-h-[100px] px-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow ${errors.technology ? 'border-red-500' : 'border-slate-200'}`}
                  placeholder="Ex. React Js, Springboot, etc"
                ></textarea>
                {errors.technology && <p className="text-red-500 text-xs mt-1">{errors.technology.message}</p>}
              </div>
            </form>
          </div>

          <div className="px-6 py-4 bg-slate-50 rounded-b-2xl border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0">
            <Button
              type="button"
              variant="ghost"
              disabled={isSubmitting}
              id="closeModalBtn"
              onClick={onClose}
              className="h-[44px] px-5 bg-[#dcf3f9] text-[#00a8cc] rounded-lg text-sm font-bold hover:bg-blue-100 disabled:opacity-50"
            >
              Cancel
            </Button>
            <Button
              className="h-auto px-5 py-2.5 bg-[#0070c9] text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:bg-slate-300 flex items-center justify-center gap-2"
              type="submit"
              form="editInterviewForm"
              disabled={isSubmitting || initialData?.isEditable === false}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <InterviewAlertModal
        isOpen={!!alertType}
        mode="update"
        type={alertType || "confirmation"}
        isLoading={isSubmitting}
        onPrimaryAction={handleAlertPrimary}
        onSecondaryAction={handleAlertSecondary}
      />
    </>
  );
}
