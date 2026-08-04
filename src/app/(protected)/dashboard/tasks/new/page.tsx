'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Tasks/Input";
import Button from "@/components/Tasks/Button";
import { Bell } from "lucide-react";
import { Loader2 } from "lucide-react";
import { buildDueDateTime } from "@/lib/utils";

// ---------- Types ----------

type FormData = {
    title: string;
    type: string;
    dueDate: string;
    time: string;
    priority: string;
    category: string;
    daysBefore: string | null;
    customDays: string;
    channel: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function NewTaskForm() {
    const router = useRouter();

    // ---------- State ----------

    const [isDisabled, setIsDisabled] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        title: "",
        type: "",
        dueDate: "",
        time: "",
        priority: "Medium",
        category: "",
        daysBefore: null,
        customDays: "",
        channel: "Both"
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // ---------- Handlers ----------

    const updateField = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        const newErrors: FormErrors = {};
        if (!formData.title) newErrors.title = "Title is required";
        if (!formData.type) newErrors.type = "Type is required";
        if (!formData.dueDate) newErrors.dueDate = "Due date is required";
        if (!formData.daysBefore) newErrors.daysBefore = "Days before is required";
        if (formData.daysBefore === "Custom" && !formData.customDays) {
            newErrors.customDays = "Enter a number of days";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        const payload = {
            title: formData.title,
            type: formData.type,
            dueDate: buildDueDateTime(formData.dueDate, formData.time),
            priority: formData.priority,
            category: formData.category,
            daysBefore: formData.daysBefore === "Custom"
                ? Number(formData.customDays)
                : Number(formData.daysBefore),
            channel: formData.channel
        };

        setIsDisabled(true);
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                router.push('/dashboard');
            } else {
                const errorData = await response.json();
                console.error('Error creating task:', errorData);
                alert('Failed to create task. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting task:', error);
        } finally {
            setIsDisabled(false);
        }
    };

    // ---------- Render ----------

    return (
        <div className="pt-14">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-text-secondary">Tasks / New Task</p>
                    <h1 className="text-3xl font-bold text-text sm:text-4xl">Create New Task</h1>
                    <p className="max-w-2xl text-sm leading-6 text-text-secondary">Curate your academic schedule with precision</p>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
                    <section className="space-y-6 rounded-[2rem] border border-border bg-bg-card p-6 shadow-sm transition-colors duration-200 sm:p-8">
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <Input
                                    inputTitle="Task Title"
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => updateField('title', e.target.value)}
                                    placeholder="e.g. Submit IFT211 Assignment"
                                    error={errors.title}
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between gap-4">
                                    <h2 className="text-base font-semibold text-text">Task Type</h2>
                                    {errors.type ? <p className="text-sm font-medium text-urgent">{errors.type}</p> : null}
                                </div>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                                    <Button
                                        label="Assignment"
                                        value="Assignment"
                                        isSelected={formData.type === "Assignment"}
                                        onSelect={() => updateField('type', 'Assignment')} />
                                    <Button
                                        label="Test"
                                        value="Test"
                                        isSelected={formData.type === "Test"}
                                        onSelect={() => updateField('type', 'Test')} />
                                    <Button
                                        label="Exam"
                                        value="Exam"
                                        isSelected={formData.type === "Exam"}
                                        onSelect={() => updateField('type', 'Exam')} />
                                    <Button
                                        label="Event"
                                        value="Event"
                                        isSelected={formData.type === "Event"}
                                        onSelect={() => updateField('type', 'Event')} />
                                    <Button
                                        label="Personal"
                                        value="Personal"
                                        isSelected={formData.type === "Personal"}
                                        onSelect={() => updateField('type', 'Personal')} />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
                                <Input
                                    inputTitle="Due Date"
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => updateField('dueDate', e.target.value)}
                                    error={errors.dueDate}
                                />
                                <Input
                                    inputTitle="Time"
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => updateField('time', e.target.value)}
                                />
                            </div>

                            <div className="space-y-3">
                                <h2 className="text-base font-semibold text-text">Priority</h2>
                                <div className="grid grid-cols-3 gap-3">
                                    <Button
                                        label="Low"
                                        value="Low"
                                        isSelected={formData.priority === "Low"}
                                        onSelect={() => updateField('priority', 'Low')} />
                                    <Button
                                        label="Medium"
                                        value="Medium"
                                        isSelected={formData.priority === "Medium"}
                                        onSelect={() => updateField('priority', 'Medium')} />
                                    <Button
                                        label="High"
                                        value="High"
                                        isSelected={formData.priority === "High"}
                                        onSelect={() => updateField('priority', 'High')} />
                                </div>
                            </div>

                            <div>
                                <Input
                                    inputTitle="Category"
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => updateField('category', e.target.value)}
                                    placeholder="e.g. CSC301, Elective"
                                />
                            </div>
                        </div>
                    </section>

                    <aside className="rounded-[2rem] border border-border bg-bg-card p-6 shadow-sm transition-colors duration-200 sm:p-8">
                        <div className="flex items-center gap-3 text-text">
                            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                                <Bell className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-text">Reminders & Notifications</p>
                                <p className="text-sm text-text-secondary">Choose when and how you want to be notified.</p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-6 rounded-3xl border-l-4 border-primary/75 bg-bg-card p-5 sm:p-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between gap-4">
                                    <h3 className="text-sm font-semibold text-text">Remind me</h3>
                                    {errors.daysBefore ? <p className="text-sm font-medium text-urgent">{errors.daysBefore}</p> : null}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        label="1 day before"
                                        value="1"
                                        isSelected={formData.daysBefore === "1"}
                                        onSelect={() => updateField('daysBefore', '1')} />
                                    <Button
                                        label="3 days before"
                                        value="3"
                                        isSelected={formData.daysBefore === "3"}
                                        onSelect={() => updateField('daysBefore', '3')} />
                                    <Button
                                        label="1 week before"
                                        value="7"
                                        isSelected={formData.daysBefore === "7"}
                                        onSelect={() => updateField('daysBefore', '7')} />
                                    <Button
                                        label="Custom"
                                        value="Custom"
                                        isSelected={formData.daysBefore === "Custom"}
                                        onSelect={() => updateField('daysBefore', 'Custom')} />
                                </div>

                                {formData.daysBefore === "Custom" && (
                                    <Input
                                        inputTitle="Custom days"
                                        type="text"
                                        value={formData.customDays}
                                        onChange={(e) => updateField('customDays', e.target.value)}
                                        placeholder="e.g. 5"
                                        error={errors.customDays}
                                    />
                                )}
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-text">Notify via</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    <Button
                                        label="Email"
                                        value="Email"
                                        isSelected={formData.channel === "Email"}
                                        onSelect={() => updateField('channel', 'Email')} />
                                    <Button
                                        label="In-app"
                                        value="In-app"
                                        isSelected={formData.channel === "In-app"}
                                        onSelect={() => updateField('channel', 'In-app')} />
                                    <Button
                                        label="Both"
                                        value="Both"
                                        isSelected={formData.channel === "Both"}
                                        onSelect={() => updateField('channel', 'Both')} />
                                </div>
                            </div>

                            <div className="rounded-3xl border border-border bg-bg-input p-5">
                                <p className="text-sm font-semibold text-text">Reminder Preview</p>
                                <p className="mt-3 text-sm leading-6 text-text-secondary">
                                    You&apos;ll be reminded <span className="font-semibold text-text">{formData.daysBefore === "Custom" ? formData.customDays : formData.daysBefore} days before</span>, via <span className="font-semibold text-text">{formData.channel}</span>. This ensures you have ample time to curate your best work.
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
                <hr className="mt-4"  />
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="inline-flex min-h-[44px] items-center justify-center rounded-3xl border border-border bg-bg-input px-6 py-3 text-sm font-semibold text-text transition-colors duration-200 hover:bg-bg-card"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="inline-flex min-h-[44px] items-center justify-center rounded-3xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
                        disabled={isDisabled}
                    >
                        {isDisabled ? <Loader2 className="animate-spin" /> : "Save Task"}
                    </button>
                </div>
            </div>
        </div>
    )
}