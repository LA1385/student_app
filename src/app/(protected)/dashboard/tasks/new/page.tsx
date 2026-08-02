'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import  Input  from "@/components/Tasks/Input";
import  Button  from "@/components/Tasks/Button";
import { Bell } from "lucide-react";
import { Loader2 } from "lucide-react";


export default function NewTaskForm() {
    const router = useRouter();
    const [isDisabled, setIsDisabled] = useState(false);
    const [formData, setFormData] = useState({
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
    const updateField = (field:string, value:string) => {
        {setFormData(prev => ({...prev, [field]: value}) )}
    }
     const [errors, setErrors] = useState({});

     const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.title) newErrors.title = "Title is required";
        if (!formData.type) newErrors.type = "Type is required";
        if (!formData.dueDate) newErrors.dueDate = "Due date is required";
        if (!formData.daysBefore) newErrors.daysBefore = "Days before is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }


    const payload = {
        title: formData.title,
        type: formData.type,
        dueDate: formData.dueDate,
        priority: formData.priority,
        category: formData.category,
        time: formData.time,
        daysBefore: formData.daysBefore === "Custom" ? Number(formData.customDays) : Number(formData.daysBefore),
        channel: formData.channel
    }

    const  handleSubmit = async()   => {
        // Validate form data before submission
        if (!validateForm()) {
            return;
        }
        setIsDisabled(true);
        try{
            const response = await fetch('/api/tasks', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
            // Task created successfully
                router.push('/dashboard');
            }
            else {
                const errorData = await response.json();
                console.error('Error creating task:', errorData);
                alert('Failed to create task. Please try again.');
            }
            } catch (error) {
                console.error('Error submitting task:', error);
            }
            finally {
                setIsDisabled(false);
            }
        }

    return (
        <div>
            {/* Task Form Heading */}
            <div>
                <h1>Create New Task</h1>
                <p>Curate your academic schedule with precision</p>
            </div>
            
            <div>
                <div>
                    <Input
                    inputTitle ="Task Title"
                    type = 'text'
                    value = {formData.title}
                    onChange = {(e) => updateField('title', e.target.value)}
                    placeholder ="e.g Submit IFT211 Assignment"
                    error = {errors.title}
                    />
                </div>

                <div>
                    <h4>Task Type</h4>
                    {errors.type && <p className="text-red-500">{errors.type}</p>}
                    <div>
                        <Button
                        label = " Assignment "
                        value = "Assignment"
                        isSelected = {formData.type === "Assignment"}
                        onSelect = {() => updateField('type', 'Assignment')}/>

                        <Button
                        label = " Test "
                        value = "Test"
                        isSelected = {formData.type === "Test"}
                        onSelect = {() => updateField('type', 'Test')}/>

                        <Button
                        label = " Exam "
                        value = "Exam"
                        isSelected = {formData.type === "Exam"}
                        onSelect = {() => updateField('type', 'Exam')}/>

                        <Button
                        label = "Event"
                        value = "Event"
                        isSelected = {formData.type === "Event"}
                        onSelect = {() => updateField('type', 'Event')}/>

                        <Button
                        label = " Personal "
                        value = "Personal"
                        isSelected = {formData.type === "Personal"}
                        onSelect = {() => updateField('type', 'Personal')}/>
                    </div>
                </div>

                <div>
                    <Input 
                    inputTitle = "Due Date"
                    type = "date"
                    value = {formData.dueDate}
                    onChange={(e) => updateField('dueDate', e.target.value)}
                    error = {errors.dueDate}
                    />
                </div>

                <div>
                    <Input 
                    inputTitle="Time"
                    type="time"
                    value = {formData.time}
                    onChange={(e) => updateField('time', e.target.value)} 
                    />
                </div>

                <div>
                    <h4>Priority</h4>
                    <div>
                        <Button
                        label = " Low "
                        value = "Low"
                        isSelected = {formData.priority === "Low"}
                        onSelect = {() => updateField('priority', 'Low')}/>
                        <Button
                        label = " Medium "
                        value = "Medium"
                        isSelected = {formData.priority === "Medium"}
                        onSelect = {() => updateField('priority', 'Medium')}/>
                        <Button
                        label = " High "
                        value = "High"
                        isSelected = {formData.priority === "High"}
                        onSelect = {() => updateField('priority', 'High')}/>
                    </div>
                </div>

                <div>
                    <Input
                    inputTitle= "Category"
                    type="text"
                    value = {formData.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    placeholder="its optional, e.g Elective, Required e.t.c"
                    error = {errors.category}
                />
            </div>


            </div>
            {/* Reminders & Notification */}
            <div>
                {/* Headings */}
                <div> 
                    <Bell/>
                    <h3>Reminders & Notification</h3>
                </div>

                 <div>
                    <h4>Remind me</h4>
                    <div>
                        <Button
                        label = " 3 Days Before "
                        value = "3"
                        isSelected = {formData.daysBefore === "3"}
                        onSelect = {() => updateField('daysBefore', '3')}/>
                        
                        <Button
                        label = " 1 Days Before "
                        value = "1"
                        isSelected = {formData.daysBefore === "1"}
                        onSelect = {() => updateField('daysBefore', '1')}/>

                        <Button
                        label = " 1 week Before "
                        value = "7"
                        isSelected = {formData.daysBefore === "7"}
                        onSelect = {() => updateField('daysBefore', '7')}/>
                        
                        <Button
                        label=" Custom "
                        value="Custom"
                        isSelected={formData.daysBefore === "Custom"}
                        onSelect={() => updateField('daysBefore', 'Custom')}/>

                        {formData.daysBefore === "Custom" && (
                            <Input
                                inputTitle="Custom days"
                                type="text"
                                value={formData.customDays}
                                onChange={(e) => updateField('customDays', e.target.value)}
                                placeholder="e.g. 5"
                            />
                        )}
                    </div>
                 </div>

                 <div>
                    <h4>Notify Via</h4>
                    <div>
                        <Button
                        label = " Email "
                        value = "Email"
                        isSelected = {formData.channel === "Email"}
                        onSelect = {() => updateField('channel', 'Email')}/>

                        <Button
                        label = " In app notification "
                        value = "In-app"
                        isSelected = {formData.channel === "In-app"}
                        onSelect = {() => updateField('channel', 'In-app')}/>

                        <Button
                        label = " Both "
                        value = "Both"
                        isSelected = {formData.channel === "Both"}
                        onSelect = {() => updateField('channel', 'Both')}/>
                    </div>
                 </div>
                
                {/* Reminder Preview */}
                 <div>
                    <h4>Reminder Preview</h4>
                    <div>You&apos;ll be reminded <b> { formData.daysBefore } days before</b>, via <b>{ formData.channel } </b>. This ensures you have ample time to curate your best work.</div>
                 </div>
            </div>

            <hr/>
            
            <div>
                {/* Cancel <Button /> */}
                <button onClick = { () => router.back() }>Cancel</button>
                {/*Save task <Button /> */}
                <button 
                 onClick={handleSubmit}
                 >
                    {isDisabled ? <Loader2 className="animate-spin" /> : "Save Task"}
                 </button>
            </div>
        </div>
    )
}