'use client'

import { useState } from "react";
import  Input  from "@/components/Tasks/Input";
import  Button  from "@/components/Tasks/Button";
import { Bell } from "lucide-react";

export default function NewTaskForm() {

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
                    placeholder ="e.g Submit IFT211 Assignment"/>
                </div>

                <div>
                    <h4>Task Type</h4>
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
                        label = " Event "
                        value = "Event "
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
                    placeholder="its optional, e.g Elective, Required e.t.c"/>
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
                        value = "App"
                        isSelected = {formData.channel === "App"}
                        onSelect = {() => updateField('channel', 'App')}/>

                        <Button
                        label = " Both "
                        value = "Both"
                        isSelected = {formData.channel === "Both"}
                        onSelect = {() => updateField('channel', 'Both')}/>
                    </div>
                 </div>
                
                {/* Reminder Preview */}
                 <div></div>
            </div>

            <hr/>
            
            <div>
                {/* <Button /> */}
                {/* <Button /> */}
            </div>
        </div>
    )
}